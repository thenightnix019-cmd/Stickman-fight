export type PlayerId = 1 | 2 | 3 | 4 | 5 | 6;

export type PlayerType = 'human' | 'cpu';

export type WeaponType = 'fists' | 'sword' | 'axe' | 'gun' | 'rocket' | 'rope' | 'magnet';

export type PowerUpType = 'giant' | 'speed' | 'shield' | 'combo' | 'jetpack';

export type TeamId = 'red' | 'blue';

export type AIDifficulty = 'easy' | 'normal' | 'hard';

export type GameMode =
  | 'battle_royale'
  | 'king_of_the_hill'
  | 'weapon_roulette'
  | 'chaos'
  | 'team_deathmatch'
  | 'infection';

export type RandomEventType = 'none' | 'gravity' | 'wind' | 'earthquake' | 'fire' | 'zoom';

export interface PlayerKeyBinding {
  left: string;
  right: string;
  jump: string;
  down: string;
  attack: string;
}

export type PlayerKeyBindingsMap = Record<PlayerId, PlayerKeyBinding>;

export interface PlayerControls {
  up: string[];
  down: string[];
  left: string[];
  right: string[];
  attack: string[];
}

export interface PlayerConfig {
  id: PlayerId;
  name: string;
  color: string;
  glowColor: string;
  type: PlayerType;
  enabled: boolean;
  score: number; // rounds won
  points: number; // KOTH points or total score
  kills: number;
  deaths: number;
  damageDealt: number;
  team?: TeamId;
  isInfected?: boolean;
  aiDifficulty?: AIDifficulty;
  equippedHat?: string | null;
  equippedSkin?: string | null;
  equippedShoes?: string | null;
}

export interface PlayerState {
  id: PlayerId;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  facing: 1 | -1;
  isGrounded: boolean;
  canDoubleJump: boolean;
  hp: number;
  maxHp: number;
  isAlive: boolean;
  invincibleTimer: number; // in seconds
  team?: TeamId;
  isInfected?: boolean;
  
  // Stick figure animation state
  walkFrame: number;
  armAngle: number;
  attackTimer: number; // duration of attack swing/animation
  attackCooldown: number;
  isAttacking: boolean;
  
  // Weapon
  weapon: WeaponType;
  ammo: number;
  maxAmmo: number;

  // Power-ups
  activePowerUp: PowerUpType | null;
  powerUpTimeRemaining: number;
  shieldHp: number;
  comboCount: number;
  comboTimer: number;

  // Rope / Grapple state
  ropeTarget: { x: number; y: number } | null;
  isPulling: boolean;

  // Status effects
  onFireTimer: number;
  frozenTimer: number;

  // Jetpack & Wall Parkour
  hasJetpack?: boolean;
  jetpackFuel?: number; // 0 to 5.0 seconds
  isJetpacking?: boolean;
  isWallSliding?: boolean;
  wallSlideSide?: 'left' | 'right' | null;
}

export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  oneWay?: boolean;
  isHazard?: boolean;
  color?: string;
  name?: string;
}

export interface WeaponPickup {
  id: string;
  type: WeaponType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  ammo: number;
  grounded: boolean;
}

export interface PowerUpPickup {
  id: string;
  type: PowerUpType;
  x: number;
  y: number;
  duration: number; // time left to pick up
  bobOffset: number;
}

export interface Projectile {
  id: string;
  ownerId: PlayerId;
  type: 'bullet' | 'rocket' | 'rope_hook' | 'magnet_pulse';
  x: number;
  y: number;
  vx: number;
  vy: number;
  damage: number;
  radius: number;
  lifetime: number; // seconds
  color: string;
  targetPlayerId?: PlayerId;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  alpha: number;
  type?: 'spark' | 'smoke' | 'fire' | 'blood' | 'ring' | 'debris';
}

export interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  vy: number;
  color: string;
  alpha: number;
  scale: number;
}

export interface ActiveEvent {
  type: RandomEventType;
  name: string;
  description: string;
  timeRemaining: number;
  maxDuration: number;
  intensity: number;
  param?: number; // e.g. wind velocity or camera scale
}

export interface FirePatch {
  x: number;
  y: number;
  width: number;
  duration: number;
}

export interface ArenaMap {
  id: string;
  name: string;
  subtitle: string;
  width: number;
  height: number;
  spawnPoints: { x: number; y: number }[];
  platforms: Platform[];
  hillZone?: {
    x: number;
    y: number;
    width: number;
    height: number;
    name?: string;
    dps?: number;
    color?: string;
  };
  theme: {
    bgGradient: [string, string];
    gridColor: string;
    platformColor: string;
    platformBorder: string;
    accentColor: string;
  };
}

export interface GameSettings {
  mode: GameMode;
  roundsToWin: number;
  eventInterval: number; // seconds
  selectedMap: string;
  soundEnabled: boolean;
  aiDifficulty: AIDifficulty;
}
