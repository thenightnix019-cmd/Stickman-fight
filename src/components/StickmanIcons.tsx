import React from 'react';

interface StickmanIconProps {
  className?: string;
  size?: number;
  color?: string;
}

/**
 * Stickman wielding a heavy battleaxe
 */
export const StickmanAxe: React.FC<StickmanIconProps> = ({ className = 'w-6 h-6', color = 'currentColor' }) => (
  <svg viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Head */}
    <circle cx="12" cy="7" r="3.5" stroke={color} fill="none" />
    {/* Spine */}
    <line x1="12" y1="10.5" x2="13" y2="19" />
    {/* Legs */}
    <polyline points="7,27 11,21 13,19 16,22 19,27" />
    {/* Arms holding axe */}
    <line x1="12" y1="13" x2="18" y2="12" />
    <line x1="18" y1="12" x2="22" y2="9" />
    {/* Axe shaft */}
    <line x1="17" y1="19" x2="25" y2="4" stroke="#fbbf24" strokeWidth="2.2" />
    {/* Axe blade */}
    <path d="M 23 5 Q 29 3 28 9 Q 24 10 22 7 Z" fill="#94a3b8" stroke="#f8fafc" strokeWidth="1.2" />
  </svg>
);

/**
 * Stickman with a sharp sword
 */
export const StickmanSword: React.FC<StickmanIconProps> = ({ className = 'w-6 h-6', color = 'currentColor' }) => (
  <svg viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="7" r="3.5" />
    <line x1="11" y1="10.5" x2="12" y2="19" />
    <polyline points="7,27 10,21 12,19 15,22 18,27" />
    {/* Arms */}
    <line x1="11" y1="13" x2="18" y2="14" />
    {/* Sword blade */}
    <line x1="18" y1="14" x2="27" y2="6" stroke="#38bdf8" strokeWidth="2.2" />
    <line x1="16" y1="16" x2="19" y2="12" stroke="#fbbf24" strokeWidth="1.5" />
  </svg>
);

/**
 * Stickman firing a blaster gun
 */
export const StickmanGun: React.FC<StickmanIconProps> = ({ className = 'w-6 h-6', color = 'currentColor' }) => (
  <svg viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="10" cy="7" r="3.5" />
    <line x1="10" y1="10.5" x2="11" y2="19" />
    <polyline points="6,27 9,21 11,19 14,22 17,27" />
    {/* Arms holding gun forward */}
    <line x1="10" y1="13" x2="18" y2="13" />
    {/* Gun & laser */}
    <rect x="18" y="11" width="6" height="3.5" rx="1" fill="#38bdf8" stroke="#38bdf8" />
    <line x1="25" y1="13" x2="28" y2="13" stroke="#f43f5e" strokeWidth="2" />
  </svg>
);

/**
 * Stickman launching a heavy rocket
 */
export const StickmanRocket: React.FC<StickmanIconProps> = ({ className = 'w-6 h-6', color = 'currentColor' }) => (
  <svg viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="10" cy="8" r="3.5" />
    <line x1="10" y1="11.5" x2="11" y2="20" />
    <polyline points="6,27 9,22 11,20 14,23 17,27" />
    {/* Shoulder rocket */}
    <rect x="11" y="9" width="13" height="5" rx="1.5" fill="#f97316" stroke="#fbbf24" strokeWidth="1.2" />
    <polygon points="24,8.5 28,11.5 24,14.5" fill="#ef4444" stroke="#ef4444" />
    <circle cx="8" cy="11.5" r="1.5" fill="#f59e0b" />
  </svg>
);

/**
 * Stickman swinging with a grapple hook
 */
export const StickmanGrapple: React.FC<StickmanIconProps> = ({ className = 'w-6 h-6', color = 'currentColor' }) => (
  <svg viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="10" cy="10" r="3.5" />
    <line x1="10" y1="13.5" x2="13" y2="21" />
    <polyline points="9,28 12,23 13,21 16,24 20,28" />
    {/* Arm reaching to rope */}
    <line x1="11" y1="15" x2="17" y2="11" />
    {/* Rope & Hook */}
    <line x1="17" y1="11" x2="26" y2="4" stroke="#10b981" strokeDasharray="2,2" strokeWidth="1.8" />
    <path d="M 24 3 C 27 2 28 6 26 7" stroke="#34d399" strokeWidth="2" />
  </svg>
);

/**
 * Stickman projecting a magnetic pulse
 */
export const StickmanMagnet: React.FC<StickmanIconProps> = ({ className = 'w-6 h-6', color = 'currentColor' }) => (
  <svg viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="10" cy="8" r="3.5" />
    <line x1="10" y1="11.5" x2="11" y2="20" />
    <polyline points="6,27 9,22 11,20 14,23 17,27" />
    <line x1="10" y1="14" x2="18" y2="14" />
    {/* Magnet horseshoe */}
    <path d="M 19 11 C 23 11 23 17 19 17" stroke="#a855f7" strokeWidth="2.5" />
    <path d="M 23 9 C 27 9 27 19 23 19" stroke="#c084fc" strokeWidth="1.5" strokeDasharray="2 1" />
  </svg>
);

/**
 * Stickman in rapid sprint with speed trails
 */
export const StickmanSpeed: React.FC<StickmanIconProps> = ({ className = 'w-6 h-6', color = 'currentColor' }) => (
  <svg viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Speed lines */}
    <line x1="2" y1="12" x2="7" y2="12" stroke="#06b6d4" strokeWidth="1.5" />
    <line x1="3" y1="18" x2="9" y2="18" stroke="#06b6d4" strokeWidth="1.5" />
    {/* Head tilted forward */}
    <circle cx="18" cy="8" r="3.5" />
    <line x1="16" y1="11" x2="12" y2="19" />
    {/* Running legs */}
    <polyline points="12,19 7,22 4,26" />
    <polyline points="12,19 17,21 23,23" />
    {/* Running arms */}
    <line x1="15" y1="13" x2="21" y2="12" />
    <line x1="15" y1="13" x2="10" y2="15" />
  </svg>
);

/**
 * Stickman protected by an energy shield bubble
 */
export const StickmanShield: React.FC<StickmanIconProps> = ({ className = 'w-6 h-6', color = 'currentColor' }) => (
  <svg viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="16" cy="16" r="13" stroke="#38bdf8" strokeWidth="1.8" strokeDasharray="3 2" fill="rgba(56, 189, 248, 0.15)" />
    <circle cx="16" cy="9" r="3" />
    <line x1="16" y1="12" x2="16" y2="19" />
    <polyline points="12,26 15,21 16,19 17,21 20,26" />
    <line x1="16" y1="14" x2="12" y2="16" />
    <line x1="16" y1="14" x2="20" y2="16" />
  </svg>
);

/**
 * Stickman in berserk fire mode
 */
export const StickmanFire: React.FC<StickmanIconProps> = ({ className = 'w-6 h-6', color = 'currentColor' }) => (
  <svg viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Flame shapes */}
    <path d="M 16 3 C 18 7 21 8 20 12 C 19 14 17 15 16 15 C 15 15 13 14 12 12 C 11 8 14 7 16 3 Z" fill="#f97316" stroke="#fbbf24" strokeWidth="1" />
    <circle cx="16" cy="14" r="3" />
    <line x1="16" y1="17" x2="16" y2="23" />
    <polyline points="12,29 15,25 16,23 17,25 20,29" />
    <line x1="16" y1="19" x2="11" y2="18" />
    <line x1="16" y1="19" x2="21" y2="18" />
  </svg>
);

/**
 * Stickman floating high in low gravity / colossal leap
 */
export const StickmanGravity: React.FC<StickmanIconProps> = ({ className = 'w-6 h-6', color = 'currentColor' }) => (
  <svg viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Orbit star trails */}
    <circle cx="25" cy="7" r="1.2" fill="#c084fc" />
    <circle cx="7" cy="10" r="1" fill="#c084fc" />
    {/* Leaping stick figure in air */}
    <circle cx="16" cy="8" r="3.2" />
    <line x1="16" y1="11.2" x2="16" y2="18" />
    {/* Dynamic splayed air limbs */}
    <line x1="16" y1="13" x2="9" y2="10" />
    <line x1="16" y1="13" x2="23" y2="10" />
    <line x1="16" y1="18" x2="11" y2="25" />
    <line x1="16" y1="18" x2="21" y2="25" />
    {/* High jump arc underneath */}
    <path d="M 6 29 Q 16 23 26 29" stroke="#a855f7" strokeWidth="1.8" strokeDasharray="2 2" />
  </svg>
);

/**
 * Stickman enduring howling winds
 */
export const StickmanWind: React.FC<StickmanIconProps> = ({ className = 'w-6 h-6', color = 'currentColor' }) => (
  <svg viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Wind gusts */}
    <path d="M 3 8 C 8 8 11 6 13 6" stroke="#94a3b8" strokeWidth="1.5" />
    <path d="M 2 15 C 8 15 12 13 15 13" stroke="#cbd5e1" strokeWidth="1.8" />
    <path d="M 4 23 C 9 23 13 21 16 21" stroke="#94a3b8" strokeWidth="1.5" />
    {/* Stick figure leaning backward against the wind */}
    <circle cx="21" cy="9" r="3.2" />
    <line x1="21" y1="12.2" x2="19" y2="20" />
    <polyline points="15,27 18,23 19,20 22,23 23,28" />
    <line x1="20" y1="15" x2="14" y2="14" />
  </svg>
);

/**
 * Stickman leaping safely above magma / lava
 */
export const StickmanLava: React.FC<StickmanIconProps> = ({ className = 'w-6 h-6', color = 'currentColor' }) => (
  <svg viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Stick figure leaping high */}
    <circle cx="16" cy="7" r="3" />
    <line x1="16" y1="10" x2="16" y2="17" />
    <line x1="16" y1="12" x2="11" y2="10" />
    <line x1="16" y1="12" x2="21" y2="10" />
    <polyline points="12,22 14,19 16,17 18,19 20,22" />
    {/* Molten magma ground & bubbles */}
    <path d="M 3 27 Q 7 24 11 27 Q 16 24 21 27 Q 26 24 29 27" stroke="#ef4444" strokeWidth="2.5" />
    <circle cx="10" cy="23" r="1.5" fill="#f97316" />
    <circle cx="22" cy="22" r="1.5" fill="#f97316" />
  </svg>
);

/**
 * Stickman Gamer with arcade stick / controller
 */
export const StickmanGamer: React.FC<StickmanIconProps> = ({ className = 'w-6 h-6', color = 'currentColor' }) => (
  <svg viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="16" cy="8" r="3.5" />
    <line x1="16" y1="11.5" x2="16" y2="20" />
    <polyline points="10,27 14,22 16,20 18,22 22,27" />
    {/* Arms holding controller */}
    <line x1="16" y1="14" x2="12" y2="17" />
    <line x1="16" y1="14" x2="20" y2="17" />
    {/* Gamepad */}
    <rect x="10" y="16" width="12" height="6" rx="2" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
    <circle cx="13" cy="19" r="1" fill="#38bdf8" />
    <circle cx="19" cy="19" r="1" fill="#f43f5e" />
  </svg>
);

/**
 * Stickman holding a gift reward
 */
export const StickmanGift: React.FC<StickmanIconProps> = ({ className = 'w-6 h-6', color = 'currentColor' }) => (
  <svg viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="8" r="3" />
    <line x1="11" y1="11" x2="12" y2="19" />
    <polyline points="8,27 10,22 12,19 14,22 17,27" />
    {/* Hands holding gift */}
    <line x1="11" y1="14" x2="18" y2="16" />
    {/* Gift box */}
    <rect x="18" y="14" width="10" height="9" rx="1.5" fill="#f59e0b" stroke="#fbbf24" strokeWidth="1.5" />
    <line x1="23" y1="14" x2="23" y2="23" stroke="#ef4444" strokeWidth="1.5" />
    <line x1="18" y1="18.5" x2="28" y2="18.5" stroke="#ef4444" strokeWidth="1.5" />
    <circle cx="23" cy="13" r="1" fill="#fef08a" />
  </svg>
);

/**
 * Stickman standing by height measurement ruler
 */
export const StickmanRuler: React.FC<StickmanIconProps> = ({ className = 'w-6 h-6', color = 'currentColor' }) => (
  <svg viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Ruler on right */}
    <line x1="26" y1="5" x2="26" y2="27" stroke="#06b6d4" strokeWidth="2" />
    <line x1="23" y1="7" x2="26" y2="7" stroke="#06b6d4" strokeWidth="1.5" />
    <line x1="24" y1="12" x2="26" y2="12" stroke="#06b6d4" strokeWidth="1.5" />
    <line x1="23" y1="17" x2="26" y2="17" stroke="#06b6d4" strokeWidth="1.5" />
    <line x1="24" y1="22" x2="26" y2="22" stroke="#06b6d4" strokeWidth="1.5" />
    {/* Stickman standing upright */}
    <circle cx="14" cy="9" r="3.2" />
    <line x1="14" y1="12.2" x2="14" y2="20" />
    <line x1="14" y1="20" x2="11" y2="27" />
    <line x1="14" y1="20" x2="17" y2="27" />
    <line x1="14" y1="14" x2="9" y2="17" />
    <line x1="14" y1="14" x2="23" y2="7" stroke="#38bdf8" strokeDasharray="1 1" />
  </svg>
);

/**
 * Stickman doing a parkour wall kick
 */
export const StickmanParkour: React.FC<StickmanIconProps> = ({ className = 'w-6 h-6', color = 'currentColor' }) => (
  <svg viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Wall on left */}
    <line x1="5" y1="4" x2="5" y2="28" stroke="#64748b" strokeWidth="2.5" />
    {/* Spark off wall */}
    <line x1="5" y1="16" x2="8" y2="14" stroke="#38bdf8" strokeWidth="1.5" />
    <line x1="5" y1="16" x2="8" y2="18" stroke="#38bdf8" strokeWidth="1.5" />
    {/* Stickman kicking off wall */}
    <circle cx="17" cy="8" r="3.2" />
    <line x1="17" y1="11.2" x2="15" y2="18" />
    {/* Left foot planted against wall, right foot kicking out */}
    <polyline points="5,16 10,18 15,18" stroke="#38bdf8" strokeWidth="2.2" />
    <polyline points="15,18 20,21 24,25" />
    {/* Hands braced */}
    <line x1="16" y1="13" x2="8" y2="12" />
    <line x1="16" y1="13" x2="22" y2="14" />
  </svg>
);

/**
 * Stickman Hero with Cape & Battleaxe (The Hero Mode)
 */
export const StickmanHero: React.FC<StickmanIconProps> = ({ className = 'w-6 h-6', color = 'currentColor' }) => (
  <svg viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Flowing hero cape */}
    <path d="M 12 11 Q 5 14 4 23 Q 9 20 13 18 Z" fill="#ef4444" stroke="#dc2626" strokeWidth="1" />
    {/* Head with heroic crown/mask */}
    <circle cx="15" cy="7" r="3.5" />
    <polygon points="12,5 15,2 18,5" fill="#fbbf24" stroke="#fbbf24" strokeWidth="1" />
    {/* Body */}
    <line x1="15" y1="10.5" x2="15" y2="19" />
    <polyline points="10,27 13,21 15,19 17,21 20,27" />
    {/* Giant Battleaxe */}
    <line x1="15" y1="13" x2="21" y2="11" />
    <line x1="18" y1="20" x2="27" y2="4" stroke="#fbbf24" strokeWidth="2.5" />
    <path d="M 25 5 Q 31 3 30 10 Q 25 11 23 8 Z" fill="#94a3b8" stroke="#f8fafc" strokeWidth="1.2" />
  </svg>
);
