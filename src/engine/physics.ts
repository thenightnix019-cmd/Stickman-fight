import {
  PlayerState,
  Platform,
  Projectile,
  WeaponPickup,
  PowerUpPickup,
  PowerUpType,
  FirePatch,
  ActiveEvent,
  GameMode,
  PlayerId,
  Particle,
  FloatingText,
} from '../types/game';
import { sounds } from '../audio/soundEngine';

export const GRAVITY = 0.55;
export const MOVE_SPEED = 5.2;
export const jumpForce = 9; // jumpForce parameter
export const JUMP_FORCE = -14.5; // Increased jump impulse for high leaps (jumpForce: 5 -> jumpForce: 9 equivalent)
export const DOUBLE_JUMP_FORCE = -13.0;
export const FRICTION = 0.82;
export const AIR_FRICTION = 0.94;

export function areTeammates(
  p1: PlayerState | undefined,
  p2: PlayerState | undefined,
  gameMode?: GameMode
): boolean {
  if (!p1 || !p2) return false;
  if (p1.id === p2.id) return true;
  if (gameMode === 'team_deathmatch') {
    return !!p1.team && p1.team === p2.team;
  }
  if (gameMode === 'infection') {
    return !!p1.isInfected === !!p2.isInfected;
  }
  return false;
}

export function infectPlayer(
  target: PlayerState,
  infector: PlayerState | null,
  floatingTexts: FloatingText[],
  particles: Particle[]
) {
  if (target.isInfected) return;
  target.isInfected = true;
  target.weapon = 'fists';
  target.ammo = 0;
  target.attackCooldown = 2.0; // 2s cooldown on conversion
  sounds.playInfect();

  // Burst of toxic green particles
  for (let i = 0; i < 24; i++) {
    const angle = Math.random() * Math.PI * 2;
    particles.push({
      x: target.x,
      y: target.y,
      vx: Math.cos(angle) * (3 + Math.random() * 6),
      vy: Math.sin(angle) * (3 + Math.random() * 6),
      life: 0.55,
      maxLife: 0.55,
      color: '#22c55e',
      size: 4 + Math.random() * 4,
      alpha: 1,
      type: 'debris',
    });
  }

  floatingTexts.push({
    id: Math.random().toString(),
    text: 'INFECTED!',
    x: target.x,
    y: target.y - 45,
    vy: -1.6,
    color: '#22c55e',
    alpha: 1,
    scale: 1.5,
  });
}

export const WEAPON_CONFIG = {
  fists: { damage: 10, cooldown: 0.28, range: 45, maxAmmo: 0, knockback: 6 },
  sword: { damage: 26, cooldown: 0.35, range: 68, maxAmmo: 14, knockback: 11 },
  axe: { damage: 42, cooldown: 0.65, range: 72, maxAmmo: 14, knockback: 19 },
  gun: { damage: 15, cooldown: 0.22, range: 600, maxAmmo: 12, knockback: 4 },
  rocket: { damage: 45, cooldown: 0.85, range: 800, maxAmmo: 4, knockback: 18 },
  rope: { damage: 8, cooldown: 0.5, range: 380, maxAmmo: 5, knockback: -12 }, // negative = pull towards
  magnet: { damage: 5, cooldown: 0.9, range: 240, maxAmmo: 4, knockback: 2 },
};

export function createInitialPlayer(id: PlayerId, x: number, y: number): PlayerState {
  return {
    id,
    x,
    y,
    vx: 0,
    vy: 0,
    width: 28,
    height: 56,
    facing: id === 1 || id === 3 ? 1 : -1,
    isGrounded: false,
    canDoubleJump: true,
    hp: 100,
    maxHp: 100,
    isAlive: true,
    invincibleTimer: 1.5,
    walkFrame: 0,
    armAngle: 0,
    attackTimer: 0,
    attackCooldown: 0,
    isAttacking: false,
    weapon: 'fists',
    ammo: 0,
    maxAmmo: 0,
    activePowerUp: null,
    powerUpTimeRemaining: 0,
    shieldHp: 0,
    comboCount: 0,
    comboTimer: 0,
    ropeTarget: null,
    isPulling: false,
    onFireTimer: 0,
    frozenTimer: 0,
    hasJetpack: false,
    jetpackFuel: 0,
    isJetpacking: false,
    isWallSliding: false,
    wallSlideSide: null,
  };
}

export function updatePlayerMovement(
  player: PlayerState,
  inputs: { left: boolean; right: boolean; jump: boolean; down: boolean; attack: boolean },
  dt: number,
  platforms: Platform[],
  activeEvent: ActiveEvent | null,
  arenaBounds: { width: number; height: number },
  allPlayers: PlayerState[],
  projectiles: Projectile[],
  weaponPickups: WeaponPickup[],
  powerUpPickups: PowerUpPickup[],
  particles: Particle[],
  floatingTexts: FloatingText[],
  firePatches: FirePatch[],
  gameMode?: GameMode
) {
  if (!player.isAlive) return;

  // Timers
  if (player.invincibleTimer > 0) player.invincibleTimer = Math.max(0, player.invincibleTimer - dt);
  if (player.attackCooldown > 0) player.attackCooldown = Math.max(0, player.attackCooldown - dt);
  if (player.attackTimer > 0) {
    player.attackTimer = Math.max(0, player.attackTimer - dt);
    if (player.attackTimer === 0) player.isAttacking = false;
  }

  // Power-up duration
  if (player.activePowerUp) {
    player.powerUpTimeRemaining = Math.max(0, player.powerUpTimeRemaining - dt);
    if (player.powerUpTimeRemaining === 0) {
      player.activePowerUp = null;
    }
  }

  // Combo timer
  if (player.comboTimer > 0) {
    player.comboTimer = Math.max(0, player.comboTimer - dt);
    if (player.comboTimer === 0) {
      player.comboCount = 0;
    }
  }

  // Fire patch burn effect
  if (player.onFireTimer > 0) {
    player.onFireTimer = Math.max(0, player.onFireTimer - dt);
    if (Math.random() < 0.25) {
      applyDamage(player, 1.2, null, floatingTexts, particles);
    }
    // spawn fire particle
    if (Math.random() < 0.4) {
      particles.push({
        x: player.x + (Math.random() - 0.5) * player.width,
        y: player.y + (Math.random() - 0.5) * player.height,
        vx: (Math.random() - 0.5) * 2,
        vy: -Math.random() * 2 - 1,
        life: 0.35,
        maxLife: 0.35,
        color: '#f97316',
        size: 3 + Math.random() * 3,
        alpha: 0.9,
        type: 'fire',
      });
    }
  }

  // Check if player stands in any fire patch
  for (const patch of firePatches) {
    if (
      player.x + player.width / 2 >= patch.x &&
      player.x - player.width / 2 <= patch.x + patch.width &&
      Math.abs(player.y + player.height / 2 - patch.y) < 18
    ) {
      player.onFireTimer = 3;
    }
  }

  // Multipliers
  const isGiant = player.activePowerUp === 'giant';
  const isSpeed = player.activePowerUp === 'speed';
  const speedMult = isSpeed ? 1.65 : isGiant ? 0.85 : 1.0;
  const currentMoveSpeed = MOVE_SPEED * speedMult;

  // Speed particle trail
  if (isSpeed && (inputs.left || inputs.right)) {
    if (Math.random() < 0.5) {
      particles.push({
        x: player.x,
        y: player.y + player.height / 4,
        vx: -player.vx * 0.2,
        vy: (Math.random() - 0.5) * 1.5,
        life: 0.25,
        maxLife: 0.25,
        color: '#38bdf8',
        size: 4,
        alpha: 0.7,
        type: 'spark',
      });
    }
  }

  // Horizontal input
  if (inputs.left && !inputs.right) {
    player.vx -= 1.2 * speedMult;
    if (player.vx < -currentMoveSpeed) player.vx = -currentMoveSpeed;
    player.facing = -1;
    player.walkFrame += dt * 14 * speedMult;
  } else if (inputs.right && !inputs.left) {
    player.vx += 1.2 * speedMult;
    if (player.vx > currentMoveSpeed) player.vx = currentMoveSpeed;
    player.facing = 1;
    player.walkFrame += dt * 14 * speedMult;
  } else {
    player.vx *= player.isGrounded ? FRICTION : AIR_FRICTION;
    player.walkFrame = 0;
  }

  // Random Events impact on physics
  let currentGravity = GRAVITY;
  if (activeEvent?.type === 'gravity') {
    currentGravity = -0.38; // Inverted gravity!
  }

  if (activeEvent?.type === 'wind') {
    const windForce = (activeEvent.param || 1) * 0.42;
    player.vx += windForce;
  }

  if (activeEvent?.type === 'earthquake') {
    if (player.isGrounded && Math.random() < 0.08) {
      player.vy = -3.5 - Math.random() * 2;
      player.vx += (Math.random() - 0.5) * 4;
    }
  }

  // Apply Gravity
  player.vy += currentGravity;
  if (player.vy > 15) player.vy = 15;
  if (player.vy < -15) player.vy = -15;

  // Jetpack Flight (5 seconds maximum total fuel)
  if (player.hasJetpack && (player.jetpackFuel || 0) > 0) {
    if (inputs.jump && !player.isGrounded) {
      player.isJetpacking = true;
      player.vy = -6.4; // Upward rocket propulsion
      player.jetpackFuel = Math.max(0, (player.jetpackFuel || 0) - dt);

      // Jetpack thruster plasma flames downwards
      if (Math.random() < 0.65) {
        particles.push({
          x: player.x - player.facing * 8,
          y: player.y + 6,
          vx: (Math.random() - 0.5) * 2 - player.facing * 1.5,
          vy: 5 + Math.random() * 3,
          life: 0.22,
          maxLife: 0.22,
          color: Math.random() > 0.4 ? '#38bdf8' : '#f59e0b',
          size: 4 + Math.random() * 3,
          alpha: 0.95,
          type: 'fire',
        });
      }

      if (player.jetpackFuel <= 0) {
        player.hasJetpack = false;
        player.isJetpacking = false;
        floatingTexts.push({
          id: Math.random().toString(),
          text: 'JETPACK DEPLETED',
          x: player.x,
          y: player.y - 35,
          vy: -1.2,
          color: '#ef4444',
          alpha: 1,
          scale: 1,
        });
      }
    } else {
      player.isJetpacking = false;
    }
  } else {
    player.isJetpacking = false;
  }

  // Jump logic (including Wall Jump Parkour)
  if (inputs.jump) {
    if (player.isWallSliding && player.wallSlideSide) {
      // Wall Jump / Parkour leap!
      const jumpDir = player.wallSlideSide === 'left' ? 1 : -1;
      player.vy = -12.0;
      player.vx = jumpDir * 9.5;
      player.facing = jumpDir as 1 | -1;
      player.isWallSliding = false;
      player.canDoubleJump = true;
      sounds.playJump();
      spawnDustParticles(player.x, player.y, particles, '#38bdf8');
      floatingTexts.push({
        id: Math.random().toString(),
        text: 'PARKOUR!',
        x: player.x,
        y: player.y - 30,
        vy: -1.4,
        color: '#38bdf8',
        alpha: 1,
        scale: 1.1,
      });
    } else if (player.isGrounded) {
      player.vy = JUMP_FORCE * (isSpeed ? 1.25 : 1.0);
      player.isGrounded = false;
      player.canDoubleJump = true;
      sounds.playJump();
      spawnDustParticles(player.x, player.y + player.height / 2, particles);
    } else if (player.canDoubleJump && !player.isJetpacking) {
      player.vy = DOUBLE_JUMP_FORCE * (isSpeed ? 1.25 : 1.0);
      player.canDoubleJump = false;
      sounds.playDoubleJump();
      spawnDustParticles(player.x, player.y + player.height / 2, particles, '#38bdf8');
    }
  }

  // Attack input
  if (inputs.attack && player.attackCooldown <= 0) {
    executePlayerAttack(
      player,
      allPlayers,
      projectiles,
      weaponPickups,
      particles,
      floatingTexts,
      gameMode
    );
  }

  // Update position
  const nextX = player.x + player.vx;
  const nextY = player.y + player.vy;

  // Platform collision
  const prevGrounded = player.isGrounded;
  player.isGrounded = false;

  const playerH = isGiant ? player.height * 1.5 : player.height;
  const playerW = isGiant ? player.width * 1.4 : player.width;
  const halfH = playerH / 2;
  const halfW = playerW / 2;

  player.x = nextX;
  player.y = nextY;

  // Horizontal arena bounds
  if (player.x - halfW < 40) {
    player.x = 40 + halfW;
    player.vx = 0;
  } else if (player.x + halfW > arenaBounds.width - 40) {
    player.x = arenaBounds.width - 40 - halfW;
    player.vx = 0;
  }

  // Vertical bounds
  if (currentGravity < 0) {
    // Ceiling collision if reverse gravity
    if (player.y - halfH < 50) {
      player.y = 50 + halfH;
      player.vy = 0;
      player.isGrounded = true;
      player.canDoubleJump = true;
    }
  }

  // Check platforms
  for (const plat of platforms) {
    const platTop = plat.y;
    const platBottom = plat.y + plat.height;
    const platLeft = plat.x;
    const platRight = plat.x + plat.width;

    const inHoriz = player.x + halfW > platLeft && player.x - halfW < platRight;

    if (inHoriz) {
      if (currentGravity >= 0) {
        // Normal downward gravity
        if (
          player.vy >= 0 &&
          player.y + halfH >= platTop &&
          player.y + halfH <= platTop + 20 &&
          (!plat.oneWay || !inputs.down)
        ) {
          player.y = platTop - halfH;
          player.vy = 0;
          player.isGrounded = true;
          player.canDoubleJump = true;
        }
      } else {
        // Reverse gravity
        if (
          player.vy <= 0 &&
          player.y - halfH <= platBottom &&
          player.y - halfH >= platBottom - 20
        ) {
          player.y = platBottom + halfH;
          player.vy = 0;
          player.isGrounded = true;
          player.canDoubleJump = true;
        }
      }
    }
  }

  // Land impact
  if (!prevGrounded && player.isGrounded) {
    spawnDustParticles(player.x, player.y + halfH, particles);
    player.isWallSliding = false;
    player.wallSlideSide = null;
  }

  // Wall Parkour slide detection (airborne next to solid wall)
  let touchingLeft = false;
  let touchingRight = false;

  if (!player.isGrounded && player.vy > -3) {
    // Check platforms
    for (const plat of platforms) {
      if (plat.oneWay) continue;
      const platTop = plat.y;
      const platBottom = plat.y + plat.height;
      const platLeft = plat.x;
      const platRight = plat.x + plat.width;

      if (player.y + halfH > platTop + 4 && player.y - halfH < platBottom - 4) {
        // Player's left side against platform's right edge
        if (Math.abs((player.x - halfW) - platRight) < 12) {
          touchingLeft = true;
        }
        // Player's right side against platform's left edge
        if (Math.abs((player.x + halfW) - platLeft) < 12) {
          touchingRight = true;
        }
      }
    }

    // Check arena boundary walls for parkour leaps
    if (player.x - halfW <= 46) {
      touchingLeft = true;
    }
    if (player.x + halfW >= arenaBounds.width - 46) {
      touchingRight = true;
    }
  }

  if ((touchingLeft || touchingRight) && !player.isGrounded && player.vy > -2) {
    player.isWallSliding = true;
    player.wallSlideSide = touchingLeft ? 'left' : 'right';
    if (player.vy > 1.8) {
      player.vy = 1.8; // parkour wall grip friction
    }
    // Friction sparks against the wall
    if (Math.random() < 0.4) {
      particles.push({
        x: touchingLeft ? player.x - halfW : player.x + halfW,
        y: player.y + halfH - 12,
        vx: touchingLeft ? (1 + Math.random() * 2) : (-1 - Math.random() * 2),
        vy: -Math.random() * 2 - 0.5,
        life: 0.22,
        maxLife: 0.22,
        color: '#fbbf24',
        size: 3,
        alpha: 0.85,
        type: 'spark',
      });
    }
  } else if (player.isGrounded) {
    player.isWallSliding = false;
    player.wallSlideSide = null;
  }

  // Fall off bottom of screen
  if (player.y > arenaBounds.height + 60) {
    killPlayer(player, null, particles, floatingTexts);
  }

  // Check weapon & power-up pickups (strictly disabled in Infection Mode - pure evasion and parkour)
  if (gameMode !== 'infection') {
    for (let i = weaponPickups.length - 1; i >= 0; i--) {
      const pickup = weaponPickups[i];
      const dist = Math.hypot(player.x - pickup.x, player.y - pickup.y);
      if (dist < 36) {
        // Pick up weapon
        player.weapon = pickup.type;
        player.ammo = pickup.ammo;
        player.maxAmmo = WEAPON_CONFIG[pickup.type].maxAmmo;
        weaponPickups.splice(i, 1);
        sounds.playPowerUp();
        floatingTexts.push({
          id: Math.random().toString(),
          text: `+ ${pickup.type.toUpperCase()}`,
          x: player.x,
          y: player.y - 30,
          vy: -1.2,
          color: '#fbbf24',
          alpha: 1,
          scale: 1,
        });
      }
    }

    // Check power-up pickups
    for (let i = powerUpPickups.length - 1; i >= 0; i--) {
      const power = powerUpPickups[i];
      const dist = Math.hypot(player.x - power.x, player.y - power.y);
      if (dist < 40) {
        applyPowerUp(player, power.type, floatingTexts, particles);
        powerUpPickups.splice(i, 1);
      }
    }
  } else {
    // Infection Mode: Force unarmed fists
    player.weapon = 'fists';
    player.ammo = 0;
  }
}

export function executePlayerAttack(
  player: PlayerState,
  allPlayers: PlayerState[],
  projectiles: Projectile[],
  weaponPickups: WeaponPickup[],
  particles: Particle[],
  floatingTexts: FloatingText[],
  gameMode?: GameMode
) {
  // Infection Mode Attack Logic:
  if (gameMode === 'infection') {
    // 1. Uninfected survivors CANNOT attack - pure movement, parkour and dodging!
    if (!player.isInfected) {
      return;
    }

    // 2. Zombie Special Skill (ضربة التحويل): 2.0s Cooldown!
    player.attackCooldown = 2.0; // Exactly 2.0s cooldown
    player.attackTimer = 0.28;
    player.isAttacking = true;
    sounds.playInfect();

    // Spawn green zombie slash particles
    const dir = player.facing;
    for (let i = 0; i < 12; i++) {
      const angle = (Math.random() - 0.5) * 1.2 + (dir > 0 ? 0 : Math.PI);
      const speed = 4 + Math.random() * 5;
      particles.push({
        x: player.x + dir * 20,
        y: player.y + (Math.random() - 0.5) * 25,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0.25,
        maxLife: 0.25,
        color: '#22c55e',
        size: 3 + Math.random() * 3,
        alpha: 1,
        type: 'debris',
      });
    }

    checkMeleeHit(
      player,
      allPlayers,
      65, // Generous melee conversion strike range
      0,  // Direct conversion
      10, // Slight push
      particles,
      floatingTexts,
      gameMode
    );
    return;
  }

  const cfg = WEAPON_CONFIG[player.weapon];
  player.attackCooldown = cfg.cooldown;
  player.attackTimer = 0.22;
  player.isAttacking = true;

  const isCombo = player.activePowerUp === 'combo';
  const isGiant = player.activePowerUp === 'giant';
  const dmgMultiplier = (isCombo ? 2.0 : 1.0) * (isGiant ? 1.4 : 1.0);
  const knockMultiplier = isCombo ? 1.8 : isGiant ? 1.4 : 1.0;

  if (player.weapon === 'fists') {
    sounds.playPunch();
    checkMeleeHit(
      player,
      allPlayers,
      cfg.range * (isGiant ? 1.5 : 1),
      cfg.damage * dmgMultiplier,
      cfg.knockback * knockMultiplier,
      particles,
      floatingTexts,
      gameMode
    );
  } else if (player.weapon === 'sword') {
    sounds.playSword();
    // Slash arc effect
    spawnSlashParticles(player, particles);
    checkMeleeHit(
      player,
      allPlayers,
      cfg.range * (isGiant ? 1.5 : 1),
      cfg.damage * dmgMultiplier,
      cfg.knockback * knockMultiplier,
      particles,
      floatingTexts,
      gameMode
    );
    consumeWeaponAmmo(player, weaponPickups);
  } else if (player.weapon === 'axe') {
    sounds.playAxe();
    // Heavy axe cleave particles
    spawnAxeSlashParticles(player, particles);
    checkMeleeHit(
      player,
      allPlayers,
      cfg.range * (isGiant ? 1.5 : 1),
      cfg.damage * dmgMultiplier,
      cfg.knockback * knockMultiplier,
      particles,
      floatingTexts,
      gameMode
    );
    consumeWeaponAmmo(player, weaponPickups);
  } else if (player.weapon === 'gun') {
    sounds.playGunShot();
    // Bullet projectile
    const bulletSpeed = 22 * player.facing;
    projectiles.push({
      id: Math.random().toString(),
      ownerId: player.id,
      type: 'bullet',
      x: player.x + player.facing * 24,
      y: player.y - 6,
      vx: bulletSpeed,
      vy: (Math.random() - 0.5) * 1.0,
      damage: cfg.damage * dmgMultiplier,
      radius: 4,
      lifetime: 1.5,
      color: '#facc15',
    });
    // Recoil
    player.vx -= player.facing * 2.5;
    // Muzzle flash particle
    particles.push({
      x: player.x + player.facing * 28,
      y: player.y - 6,
      vx: player.facing * 4,
      vy: (Math.random() - 0.5) * 2,
      life: 0.12,
      maxLife: 0.12,
      color: '#fef08a',
      size: 7,
      alpha: 1,
      type: 'spark',
    });
    consumeWeaponAmmo(player, weaponPickups);
  } else if (player.weapon === 'rocket') {
    sounds.playRocketLaunch();
    const rocketSpeed = 14 * player.facing;
    projectiles.push({
      id: Math.random().toString(),
      ownerId: player.id,
      type: 'rocket',
      x: player.x + player.facing * 28,
      y: player.y - 6,
      vx: rocketSpeed,
      vy: 0,
      damage: cfg.damage * dmgMultiplier,
      radius: 8,
      lifetime: 2.5,
      color: '#f97316',
    });
    player.vx -= player.facing * 4.5;
    consumeWeaponAmmo(player, weaponPickups);
  } else if (player.weapon === 'rope') {
    sounds.playRope();
    // Grappling hook projectile that latches and pulls enemy!
    projectiles.push({
      id: Math.random().toString(),
      ownerId: player.id,
      type: 'rope_hook',
      x: player.x + player.facing * 20,
      y: player.y - 4,
      vx: 18 * player.facing,
      vy: 0,
      damage: cfg.damage * dmgMultiplier,
      radius: 6,
      lifetime: 0.45,
      color: '#a855f7',
    });
    consumeWeaponAmmo(player, weaponPickups);
  } else if (player.weapon === 'magnet') {
    sounds.playMagnet();
    // Emits magnet pulse projectile / radial wave
    projectiles.push({
      id: Math.random().toString(),
      ownerId: player.id,
      type: 'magnet_pulse',
      x: player.x,
      y: player.y,
      vx: 0,
      vy: 0,
      damage: cfg.damage * dmgMultiplier,
      radius: cfg.range,
      lifetime: 0.35,
      color: '#06b6d4',
    });

    // Magnet disarm & pull effect:
    // 1. Pull loose pickups toward player
    weaponPickups.forEach((p) => {
      const angle = Math.atan2(player.y - p.y, player.x - p.x);
      p.vx += Math.cos(angle) * 12;
      p.vy += Math.sin(angle) * 12;
    });

    // 2. Disarm enemies in range! (respecting team)
    allPlayers.forEach((other) => {
      if (other.id !== player.id && other.isAlive && !areTeammates(player, other, gameMode)) {
        const dist = Math.hypot(player.x - other.x, player.y - other.y);
        if (dist <= cfg.range && other.weapon !== 'fists') {
          // Disarm enemy! Weapon drops into loose world
          weaponPickups.push({
            id: Math.random().toString(),
            type: other.weapon,
            x: other.x,
            y: other.y - 20,
            vx: (Math.random() - 0.5) * 8,
            vy: -7,
            ammo: other.ammo,
            grounded: false,
          });
          other.weapon = 'fists';
          other.ammo = 0;
          floatingTexts.push({
            id: Math.random().toString(),
            text: 'DISARMED!',
            x: other.x,
            y: other.y - 35,
            vy: -1.4,
            color: '#06b6d4',
            alpha: 1,
            scale: 1.1,
          });
        }
      }
    });

    consumeWeaponAmmo(player, weaponPickups);
  }
}

function consumeWeaponAmmo(player: PlayerState, weaponPickups: WeaponPickup[]) {
  if (player.weapon === 'fists') return;
  player.ammo -= 1;
  if (player.ammo <= 0) {
    player.weapon = 'fists';
    player.ammo = 0;
    player.maxAmmo = 0;
  }
}

function checkMeleeHit(
  attacker: PlayerState,
  allPlayers: PlayerState[],
  range: number,
  damage: number,
  knockback: number,
  particles: Particle[],
  floatingTexts: FloatingText[],
  gameMode?: GameMode
) {
  const isGiant = attacker.activePowerUp === 'giant';
  for (const target of allPlayers) {
    if (target.id === attacker.id || !target.isAlive || target.invincibleTimer > 0) continue;
    if (areTeammates(attacker, target, gameMode)) continue;

    const dx = target.x - attacker.x;
    const dy = target.y - attacker.y;
    const dist = Math.hypot(dx, dy);

    // Is target in front of attacker?
    const inFront = (attacker.facing === 1 && dx >= -10) || (attacker.facing === -1 && dx <= 10);

    if (dist < range && inFront) {
      // In Infection Mode, if infected hits survivor -> convert survivor!
      if (gameMode === 'infection' && attacker.isInfected && !target.isInfected) {
        infectPlayer(target, attacker, floatingTexts, particles);
        target.vx += attacker.facing * 8;
        target.vy = -5;
        return;
      }

      applyDamage(target, damage, attacker, floatingTexts, particles);
      // Knockback
      const targetKnockResistance = target.activePowerUp === 'giant' ? 0.35 : 1.0;
      target.vx += attacker.facing * knockback * targetKnockResistance;
      target.vy = -Math.abs(knockback * 0.6) * targetKnockResistance;

      // Attacker combo
      attacker.comboCount += 1;
      attacker.comboTimer = 2.5;

      // Hit sparks
      sounds.playHit();
      spawnHitSparks(target.x, target.y, particles);
    }
  }
}

export function updateProjectiles(
  projectiles: Projectile[],
  allPlayers: PlayerState[],
  platforms: Platform[],
  dt: number,
  particles: Particle[],
  floatingTexts: FloatingText[],
  shakeCallback: (amount: number) => void,
  gameMode?: GameMode
) {
  for (let i = projectiles.length - 1; i >= 0; i--) {
    const proj = projectiles[i];
    proj.lifetime -= dt;

    if (proj.lifetime <= 0) {
      if (proj.type === 'rocket') {
        explodeRocket(proj, allPlayers, particles, floatingTexts, shakeCallback, gameMode);
      }
      projectiles.splice(i, 1);
      continue;
    }

    if (proj.type === 'magnet_pulse') {
      // expands radially
      proj.radius += 200 * dt;
      continue;
    }

    // Move projectile
    proj.x += proj.vx;
    proj.y += proj.vy;

    // Rocket smoke trail
    if (proj.type === 'rocket' && Math.random() < 0.6) {
      particles.push({
        x: proj.x - proj.vx * 0.5,
        y: proj.y + (Math.random() - 0.5) * 4,
        vx: -proj.vx * 0.1,
        vy: (Math.random() - 0.5) * 1.5,
        life: 0.3,
        maxLife: 0.3,
        color: '#64748b',
        size: 5,
        alpha: 0.6,
        type: 'smoke',
      });
    }

    // Wall collision
    let collidedWithWall = false;
    for (const plat of platforms) {
      if (
        proj.x >= plat.x &&
        proj.x <= plat.x + plat.width &&
        proj.y >= plat.y &&
        proj.y <= plat.y + plat.height
      ) {
        collidedWithWall = true;
        break;
      }
    }

    if (collidedWithWall) {
      if (proj.type === 'rocket') {
        explodeRocket(proj, allPlayers, particles, floatingTexts, shakeCallback, gameMode);
      } else {
        spawnHitSparks(proj.x, proj.y, particles);
      }
      projectiles.splice(i, 1);
      continue;
    }

    // Player collision
    let hitPlayer = false;
    const attacker = allPlayers.find((p) => p.id === proj.ownerId);

    for (const target of allPlayers) {
      if (target.id === proj.ownerId || !target.isAlive || target.invincibleTimer > 0) continue;
      if (areTeammates(attacker, target, gameMode)) continue;

      const dist = Math.hypot(target.x - proj.x, target.y - proj.y);
      if (dist < target.width + proj.radius) {
        hitPlayer = true;
        if (proj.type === 'rocket') {
          explodeRocket(proj, allPlayers, particles, floatingTexts, shakeCallback, gameMode);
        } else if (proj.type === 'bullet') {
          if (gameMode === 'infection' && attacker?.isInfected && !target.isInfected) {
            infectPlayer(target, attacker, floatingTexts, particles);
          } else {
            applyDamage(target, proj.damage, attacker || null, floatingTexts, particles);
          }
          target.vx += Math.sign(proj.vx) * 6;
          target.vy -= 2;
          sounds.playHit();
          spawnHitSparks(proj.x, proj.y, particles);
        } else if (proj.type === 'rope_hook') {
          // Grapple Pull! Pull target violently towards attacker
          if (attacker) {
            const pullDir = attacker.x > target.x ? 1 : -1;
            target.vx = pullDir * 14;
            target.vy = -5;
            if (gameMode === 'infection' && attacker.isInfected && !target.isInfected) {
              infectPlayer(target, attacker, floatingTexts, particles);
            } else {
              applyDamage(target, proj.damage, attacker, floatingTexts, particles);
            }
            floatingTexts.push({
              id: Math.random().toString(),
              text: 'HOOKED!',
              x: target.x,
              y: target.y - 30,
              vy: -1.2,
              color: '#c084fc',
              alpha: 1,
              scale: 1,
            });
            sounds.playHit();
          }
        }
        break;
      }
    }

    if (hitPlayer && proj.type !== 'rocket') {
      projectiles.splice(i, 1);
    }
  }
}

function explodeRocket(
  proj: Projectile,
  allPlayers: PlayerState[],
  particles: Particle[],
  floatingTexts: FloatingText[],
  shakeCallback: (amount: number) => void,
  gameMode?: GameMode
) {
  const blastRadius = 110;
  sounds.playExplosion();
  shakeCallback(14); // Screen shake!

  // Massive explosion particles
  for (let i = 0; i < 28; i++) {
    const angle = Math.random() * Math.PI * 2;
    const spd = 2 + Math.random() * 8;
    particles.push({
      x: proj.x,
      y: proj.y,
      vx: Math.cos(angle) * spd,
      vy: Math.sin(angle) * spd,
      life: 0.45 + Math.random() * 0.35,
      maxLife: 0.8,
      color: ['#ef4444', '#f97316', '#fbbf24', '#fef08a'][Math.floor(Math.random() * 4)],
      size: 5 + Math.random() * 8,
      alpha: 1,
      type: 'fire',
    });
  }

  // Shockwave ring
  particles.push({
    x: proj.x,
    y: proj.y,
    vx: 0,
    vy: 0,
    life: 0.3,
    maxLife: 0.3,
    color: '#fbbf24',
    size: 20,
    alpha: 0.8,
    type: 'ring',
  });

  const attacker = allPlayers.find((p) => p.id === proj.ownerId);

  // Splash damage and impulse
  for (const player of allPlayers) {
    if (!player.isAlive) continue;
    if (areTeammates(attacker, player, gameMode)) continue;

    const dist = Math.hypot(player.x - proj.x, player.y - proj.y);
    if (dist < blastRadius) {
      const falloff = 1 - dist / blastRadius;
      const dmg = Math.max(10, Math.round(proj.damage * falloff));
      if (gameMode === 'infection' && attacker?.isInfected && !player.isInfected) {
        infectPlayer(player, attacker, floatingTexts, particles);
      } else {
        applyDamage(player, dmg, attacker || null, floatingTexts, particles);
      }

      const angle = Math.atan2(player.y - proj.y, player.x - proj.x);
      const impulse = 18 * falloff;
      player.vx += Math.cos(angle) * impulse;
      player.vy = Math.sin(angle) * impulse - 4;
    }
  }
}

export function applyDamage(
  target: PlayerState,
  amount: number,
  attacker: PlayerState | null,
  floatingTexts: FloatingText[],
  particles: Particle[]
) {
  if (!target.isAlive) return;

  // Shield check
  if (target.activePowerUp === 'shield' && target.shieldHp > 0) {
    target.shieldHp -= amount;
    floatingTexts.push({
      id: Math.random().toString(),
      text: `BLOCKED (${Math.round(amount)})`,
      x: target.x,
      y: target.y - 40,
      vy: -1.2,
      color: '#38bdf8',
      alpha: 1,
      scale: 0.9,
    });
    if (target.shieldHp <= 0) {
      target.activePowerUp = null;
      floatingTexts.push({
        id: Math.random().toString(),
        text: 'SHIELD BROKEN',
        x: target.x,
        y: target.y - 50,
        vy: -1.5,
        color: '#ef4444',
        alpha: 1,
        scale: 1.1,
      });
    }
    return;
  }

  target.hp -= amount;

  // Track damage
  if (attacker && attacker.id !== target.id) {
    // attacker damage dealt will be synced to playerConfig
  }

  floatingTexts.push({
    id: Math.random().toString(),
    text: `-${Math.round(amount)}`,
    x: target.x,
    y: target.y - 35,
    vy: -1.3,
    color: amount >= 30 ? '#ef4444' : '#fbbf24',
    alpha: 1,
    scale: amount >= 30 ? 1.3 : 1,
  });

  if (target.hp <= 0) {
    target.hp = 0;
    killPlayer(target, attacker, particles, floatingTexts);
  }
}

export function killPlayer(
  victim: PlayerState,
  killer: PlayerState | null,
  particles: Particle[],
  floatingTexts: FloatingText[]
) {
  if (!victim.isAlive) return;
  victim.isAlive = false;
  victim.hp = 0;
  sounds.playDeath();

  // Stick joints flailing & explosion
  for (let i = 0; i < 22; i++) {
    const angle = Math.random() * Math.PI * 2;
    const spd = 3 + Math.random() * 6;
    particles.push({
      x: victim.x,
      y: victim.y,
      vx: Math.cos(angle) * spd,
      vy: Math.sin(angle) * spd - 3,
      life: 0.8,
      maxLife: 0.8,
      color: victim.id === 1 ? '#ef4444' : victim.id === 2 ? '#3b82f6' : victim.id === 3 ? '#10b981' : '#f59e0b',
      size: 4 + Math.random() * 4,
      alpha: 1,
      type: 'debris',
    });
  }

  floatingTexts.push({
    id: Math.random().toString(),
    text: 'K.O.!',
    x: victim.x,
    y: victim.y - 45,
    vy: -1.8,
    color: '#ef4444',
    alpha: 1,
    scale: 1.6,
  });
}

export function applyPowerUp(
  player: PlayerState,
  type: PowerUpType,
  floatingTexts: FloatingText[],
  particles: Particle[]
) {
  player.activePowerUp = type;
  sounds.playPowerUp();

  let text = '';
  let color = '#38bdf8';

  if (type === 'giant') {
    player.powerUpTimeRemaining = 10;
    text = 'GIANT MODE!';
    color = '#f59e0b';
  } else if (type === 'speed') {
    player.powerUpTimeRemaining = 10;
    text = 'SPEED BOOST!';
    color = '#06b6d4';
  } else if (type === 'shield') {
    player.shieldHp = 60;
    player.powerUpTimeRemaining = 15;
    text = 'ENERGY SHIELD!';
    color = '#38bdf8';
  } else if (type === 'combo') {
    player.powerUpTimeRemaining = 12;
    player.comboCount = 1;
    text = '2X COMBO MULTIPLIER!';
    color = '#ec4899';
  } else if (type === 'jetpack') {
    player.hasJetpack = true;
    player.jetpackFuel = 5.0; // 5 seconds of active rocket flight!
    player.powerUpTimeRemaining = 20;
    text = 'JETPACK! 5s FLIGHT (SPACE/UP)';
    color = '#38bdf8';
  }

  floatingTexts.push({
    id: Math.random().toString(),
    text,
    x: player.x,
    y: player.y - 45,
    vy: -1.5,
    color,
    alpha: 1,
    scale: 1.2,
  });

  // Aura burst
  for (let i = 0; i < 16; i++) {
    const angle = Math.random() * Math.PI * 2;
    particles.push({
      x: player.x,
      y: player.y,
      vx: Math.cos(angle) * 4,
      vy: Math.sin(angle) * 4,
      life: 0.4,
      maxLife: 0.4,
      color,
      size: 4,
      alpha: 1,
      type: 'spark',
    });
  }
}

function spawnDustParticles(x: number, y: number, particles: Particle[], color = '#94a3b8') {
  for (let i = 0; i < 6; i++) {
    particles.push({
      x: x + (Math.random() - 0.5) * 16,
      y: y,
      vx: (Math.random() - 0.5) * 4,
      vy: -Math.random() * 2 - 0.5,
      life: 0.25,
      maxLife: 0.25,
      color,
      size: 3,
      alpha: 0.7,
      type: 'smoke',
    });
  }
}

function spawnHitSparks(x: number, y: number, particles: Particle[]) {
  for (let i = 0; i < 10; i++) {
    const angle = Math.random() * Math.PI * 2;
    const spd = 2 + Math.random() * 5;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * spd,
      vy: Math.sin(angle) * spd,
      life: 0.25,
      maxLife: 0.25,
      color: '#fef08a',
      size: 3,
      alpha: 1,
      type: 'spark',
    });
  }
}

function spawnSlashParticles(player: PlayerState, particles: Particle[]) {
  for (let i = 0; i < 8; i++) {
    const angle = (player.facing === 1 ? -0.4 : Math.PI - 0.4) + (Math.random() - 0.5) * 0.8;
    particles.push({
      x: player.x + player.facing * 30,
      y: player.y - 10 + (Math.random() - 0.5) * 20,
      vx: Math.cos(angle) * 6,
      vy: Math.sin(angle) * 4,
      life: 0.18,
      maxLife: 0.18,
      color: '#e2e8f0',
      size: 4,
      alpha: 0.9,
      type: 'spark',
    });
  }
}

function spawnAxeSlashParticles(player: PlayerState, particles: Particle[]) {
  for (let i = 0; i < 14; i++) {
    const angle = (player.facing === 1 ? -0.2 : Math.PI - 0.2) + (Math.random() - 0.5) * 1.2;
    const spd = 4 + Math.random() * 6;
    particles.push({
      x: player.x + player.facing * 35,
      y: player.y - 8 + (Math.random() - 0.5) * 28,
      vx: Math.cos(angle) * spd,
      vy: Math.sin(angle) * spd,
      life: 0.24,
      maxLife: 0.24,
      color: Math.random() < 0.6 ? '#f97316' : '#facc15',
      size: 4 + Math.random() * 3,
      alpha: 0.95,
      type: 'spark',
    });
  }
}
