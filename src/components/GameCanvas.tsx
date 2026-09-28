import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  PlayerState,
  PlayerConfig,
  Platform,
  Projectile,
  WeaponPickup,
  PowerUpPickup,
  Particle,
  FloatingText,
  FirePatch,
  ActiveEvent,
  GameMode,
  ArenaMap,
  RandomEventType,
  WeaponType,
  PowerUpType,
  PlayerId,
  GameSettings,
  PlayerKeyBindingsMap,
} from '../types/game';
import { MAPS } from '../engine/maps';
import {
  createInitialPlayer,
  updatePlayerMovement,
  updateProjectiles,
  WEAPON_CONFIG,
} from '../engine/physics';
import { computeAIInputs } from '../engine/ai';
import { renderGame, CameraState } from '../engine/renderer';
import { sounds } from '../audio/soundEngine';
import { DEFAULT_KEY_BINDINGS, isKeyPressed } from '../engine/keybindings';

interface GameCanvasProps {
  playerConfigs: PlayerConfig[];
  settings: GameSettings;
  isPaused: boolean;
  keyBindings?: PlayerKeyBindingsMap;
  onRoundOver: (winnerId: PlayerId | null) => void;
  onMatchOver: (championId: PlayerId) => void;
  onUpdateScore: (playerId: PlayerId, deltaScore: number, points?: number) => void;
  onHUDUpdate?: (data: {
    players: PlayerState[];
    roundTimer: number;
    activeEvent: ActiveEvent | null;
    nextEventTimer: number;
    rouletteTimer: number;
  }) => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  playerConfigs,
  settings,
  isPaused,
  keyBindings,
  onRoundOver,
  onMatchOver,
  onUpdateScore,
  onHUDUpdate,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Active Map (Apex Warzone is strictly exclusive to Battle Royale mode)
  const rawMap = MAPS.find((m) => m.id === settings.selectedMap) || MAPS[0];
  const map: ArenaMap =
    settings.mode !== 'battle_royale' && rawMap.id === 'grand_battle_royale'
      ? MAPS.find((m) => m.id !== 'grand_battle_royale') || MAPS[1]
      : rawMap;

  // Keep playerConfigs reference up to date without re-triggering round resets
  const playerConfigsRef = useRef<PlayerConfig[]>(playerConfigs);
  playerConfigsRef.current = playerConfigs;

  // Game Entities Refs (mutable for 60FPS loop)
  const playersRef = useRef<PlayerState[]>([]);
  const projectilesRef = useRef<Projectile[]>([]);
  const weaponPickupsRef = useRef<WeaponPickup[]>([]);
  const powerUpPickupsRef = useRef<PowerUpPickup[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const floatingTextsRef = useRef<FloatingText[]>([]);
  const firePatchesRef = useRef<FirePatch[]>([]);
  const hudThrottleRef = useRef<number>(0);
  const infectedRespawnTimersRef = useRef<{ [id: number]: number }>({});
  const lastSurvivorIdRef = useRef<PlayerId | null>(null);
  
  // Game Loop Timers
  const roundTimerRef = useRef<number>(0);
  const nextEventTimerRef = useRef<number>(settings.mode === 'chaos' ? 12 : 28);
  const activeEventRef = useRef<ActiveEvent | null>(null);
  const rouletteTimerRef = useRef<number>(10);
  const pickupSpawnTimerRef = useRef<number>(6);
  const roundEndingRef = useRef<boolean>(false);

  // Battle Royale Safe Zone
  const safeZoneCenterRef = useRef<{ x: number; y: number }>({ x: map.width / 2, y: map.height / 2 });
  const safeZoneRadiusRef = useRef<number>(map.width * 0.7);

  // Camera
  const cameraRef = useRef<CameraState>({
    x: map.width / 2,
    y: map.height / 2,
    zoom: 1.0,
    shake: 0,
  });

  // Key States
  const keysDownRef = useRef<{ [code: string]: boolean }>({});

  // Initialize Round
  const startNewRound = useCallback(() => {
    roundEndingRef.current = false;
    roundTimerRef.current = 0;
    nextEventTimerRef.current = settings.mode === 'chaos' ? 10 : 28;
    activeEventRef.current = null;
    rouletteTimerRef.current = 10;
    pickupSpawnTimerRef.current = 5;
    infectedRespawnTimersRef.current = {};

    safeZoneCenterRef.current = { x: map.width / 2, y: map.height / 2 };
    safeZoneRadiusRef.current = map.width * 0.65;

    projectilesRef.current = [];
    particlesRef.current = [];
    floatingTextsRef.current = [];
    firePatchesRef.current = [];

    // Spawn enabled players at designated spawn points
    const currentConfigs = playerConfigsRef.current;
    const enabledPlayers = currentConfigs.filter((p) => p.enabled);

    // If Infection Mode: pick one random patient zero zombie
    const initialInfectedIndex =
      settings.mode === 'infection'
        ? Math.floor(Math.random() * enabledPlayers.length)
        : -1;

    const newPlayers: PlayerState[] = enabledPlayers.map((cfg, index) => {
      // In Team Deathmatch, spawn Red team on left, Blue on right
      let spIndex = index % map.spawnPoints.length;
      if (settings.mode === 'team_deathmatch') {
        const isRed = (cfg.team || (index % 2 === 0 ? 'red' : 'blue')) === 'red';
        const teamIndex = enabledPlayers.filter((p, i) => i < index && (p.team === cfg.team || (p.team === undefined && i % 2 === (isRed ? 0 : 1)))).length;
        spIndex = isRed ? teamIndex % map.spawnPoints.length : Math.max(0, map.spawnPoints.length - 1 - teamIndex);
      }
      const sp = map.spawnPoints[spIndex] || map.spawnPoints[0];
      const playerState = createInitialPlayer(cfg.id, sp.x, sp.y);
      playerState.team = cfg.team || (index % 2 === 0 ? 'red' : 'blue');
      playerState.isInfected =
        settings.mode === 'infection' ? index === initialInfectedIndex : false;

      // The Hero Mode: 300 HP and Battleaxe only
      if (settings.mode === 'the_hero') {
        playerState.hp = 300;
        playerState.maxHp = 300;
        playerState.weapon = 'axe';
        playerState.ammo = 999;
        playerState.maxAmmo = 999;
      }

      return playerState;
    });

    playersRef.current = newPlayers;

    // Initialize Camera to directly frame the human player right from round start
    const initialHumanCfg = enabledPlayers.find((p) => p.type === 'human');
    const initialHuman = initialHumanCfg
      ? newPlayers.find((p) => p.id === initialHumanCfg.id)
      : newPlayers[0];

    if (initialHuman) {
      cameraRef.current.x = initialHuman.x;
      cameraRef.current.y = initialHuman.y - 25;
      cameraRef.current.zoom = 1.15;
    } else {
      cameraRef.current.x = map.width / 2;
      cameraRef.current.y = map.height / 2;
      cameraRef.current.zoom = 1.0;
    }

    if (settings.mode === 'infection' && initialInfectedIndex >= 0) {
      const patientZero = newPlayers[initialInfectedIndex];
      const cfg = enabledPlayers[initialInfectedIndex];
      sounds.playInfect();
      floatingTextsRef.current.push({
        id: Math.random().toString(),
        text: `PATIENT ZERO: ${cfg.name.toUpperCase()} INFECTED!`,
        x: patientZero.x,
        y: patientZero.y - 50,
        vy: -1.5,
        color: '#22c55e',
        alpha: 1,
        scale: 1.4,
      });

      // Track initial survivors; if only 1 survivor starts with the zombie, record as last survivor
      const initialSurvivors = enabledPlayers.filter((_, i) => i !== initialInfectedIndex);
      if (initialSurvivors.length === 1) {
        lastSurvivorIdRef.current = initialSurvivors[0].id;
      } else {
        lastSurvivorIdRef.current = null;
      }
    } else {
      lastSurvivorIdRef.current = null;
    }

    // Initial Weapon Spawns: STRICTLY DISABLED in Infection Mode!
    if (settings.mode !== 'infection') {
      let initialDrops: WeaponPickup[] = [];

      if (settings.mode === 'the_hero') {
        // In The Hero mode: ONLY AXES allowed and visible on the ground!
        initialDrops = [
          {
            id: Math.random().toString(),
            type: 'axe',
            x: map.width * 0.28,
            y: map.height * 0.45,
            vx: 0,
            vy: 0,
            ammo: 999,
            grounded: false,
          },
          {
            id: Math.random().toString(),
            type: 'axe',
            x: map.width * 0.72,
            y: map.height * 0.45,
            vx: 0,
            vy: 0,
            ammo: 999,
            grounded: false,
          },
          {
            id: Math.random().toString(),
            type: 'axe',
            x: map.width * 0.5,
            y: map.height * 0.32,
            vx: 0,
            vy: 0,
            ammo: 999,
            grounded: false,
          },
        ];
      } else {
        initialDrops = [
          {
            id: Math.random().toString(),
            type: 'sword',
            x: map.width * 0.28,
            y: map.height * 0.45,
            vx: 0,
            vy: 0,
            ammo: 14,
            grounded: false,
          },
          {
            id: Math.random().toString(),
            type: 'gun',
            x: map.width * 0.72,
            y: map.height * 0.45,
            vx: 0,
            vy: 0,
            ammo: 12,
            grounded: false,
          },
          {
            id: Math.random().toString(),
            type: 'rocket',
            x: map.width * 0.5,
            y: map.height * 0.3,
            vx: 0,
            vy: 0,
            ammo: 4,
            grounded: false,
          },
        ];

        // Add Axe in Battle Royale!
        if (settings.mode === 'battle_royale') {
          initialDrops.push({
            id: Math.random().toString(),
            type: 'axe',
            x: map.width * 0.5,
            y: map.height * 0.6,
            vx: 0,
            vy: 0,
            ammo: 14,
            grounded: false,
          });
          initialDrops.push({
            id: Math.random().toString(),
            type: 'axe',
            x: map.width * 0.15,
            y: map.height * 0.5,
            vx: 0,
            vy: 0,
            ammo: 14,
            grounded: false,
          });
        }
      }

      weaponPickupsRef.current = initialDrops;

      powerUpPickupsRef.current = [
        {
          id: Math.random().toString(),
          type: 'shield',
          x: map.width * 0.5,
          y: map.height * 0.5,
          duration: 25,
          bobOffset: 0,
        },
        {
          id: Math.random().toString(),
          type: 'jetpack',
          x: map.width * 0.35,
          y: map.height * 0.38,
          duration: 35,
          bobOffset: 0,
        },
        {
          id: Math.random().toString(),
          type: 'jetpack',
          x: map.width * 0.65,
          y: map.height * 0.38,
          duration: 35,
          bobOffset: 0,
        },
      ];
    } else {
      // In Infection Mode: Zero weapons and zero power-ups!
      weaponPickupsRef.current = [];
      powerUpPickupsRef.current = [];
    }
  }, [map, settings.mode]);

  useEffect(() => {
    startNewRound();
  }, [startNewRound]);

  // Key Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysDownRef.current[e.code] = true;
      keysDownRef.current[e.key] = true;
      // Prevent scrolling on arrows/space
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysDownRef.current[e.code] = false;
      keysDownRef.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Main 60FPS Game Loop
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      animId = requestAnimationFrame(loop);

      const dt = Math.min((currentTime - lastTime) / 1000, 0.05); // cap at 50ms to prevent spiral
      lastTime = currentTime;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (!isPaused) {
        // 1. Advance Game Timers
        roundTimerRef.current += dt;

        // 2. Random Event System
        if (activeEventRef.current) {
          activeEventRef.current.timeRemaining -= dt;
          if (activeEventRef.current.timeRemaining <= 0) {
            activeEventRef.current = null;
          }
        } else {
          nextEventTimerRef.current -= dt;
          if (nextEventTimerRef.current <= 0) {
            triggerRandomEvent();
            nextEventTimerRef.current = settings.mode === 'chaos' ? 10 : 30;
          }
        }

        // 3. Weapon Roulette Mode System
        if (settings.mode === 'weapon_roulette') {
          rouletteTimerRef.current -= dt;
          if (rouletteTimerRef.current <= 0) {
            rollWeaponRoulette();
            rouletteTimerRef.current = 10;
          }
        }

        // 4. Battle Royale Safe Zone Shrinking
        if (settings.mode === 'battle_royale') {
          const shrinkRate = 14; // pixels per sec
          safeZoneRadiusRef.current = Math.max(90, safeZoneRadiusRef.current - shrinkRate * dt);

          // Apply toxic storm damage to players outside radius
          for (const player of playersRef.current) {
            if (!player.isAlive) continue;
            const dist = Math.hypot(
              player.x - safeZoneCenterRef.current.x,
              player.y - safeZoneCenterRef.current.y
            );
            if (dist > safeZoneRadiusRef.current) {
              player.hp -= 4.0 * dt;
              if (Math.random() < 0.2) {
                floatingTextsRef.current.push({
                  id: Math.random().toString(),
                  text: 'STORM -4',
                  x: player.x,
                  y: player.y - 25,
                  vy: -1.0,
                  color: '#c084fc',
                  alpha: 0.9,
                  scale: 0.8,
                });
              }
              if (player.hp <= 0) {
                player.isAlive = false;
                player.hp = 0;
                sounds.playDeath();
              }
            }
          }
        }

        // 5. King of the Hill Points & Hill Zone Drain System (-5 HP/s)
        let hillControllingPlayer: PlayerState | null = null;
        if (map.hillZone) {
          const hz = map.hillZone;
          for (const player of playersRef.current) {
            if (!player.isAlive) continue;
            const inZone =
              player.x >= hz.x &&
              player.x <= hz.x + hz.width &&
              player.y >= hz.y &&
              player.y <= hz.y + hz.height + 40;

            if (inZone) {
              // Healing Hill Zone:
              // In The Hero mode: heals +5 HP every second!
              // In other modes with a hill zone: heals +3 HP every second!
              const healRate = settings.mode === 'the_hero' ? 5 : 3;
              if (player.hp < player.maxHp) {
                player.hp = Math.min(player.maxHp, player.hp + healRate * dt);
                if (Math.random() < 0.16) {
                  floatingTextsRef.current.push({
                    id: Math.random().toString(),
                    text: `+${healRate} HP`,
                    x: player.x,
                    y: player.y - 30,
                    vy: -1.2,
                    color: '#10b981',
                    alpha: 0.95,
                    scale: 0.95,
                  });
                }
              }
              // Healing emerald sparkle particles
              if (Math.random() < 0.35) {
                particlesRef.current.push({
                  x: player.x + (Math.random() - 0.5) * player.width,
                  y: player.y + (Math.random() - 0.5) * player.height,
                  vx: (Math.random() - 0.5) * 2,
                  vy: -Math.random() * 2.5 - 1,
                  life: 0.35,
                  maxLife: 0.35,
                  color: '#34d399',
                  size: 3 + Math.random() * 3,
                  alpha: 0.85,
                  type: 'spark',
                });
              }

              // In King of the Hill mode, zone grants points
              if (settings.mode === 'king_of_the_hill' && player.isAlive && !hillControllingPlayer) {
                hillControllingPlayer = player;
                onUpdateScore(player.id, 0, 5 * dt); // accumulate points
              }
            }
          }
        }

        // 6. Spawn Random Pickups (Weapons & Power-ups) - Strictly Disabled in Infection Mode
        if (settings.mode !== 'infection') {
          pickupSpawnTimerRef.current -= dt;
          if (pickupSpawnTimerRef.current <= 0) {
            spawnRandomPickup();
            pickupSpawnTimerRef.current = settings.mode === 'chaos' ? 5 : 9;
          }
        }

        // 7. Update Fire Patches
        for (let i = firePatchesRef.current.length - 1; i >= 0; i--) {
          firePatchesRef.current[i].duration -= dt;
          if (firePatchesRef.current[i].duration <= 0) {
            firePatchesRef.current.splice(i, 1);
          }
        }

        // 8. Update Pickups Gravity
        for (const pickup of weaponPickupsRef.current) {
          if (!pickup.grounded) {
            pickup.vy += 0.4;
            pickup.y += pickup.vy;
            pickup.x += pickup.vx;
            pickup.vx *= 0.92;

            for (const plat of map.platforms) {
              if (
                pickup.y >= plat.y &&
                pickup.y <= plat.y + 15 &&
                pickup.x >= plat.x &&
                pickup.x <= plat.x + plat.width
              ) {
                pickup.y = plat.y - 12;
                pickup.vy = 0;
                pickup.grounded = true;
                break;
              }
            }
          }
        }

        // 9. Update Players
        const keys = keysDownRef.current;
        playersRef.current.forEach((player) => {
          const config = playerConfigs.find((c) => c.id === player.id);
          if (!config || !config.enabled) return;

          let inputs = { left: false, right: false, jump: false, down: false, attack: false };

          if (config.type === 'human') {
            inputs = getHumanInputs(player.id, keys);
          } else {
            const diff = config.aiDifficulty || settings.aiDifficulty || 'normal';
            inputs = computeAIInputs(
              player,
              playersRef.current,
              weaponPickupsRef.current,
              powerUpPickupsRef.current,
              firePatchesRef.current,
              map,
              settings.mode,
              diff,
              safeZoneRadiusRef.current,
              safeZoneCenterRef.current
            );
          }

          updatePlayerMovement(
            player,
            inputs,
            dt,
            map.platforms,
            activeEventRef.current,
            { width: map.width, height: map.height },
            playersRef.current,
            projectilesRef.current,
            weaponPickupsRef.current,
            powerUpPickupsRef.current,
            particlesRef.current,
            floatingTextsRef.current,
            firePatchesRef.current,
            settings.mode
          );
        });

        // Infection Mode: Convert dead survivors to zombies & handle zombie respawns!
        if (settings.mode === 'infection') {
          for (const player of playersRef.current) {
            if (!player.isAlive) {
              if (!player.isInfected) {
                player.isInfected = true;
                floatingTextsRef.current.push({
                  id: Math.random().toString(),
                  text: 'CONVERTED TO ZOMBIE!',
                  x: player.x,
                  y: player.y - 45,
                  vy: -1.5,
                  color: '#22c55e',
                  alpha: 1,
                  scale: 1.3,
                });
                sounds.playInfect();
              }

              if (infectedRespawnTimersRef.current[player.id] === undefined) {
                infectedRespawnTimersRef.current[player.id] = 1.5;
              } else {
                infectedRespawnTimersRef.current[player.id] -= dt;
                if (infectedRespawnTimersRef.current[player.id] <= 0) {
                  delete infectedRespawnTimersRef.current[player.id];
                  const sp = map.spawnPoints[Math.floor(Math.random() * map.spawnPoints.length)];
                  player.x = sp.x;
                  player.y = sp.y;
                  player.vx = 0;
                  player.vy = 0;
                  player.hp = player.maxHp;
                  player.isAlive = true;
                  player.invincibleTimer = 1.5;
                  player.weapon = 'fists';
                  sounds.playInfect();
                  floatingTextsRef.current.push({
                    id: Math.random().toString(),
                    text: 'ZOMBIE RESPAWNED!',
                    x: sp.x,
                    y: sp.y - 40,
                    vy: -1.4,
                    color: '#22c55e',
                    alpha: 1,
                    scale: 1.2,
                  });
                }
              }
            }
          }

          // Track Last Survivor Standing
          const liveSurvivors = playersRef.current.filter((p) => p.isAlive && !p.isInfected);
          if (liveSurvivors.length === 1 && lastSurvivorIdRef.current !== liveSurvivors[0].id) {
            lastSurvivorIdRef.current = liveSurvivors[0].id;
            const survivorCfg = playerConfigs.find((c) => c.id === liveSurvivors[0].id);
            floatingTextsRef.current.push({
              id: Math.random().toString(),
              text: `LAST SURVIVOR: ${survivorCfg?.name.toUpperCase() || 'P' + liveSurvivors[0].id}!`,
              x: liveSurvivors[0].x,
              y: liveSurvivors[0].y - 55,
              vy: -1.6,
              color: '#38bdf8',
              alpha: 1,
              scale: 1.4,
            });
          }
        }

        // 10. Update Projectiles
        updateProjectiles(
          projectilesRef.current,
          playersRef.current,
          map.platforms,
          dt,
          particlesRef.current,
          floatingTextsRef.current,
          (shakeAmount) => {
            cameraRef.current.shake = Math.max(cameraRef.current.shake, shakeAmount);
          },
          settings.mode
        );

        // 11. Update Particles
        for (let i = particlesRef.current.length - 1; i >= 0; i--) {
          const p = particlesRef.current[i];
          p.life -= dt;
          p.x += p.vx;
          p.y += p.vy;
          if (p.life <= 0) {
            particlesRef.current.splice(i, 1);
          }
        }

        // 12. Update Floating Text
        for (let i = floatingTextsRef.current.length - 1; i >= 0; i--) {
          const ft = floatingTextsRef.current[i];
          ft.y += ft.vy;
          ft.alpha -= dt * 0.9;
          if (ft.alpha <= 0) {
            floatingTextsRef.current.splice(i, 1);
          }
        }

        // 13. Camera Damping & Target
        updateCamera(dt, map, playersRef.current, activeEventRef.current);

        // 14. Check Round End Condition
        checkRoundOverConditions();

        // 15. Throttle HUD state sync
        hudThrottleRef.current += dt;
        if (hudThrottleRef.current > 0.08) {
          hudThrottleRef.current = 0;
          if (onHUDUpdate) {
            onHUDUpdate({
              players: [...playersRef.current],
              roundTimer: roundTimerRef.current,
              activeEvent: activeEventRef.current ? { ...activeEventRef.current } : null,
              nextEventTimer: nextEventTimerRef.current,
              rouletteTimer: rouletteTimerRef.current,
            });
          }
        }
      }

      // 15. Render Frame
      renderGame(
        ctx,
        canvas.width,
        canvas.height,
        cameraRef.current,
        map,
        playersRef.current,
        playerConfigs,
        projectilesRef.current,
        weaponPickupsRef.current,
        powerUpPickupsRef.current,
        particlesRef.current,
        floatingTextsRef.current,
        firePatchesRef.current,
        activeEventRef.current,
        settings.mode,
        safeZoneRadiusRef.current,
        safeZoneCenterRef.current,
        null
      );
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [map, playerConfigs, settings, isPaused]);

  // Handle Resize for Canvas Crispness
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Helper: Read Human Inputs per Player with Custom Keybindings
  const getHumanInputs = (id: PlayerId, keys: { [code: string]: boolean }) => {
    const bindings = (keyBindings && keyBindings[id]) || DEFAULT_KEY_BINDINGS[id];
    if (!bindings) {
      return { left: false, right: false, jump: false, down: false, attack: false };
    }
    return {
      left: isKeyPressed(bindings.left, keys),
      right: isKeyPressed(bindings.right, keys),
      jump: isKeyPressed(bindings.jump, keys),
      down: isKeyPressed(bindings.down, keys),
      attack: isKeyPressed(bindings.attack, keys),
    };
  };

  // Helper: Trigger Random Events
  const triggerRandomEvent = () => {
    const eventTypes: RandomEventType[] = ['gravity', 'wind', 'earthquake', 'fire', 'zoom'];
    const chosen = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    sounds.playEventAlert();

    if (chosen === 'gravity') {
      activeEventRef.current = {
        type: 'gravity',
        name: 'COLOSSAL LEAPS (قفزات عملاقة وثقل)',
        description: 'قفزات هائلة وعالية جداً في الهواء مع ثقل ووزن في الحركة على الأرض!',
        timeRemaining: 10,
        maxDuration: 10,
        intensity: 1,
      };
    } else if (chosen === 'wind') {
      const dir = Math.random() < 0.5 ? -1 : 1;
      activeEventRef.current = {
        type: 'wind',
        name: 'GALE-FORCE WINDS!',
        description: `Strong gusts pushing fighters ${dir > 0 ? 'EAST' : 'WEST'}.`,
        timeRemaining: 10,
        maxDuration: 10,
        intensity: 1,
        param: dir,
      };
    } else if (chosen === 'earthquake') {
      activeEventRef.current = {
        type: 'earthquake',
        name: 'SEISMIC EARTHQUAKE!',
        description: 'Ground is shaking violently! Watch your footing.',
        timeRemaining: 10,
        maxDuration: 10,
        intensity: 1,
      };
    } else if (chosen === 'fire') {
      activeEventRef.current = {
        type: 'fire',
        name: 'MAGMA HAZARD (حمم نارية خفيفة)',
        description: 'حمم نارية على بعض المنصات بضرر خفيف ومتوازن يسهل تفاديه!',
        timeRemaining: 8,
        maxDuration: 8,
        intensity: 1,
      };
      // Spawn fire patches on 2-3 platforms with reduced duration
      for (const plat of map.platforms) {
        if (Math.random() < 0.5) {
          firePatchesRef.current.push({
            x: plat.x + Math.random() * (plat.width * 0.4),
            y: plat.y,
            width: Math.min(160, plat.width * 0.45),
            duration: 8,
          });
        }
      }
    } else if (chosen === 'zoom') {
      const zoomTarget = Math.random() < 0.5 ? 1.35 : 0.75;
      activeEventRef.current = {
        type: 'zoom',
        name: zoomTarget > 1 ? 'CINEMATIC ZOOM IN!' : 'EXPANDED ARENA VIEW!',
        description: zoomTarget > 1 ? 'Tight close-quarters combat!' : 'Panoramic overview!',
        timeRemaining: 10,
        maxDuration: 10,
        intensity: 1,
        param: zoomTarget,
      };
    }
  };

  // Helper: Weapon Roulette Roll
  const rollWeaponRoulette = () => {
    sounds.playRouletteTick();
    if (settings.mode === 'the_hero') {
      // In The Hero mode, heroes always wield their Battleaxe!
      for (const player of playersRef.current) {
        if (!player.isAlive) continue;
        player.weapon = 'axe';
        player.ammo = 999;
        player.maxAmmo = 999;
        floatingTextsRef.current.push({
          id: Math.random().toString(),
          text: 'HERO AXE ✦ READY',
          x: player.x,
          y: player.y - 45,
          vy: -1.6,
          color: '#f43f5e',
          alpha: 1,
          scale: 1.15,
        });
      }
      return;
    }

    const weaponPool: WeaponType[] = ['sword', 'axe', 'gun', 'rocket', 'rope', 'magnet'];
    for (const player of playersRef.current) {
      if (!player.isAlive) continue;
      const newW = weaponPool[Math.floor(Math.random() * weaponPool.length)];
      player.weapon = newW;
      player.ammo = WEAPON_CONFIG[newW].maxAmmo;
      player.maxAmmo = WEAPON_CONFIG[newW].maxAmmo;

      floatingTextsRef.current.push({
        id: Math.random().toString(),
        text: `ROULETTE: ${newW.toUpperCase()}`,
        x: player.x,
        y: player.y - 45,
        vy: -1.6,
        color: '#fbbf24',
        alpha: 1,
        scale: 1.1,
      });
    }
  };

  // Helper: Spawn Random Weapons / Power-ups
  const spawnRandomPickup = () => {
    const isPowerUp = Math.random() < 0.4;
    const targetPlat = map.platforms[Math.floor(Math.random() * map.platforms.length)];
    const spawnX = targetPlat.x + 20 + Math.random() * Math.max(20, targetPlat.width - 40);
    const spawnY = targetPlat.y - 30;

    if (settings.mode === 'the_hero') {
      // In The Hero mode, only Axes or Power-ups spawn
      if (isPowerUp) {
        const powerPool: PowerUpType[] = ['giant', 'speed', 'shield', 'combo', 'jetpack'];
        const chosen = powerPool[Math.floor(Math.random() * powerPool.length)];
        powerUpPickupsRef.current.push({
          id: Math.random().toString(),
          type: chosen,
          x: spawnX,
          y: spawnY,
          duration: 20,
          bobOffset: Math.random() * Math.PI,
        });
      } else {
        weaponPickupsRef.current.push({
          id: Math.random().toString(),
          type: 'axe',
          x: spawnX,
          y: spawnY - 60,
          vx: (Math.random() - 0.5) * 2,
          vy: -3,
          ammo: 999,
          grounded: false,
        });
      }
      return;
    }

    if (isPowerUp) {
      const powerPool: PowerUpType[] = ['giant', 'speed', 'shield', 'combo', 'jetpack'];
      const chosen = powerPool[Math.floor(Math.random() * powerPool.length)];
      powerUpPickupsRef.current.push({
        id: Math.random().toString(),
        type: chosen,
        x: spawnX,
        y: spawnY,
        duration: 20,
        bobOffset: Math.random() * Math.PI,
      });
    } else {
      const weaponPool: WeaponType[] = ['sword', 'axe', 'gun', 'rocket', 'rope', 'magnet'];
      const chosen = weaponPool[Math.floor(Math.random() * weaponPool.length)];
      weaponPickupsRef.current.push({
        id: Math.random().toString(),
        type: chosen,
        x: spawnX,
        y: spawnY - 60,
        vx: (Math.random() - 0.5) * 2,
        vy: -3,
        ammo: WEAPON_CONFIG[chosen].maxAmmo,
        grounded: false,
      });
    }
  };

  // Helper: Camera tracking, dynamic zoom & damping focusing on HUMAN players
  const updateCamera = (
    dt: number,
    map: ArenaMap,
    players: PlayerState[],
    activeEvent: ActiveEvent | null
  ) => {
    const camera = cameraRef.current;
    const canvas = canvasRef.current;
    const configs = playerConfigsRef.current;
    const livePlayers = players.filter((p) => p.isAlive);

    // 1. Prioritize Human players over CPU bots
    const liveHumans = livePlayers.filter((p) => {
      const cfg = configs.find((c) => c.id === p.id);
      return cfg?.type === 'human';
    });

    let rawTargetX = map.width / 2;
    let rawTargetY = map.height / 2;
    let targetZoom = 1.0;

    // Canvas dimensions for aspect ratio & framing calculation
    const canvasW = canvas?.width || 1400;
    const canvasH = canvas?.height || 750;

    if (liveHumans.length === 1) {
      // Single human player alive: Center camera directly on the human player with smooth velocity lead!
      const human = liveHumans[0];
      const leadX = Math.max(-100, Math.min(100, human.vx * 12));
      const leadY = Math.max(-60, Math.min(50, human.vy * 8));
      rawTargetX = human.x + leadX;
      rawTargetY = human.y - 30 + leadY;

      // Dynamic Zoom based on speed and combat intensity
      const speed = Math.hypot(human.vx, human.vy);

      // Find distance to closest enemy
      let closestEnemyDist = 9999;
      for (const enemy of livePlayers) {
        if (enemy.id !== human.id) {
          const d = Math.hypot(enemy.x - human.x, enemy.y - human.y);
          if (d < closestEnemyDist) closestEnemyDist = d;
        }
      }

      // Base close-up zoom for stick arena combat: 1.18x
      let dynamicZoom = 1.18;

      // If moving rapidly or falling fast: zoom out smoothly for wide arena awareness
      if (speed > 4) {
        dynamicZoom -= Math.min(0.24, (speed - 4) * 0.022);
      }

      // If in close duel (within 200px): zoom in for dramatic impact!
      if (closestEnemyDist < 200) {
        dynamicZoom = Math.max(dynamicZoom, 1.25);
      } else if (closestEnemyDist > 650) {
        // Roaming alone on large maps like Apex Warzone: pull back slightly
        dynamicZoom = Math.min(dynamicZoom, 1.05);
      }

      targetZoom = dynamicZoom;
    } else if (liveHumans.length > 1) {
      // Multiple human players alive (e.g. Local 2-Player):
      // Frame all living human players together, zooming in/out dynamically
      let minX = Infinity;
      let maxX = -Infinity;
      let minY = Infinity;
      let maxY = -Infinity;

      for (const h of liveHumans) {
        if (h.x < minX) minX = h.x;
        if (h.x > maxX) maxX = h.x;
        if (h.y < minY) minY = h.y;
        if (h.y > maxY) maxY = h.y;
      }

      rawTargetX = (minX + maxX) / 2;
      rawTargetY = (minY + maxY) / 2 - 25;

      // Dynamic framing zoom to keep both humans visible with comfortable margins
      const padX = 340;
      const padY = 240;
      const spanX = Math.max(400, maxX - minX + padX);
      const spanY = Math.max(300, maxY - minY + padY);

      const fitZoomX = canvasW / spanX;
      const fitZoomY = canvasH / spanY;
      const multiZoom = Math.min(fitZoomX, fitZoomY);

      // Clamp zoom between 0.72x (far apart on Apex Warzone) and 1.25x (standing next to each other)
      targetZoom = Math.max(0.72, Math.min(1.25, multiZoom));
    } else if (livePlayers.length > 0) {
      // Human is eliminated: Spectate surviving fighters smoothly
      rawTargetX = livePlayers.reduce((acc, p) => acc + p.x, 0) / livePlayers.length;
      rawTargetY = livePlayers.reduce((acc, p) => acc + p.y, 0) / livePlayers.length - 20;

      // Group framing for bots
      let minX = Infinity;
      let maxX = -Infinity;
      for (const p of livePlayers) {
        if (p.x < minX) minX = p.x;
        if (p.x > maxX) maxX = p.x;
      }
      const span = Math.max(400, maxX - minX + 300);
      targetZoom = Math.max(0.75, Math.min(1.15, canvasW / span));
    }

    // Active event override (e.g. Cinema Zoom or Wide event)
    if (activeEvent?.type === 'zoom' && activeEvent.param) {
      targetZoom = activeEvent.param;
    }

    // Smooth Zoom Lerp
    camera.zoom += (targetZoom - camera.zoom) * 3.5 * dt;

    // Viewport Half-Sizes in world units at current zoom
    const halfViewW = (canvasW / 2) / Math.max(0.2, camera.zoom);
    const halfViewH = (canvasH / 2) / Math.max(0.2, camera.zoom);

    // Clamping to arena boundaries with comfortable edge margin
    // If the map width fits completely in viewport: center on map
    let targetX = rawTargetX;
    let targetY = rawTargetY;

    if (halfViewW * 2 >= map.width) {
      targetX = map.width / 2;
    } else {
      // Allow slight 50px margin beyond border so player is never crushed against the screen edge
      const minCamX = halfViewW - 50;
      const maxCamX = map.width - halfViewW + 50;
      targetX = Math.max(minCamX, Math.min(maxCamX, rawTargetX));
    }

    if (halfViewH * 2 >= map.height) {
      targetY = map.height / 2;
    } else {
      const minCamY = halfViewH - 40;
      const maxCamY = map.height - halfViewH + 40;
      targetY = Math.max(minCamY, Math.min(maxCamY, rawTargetY));
    }

    // Smooth Camera Pan Lerp (fast, crisp, responsive)
    camera.x += (targetX - camera.x) * 6.0 * dt;
    camera.y += (targetY - camera.y) * 6.0 * dt;

    // Screen Shake damping
    if (camera.shake > 0) {
      camera.shake = Math.max(0, camera.shake - 22 * dt);
    }
  };

  // Helper: Check Round End
  const checkRoundOverConditions = () => {
    if (roundEndingRef.current) return;

    // 1. King of the hill points check
    if (settings.mode === 'king_of_the_hill') {
      for (const cfg of playerConfigs) {
        if (cfg.points >= 100) {
          roundEndingRef.current = true;
          onRoundOver(cfg.id);
          return;
        }
      }
    }

    // 2. Team Deathmatch victory check (Red Team vs Blue Team)
    if (settings.mode === 'team_deathmatch') {
      const alivePlayers = playersRef.current.filter((p) => p.isAlive);
      const aliveRed = alivePlayers.filter((p) => p.team === 'red');
      const aliveBlue = alivePlayers.filter((p) => p.team === 'blue');

      if (aliveRed.length === 0 && aliveBlue.length > 0) {
        roundEndingRef.current = true;
        sounds.playVictory();
        setTimeout(() => {
          onRoundOver(aliveBlue[0].id);
        }, 1000);
        return;
      } else if (aliveBlue.length === 0 && aliveRed.length > 0) {
        roundEndingRef.current = true;
        sounds.playVictory();
        setTimeout(() => {
          onRoundOver(aliveRed[0].id);
        }, 1000);
        return;
      } else if (aliveRed.length === 0 && aliveBlue.length === 0) {
        roundEndingRef.current = true;
        sounds.playVictory();
        setTimeout(() => {
          onRoundOver(null);
        }, 1000);
        return;
      }
      return;
    }

    // 3. Infection Mode victory check (The Last Survivor Standing Wins the Round!)
    if (settings.mode === 'infection') {
      const alivePlayers = playersRef.current.filter((p) => p.isAlive);
      const uninfected = alivePlayers.filter((p) => !p.isInfected);

      // Continuously record the last standing survivor if only 1 remains
      if (uninfected.length === 1) {
        lastSurvivorIdRef.current = uninfected[0].id;
      }

      // If all survivors have been infected:
      // The LAST SURVIVOR who held out wins the round!
      if (uninfected.length === 0) {
        roundEndingRef.current = true;
        sounds.playVictory();
        const winner = lastSurvivorIdRef.current;
        setTimeout(() => {
          onRoundOver(winner);
        }, 1000);
        return;
      }

      // If survival timer expires (45 seconds of survival):
      // Survivors win! (The last survivor or first live survivor gets the win)
      const infectionRoundLimit = 45;
      if (roundTimerRef.current >= infectionRoundLimit && uninfected.length > 0) {
        roundEndingRef.current = true;
        sounds.playVictory();
        const winner = lastSurvivorIdRef.current || uninfected[0].id;
        setTimeout(() => {
          onRoundOver(winner);
        }, 1000);
        return;
      }
      return;
    }

    // 4. Survivor check (for FFA / Battle Royale / Roulette / Chaos)
    const alivePlayers = playersRef.current.filter((p) => p.isAlive);
    const totalEnabled = playerConfigs.filter((p) => p.enabled).length;

    if (alivePlayers.length <= 1 && totalEnabled >= 2) {
      roundEndingRef.current = true;
      const winner = alivePlayers.length === 1 ? alivePlayers[0].id : null;
      sounds.playVictory();
      setTimeout(() => {
        onRoundOver(winner);
      }, 1000);
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-950 flex items-center justify-center">
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-crosshair touch-none"
      />
    </div>
  );
};
