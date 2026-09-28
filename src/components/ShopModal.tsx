import React, { useState } from 'react';
import {
  ShopHat,
  ShopSkin,
  ShopShoes,
  ShopWeaponSkin,
  PlayerWallet,
  HATS,
  SKINS,
  SHOES,
  WEAPON_SKINS,
} from '../types/shop';
import { PlayerConfig, PlayerId } from '../types/game';
import { saveWallet, claimYoutubeRecharge } from '../services/shopStorage';
import { sounds } from '../audio/soundEngine';
import {
  ShoppingBag,
  Check,
  X,
  Crown,
  Shirt,
  Footprints,
  Coins,
  Gem,
  Info,
  Gift,
  ExternalLink,
  Swords,
  Sparkles,
} from 'lucide-react';
import { StickmanGift, StickmanRuler } from './StickmanIcons';

interface ShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: PlayerWallet;
  onUpdateWallet: (wallet: PlayerWallet) => void;
  playerConfigs: PlayerConfig[];
  onUpdatePlayerConfig: (id: PlayerId, updates: Partial<PlayerConfig>) => void;
}

/* ========================================================================= */
/* REAL GRAPHICAL VECTOR SVG ILLUSTRATIONS (NO EMOJIS!)                       */
/* ========================================================================= */

const HatGraphic: React.FC<{ hatId: string; isSpecial?: boolean }> = ({ hatId, isSpecial }) => {
  switch (hatId) {
    case 'cowboy_hat':
      return (
        <svg width="72" height="52" viewBox="0 0 100 70" fill="none" className="drop-shadow-md">
          {/* Brim */}
          <path
            d="M 5 50 Q 50 68 95 50 Q 50 42 5 50 Z"
            fill="#78350f"
            stroke="#451a03"
            strokeWidth="2.5"
          />
          {/* Crown */}
          <path
            d="M 26 48 L 32 16 Q 50 24 68 16 L 74 48 Z"
            fill="#92400e"
            stroke="#451a03"
            strokeWidth="2.5"
          />
          {/* Crease fold on top */}
          <path d="M 38 18 Q 50 28 62 18" stroke="#451a03" strokeWidth="2.5" fill="none" />
          {/* Hat band */}
          <path d="M 28 44 Q 50 50 72 44" stroke="#fbbf24" strokeWidth="4" fill="none" />
          {/* Sheriff Star badge */}
          <polygon
            points="50,40 52,43 55,43 53,45 54,48 50,46 46,48 47,45 45,43 48,43"
            fill="#fef08a"
            stroke="#ca8a04"
            strokeWidth="0.8"
          />
        </svg>
      );
    case 'ninja_bandana':
      return (
        <svg width="72" height="52" viewBox="0 0 100 70" fill="none" className="drop-shadow-md">
          {/* Headband base */}
          <rect x="18" y="24" width="64" height="14" rx="4" fill="#dc2626" stroke="#991b1b" strokeWidth="2" />
          {/* Metal plate */}
          <rect x="36" y="26" width="28" height="10" rx="2" fill="#e2e8f0" stroke="#64748b" strokeWidth="1.5" />
          {/* Metal rivets */}
          <circle cx="39" cy="31" r="1.2" fill="#475569" />
          <circle cx="61" cy="31" r="1.2" fill="#475569" />
          {/* Engraved Shinobi Symbol */}
          <path d="M 46 31 Q 50 27 54 31 Q 50 35 46 31" stroke="#334155" strokeWidth="1.2" fill="none" />
          {/* Trailing Ribbons blowing in wind */}
          <path d="M 18 32 Q 5 28 0 40 Q 8 36 18 34" fill="#ef4444" />
          <path d="M 18 34 Q 8 46 2 56 Q 12 48 18 36" fill="#b91c1c" />
        </svg>
      );
    case 'viking_helmet':
      return (
        <svg width="72" height="52" viewBox="0 0 100 70" fill="none" className="drop-shadow-md">
          {/* Iron Dome */}
          <path d="M 28 46 Q 50 16 72 46 Z" fill="#64748b" stroke="#334155" strokeWidth="2.5" />
          {/* Brow Band */}
          <rect x="25" y="44" width="50" height="7" rx="2" fill="#475569" stroke="#1e293b" strokeWidth="1.5" />
          {/* Nose Guard */}
          <path d="M 47 48 L 53 48 L 50 58 Z" fill="#475569" stroke="#1e293b" strokeWidth="1" />
          {/* Rivets */}
          <circle cx="32" cy="47.5" r="1.2" fill="#facc15" />
          <circle cx="50" cy="47.5" r="1.2" fill="#facc15" />
          <circle cx="68" cy="47.5" r="1.2" fill="#facc15" />
          {/* Left Horn */}
          <path d="M 32 40 Q 14 36 12 18 Q 22 28 34 34 Z" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.8" />
          {/* Right Horn */}
          <path d="M 68 40 Q 86 36 88 18 Q 78 28 66 34 Z" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.8" />
        </svg>
      );
    case 'samurai_kabuto':
      return (
        <svg width="72" height="52" viewBox="0 0 100 70" fill="none" className="drop-shadow-md">
          {/* Lacquered Bowl */}
          <path d="M 26 44 Q 50 18 74 44 Z" fill="#0f172a" stroke="#d97706" strokeWidth="2" />
          {/* Neck Guard Plates (Shikoro) */}
          <path d="M 18 52 Q 50 56 82 52 L 78 44 Q 50 47 22 44 Z" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="1.5" />
          {/* Golden Crescent Moon Crest (Maedate) */}
          <path
            d="M 50 10 Q 30 18 36 34 Q 44 24 50 26 Q 56 24 64 34 Q 70 18 50 10 Z"
            fill="#fbbf24"
            stroke="#b45309"
            strokeWidth="1.5"
            className="drop-shadow-[0_0_6px_#fbbf24]"
          />
          {/* Brow ornament */}
          <circle cx="50" cy="38" r="3" fill="#ef4444" stroke="#fbbf24" strokeWidth="1.2" />
        </svg>
      );
    case 'cyber_visor':
      return (
        <svg width="72" height="52" viewBox="0 0 100 70" fill="none" className="drop-shadow-md">
          {/* Tactical Frame */}
          <path d="M 20 28 L 80 28 L 74 46 L 26 46 Z" fill="#042f2e" stroke="#0891b2" strokeWidth="2" />
          {/* Glowing Neon Visor Screen */}
          <path
            d="M 24 30 L 76 30 L 71 44 L 29 44 Z"
            fill="#06b6d4"
            className="drop-shadow-[0_0_10px_#22d3ee]"
          />
          {/* Digital HUD Reticle lines */}
          <line x1="38" y1="37" x2="62" y2="37" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="3 2" />
          <circle cx="50" cy="37" r="4" stroke="#ffffff" strokeWidth="1.2" fill="none" />
          {/* Temple Earpiece mounts */}
          <rect x="14" y="30" width="7" height="12" rx="2" fill="#0e7490" />
          <rect x="79" y="30" width="7" height="12" rx="2" fill="#0e7490" />
        </svg>
      );
    case 'wizard_hat':
      return (
        <svg width="72" height="52" viewBox="0 0 100 70" fill="none" className="drop-shadow-md">
          {/* Wide curved brim */}
          <ellipse cx="50" cy="52" rx="42" ry="9" fill="#3b0764" stroke="#581c87" strokeWidth="2.5" />
          {/* Crooked Pointed Cone */}
          <path
            d="M 28 50 Q 42 28 32 10 Q 52 24 72 50 Z"
            fill="#581c87"
            stroke="#6b21a8"
            strokeWidth="2.5"
          />
          {/* Golden Stars embroidery */}
          <polygon points="44,30 45,33 48,33 46,35 47,38 44,36 41,38 42,35 40,33 43,33" fill="#facc15" />
          <polygon points="56,40 57,42 60,42 58,44 59,46 56,45 54,46 55,44 53,42 55,42" fill="#facc15" />
          {/* Golden star hanging from tip */}
          <circle cx="32" cy="10" r="2.5" fill="#facc15" className="animate-ping" />
        </svg>
      );
    case 'pirate_tricorne':
      return (
        <svg width="72" height="52" viewBox="0 0 100 70" fill="none" className="drop-shadow-md">
          {/* Three-cornered hat */}
          <path
            d="M 12 46 L 50 14 L 88 46 Q 50 56 12 46 Z"
            fill="#0f172a"
            stroke="#cbd5e1"
            strokeWidth="2"
          />
          {/* Silver Brim Trim */}
          <path d="M 12 46 Q 50 54 88 46" stroke="#94a3b8" strokeWidth="3" fill="none" />
          {/* Jolly Roger Skull */}
          <circle cx="50" cy="36" r="4.5" fill="#f8fafc" />
          <circle cx="48.5" cy="36" r="1" fill="#0f172a" />
          <circle cx="51.5" cy="36" r="1" fill="#0f172a" />
          {/* Crossed Bones */}
          <line x1="43" y1="44" x2="57" y2="44" stroke="#f8fafc" strokeWidth="1.8" strokeLinecap="round" />
          {/* White Feather Plume */}
          <path d="M 68 34 Q 84 18 82 8 Q 78 22 66 32" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1" />
        </svg>
      );
    case 'celestial_crown':
    default:
      return (
        <div className="relative flex items-center justify-center">
          {/* Pulsing Light Rays behind Special Crown */}
          <div className="absolute inset-0 bg-amber-400/25 blur-xl rounded-full animate-pulse" />
          <svg width="84" height="60" viewBox="0 0 100 75" fill="none" className="drop-shadow-[0_0_16px_#fbbf24]">
            {/* Divine Sunburst Rays */}
            <line x1="50" y1="5" x2="50" y2="16" stroke="#fef08a" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="28" y1="12" x2="36" y2="21" stroke="#fef08a" strokeWidth="2" strokeLinecap="round" />
            <line x1="72" y1="12" x2="64" y2="21" stroke="#fef08a" strokeWidth="2" strokeLinecap="round" />
            <line x1="14" y1="28" x2="24" y2="33" stroke="#fef08a" strokeWidth="2" strokeLinecap="round" />
            <line x1="86" y1="28" x2="76" y2="33" stroke="#fef08a" strokeWidth="2" strokeLinecap="round" />

            {/* Five-point Golden Crown Body */}
            <path
              d="M 18 58 L 16 32 L 32 44 L 50 18 L 68 44 L 84 32 L 82 58 Z"
              fill="url(#goldGrad)"
              stroke="#b45309"
              strokeWidth="2.5"
            />
            {/* Crown Base Rim */}
            <rect x="16" y="56" width="68" height="8" rx="2" fill="#d97706" stroke="#78350f" strokeWidth="1.5" />

            {/* Radiant Ruby Jewel in Center */}
            <polygon
              points="50,30 55,36 50,42 45,36"
              fill="#ef4444"
              stroke="#7f1d1d"
              strokeWidth="1.2"
              className="drop-shadow-[0_0_8px_#ef4444]"
            />
            {/* Emerald Side Jewels */}
            <circle cx="32" cy="48" r="2.8" fill="#10b981" stroke="#064e3b" strokeWidth="1" />
            <circle cx="68" cy="48" r="2.8" fill="#10b981" stroke="#064e3b" strokeWidth="1" />

            {/* Pearl spires */}
            <circle cx="16" cy="32" r="3.2" fill="#ffffff" stroke="#f59e0b" strokeWidth="1.2" />
            <circle cx="50" cy="18" r="4.2" fill="#ffffff" stroke="#f59e0b" strokeWidth="1.5" className="animate-ping" />
            <circle cx="84" cy="32" r="3.2" fill="#ffffff" stroke="#f59e0b" strokeWidth="1.2" />

            <defs>
              <linearGradient id="goldGrad" x1="50" y1="18" x2="50" y2="58" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      );
  }
};

export const BaseStickmanGraphic: React.FC<{ color?: string }> = ({ color = '#38bdf8' }) => {
  return (
    <div className="relative flex items-center justify-center py-1">
      <svg width="68" height="84" viewBox="0 0 80 100" fill="none" className="relative z-10 drop-shadow-md">
        {/* Head: cx=40, cy=22, r=9 (top at y=13) */}
        <circle cx="40" cy="22" r="9" fill="#0f172a" stroke={color} strokeWidth="3" />
        <circle cx="43" cy="21" r="1.5" fill="#ffffff" />

        {/* Torso / Spine: (40, 31) to (40, 56) */}
        <line x1="40" y1="31" x2="40" y2="56" stroke={color} strokeWidth="3.5" strokeLinecap="round" />

        {/* Arms: (40, 35) to (25, 48) and (40, 35) to (55, 48) */}
        <line x1="40" y1="35" x2="25" y2="48" stroke={color} strokeWidth="3" strokeLinecap="round" />
        <line x1="40" y1="35" x2="55" y2="48" stroke={color} strokeWidth="3" strokeLinecap="round" />

        {/* Legs: (40, 56) to (31, 72) -> (28, 88) and (40, 56) to (49, 72) -> (52, 88) (feet at y=88) */}
        <polyline points="40,56 31,72 28,88" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="40,56 49,72 52,88" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

const SkinGraphic: React.FC<{ skin: ShopSkin }> = ({ skin }) => {
  return (
    <div className="relative flex items-center justify-center py-1">
      {/* Radiant Superhero Aura */}
      <div
        className="absolute inset-0 rounded-full blur-xl opacity-40 animate-pulse pointer-events-none"
        style={{ backgroundColor: skin.glowColor }}
      />
      {/* 
        PRECISE PROPORTIONS:
        Height is EXACTLY 75px (from top of head y=13 to bottom of feet y=88),
        identical to the base stickman without a skin ("بنفس طول الشخصية دون سكين")!
      */}
      <svg width="68" height="84" viewBox="0 0 80 100" fill="none" className="relative z-10 drop-shadow-md">
        {/* 1. Hero Flowing Cape (Behind Skeleton) */}
        {skin.hasCape && (
          <>
            {skin.emblem === 'bat' ? (
              // Scalloped Dark Knight Bat Cape
              <path
                d="M 33 35 L 20 78 L 27 73 L 34 78 L 40 73 L 46 78 L 53 73 L 60 78 L 47 35 Z"
                fill={skin.capeColor || '#020617'}
                stroke="#334155"
                strokeWidth="1.2"
              />
            ) : skin.emblem === 'wonder' ? (
              // Royal Amazon Blue Cape with Gold Hem
              <g>
                <path
                  d="M 34 35 L 22 78 Q 40 82 58 78 L 46 35 Z"
                  fill={skin.capeColor || '#1e3a8a'}
                  stroke="#fbbf24"
                  strokeWidth="1.5"
                />
                <circle cx="28" cy="74" r="1.2" fill="#ffffff" />
                <circle cx="40" cy="75" r="1.2" fill="#ffffff" />
                <circle cx="52" cy="74" r="1.2" fill="#ffffff" />
              </g>
            ) : skin.emblem === 'justice' ? (
              // Royal Cosmic Sovereign Cape
              <path
                d="M 33 35 L 18 78 Q 40 84 62 78 L 47 35 Z"
                fill={skin.capeColor || '#4338ca'}
                stroke="#fbbf24"
                strokeWidth="1.5"
              />
            ) : (
              // Classic Superman Royal Red Cape
              <path
                d="M 34 35 L 22 78 Q 40 82 58 78 L 46 35 Z"
                fill={skin.capeColor || '#dc2626'}
                stroke="#991b1b"
                strokeWidth="1.5"
              />
            )}
          </>
        )}

        {/* 2. Stick Figure Legs (exact same length to y=88) */}
        {/* Left Leg */}
        <polyline
          points="40,56 31,72 28,88"
          stroke={skin.primaryColor}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Right Leg */}
        <polyline
          points="40,56 49,72 52,88"
          stroke={skin.primaryColor}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Superhero Boots & Greaves (y=72 to y=88) */}
        {skin.emblem === 'super' ? (
          // Superman Crimson Boots
          <>
            <line x1="31" y1="72" x2="28" y2="88" stroke="#dc2626" strokeWidth="4.5" strokeLinecap="round" />
            <line x1="49" y1="72" x2="52" y2="88" stroke="#dc2626" strokeWidth="4.5" strokeLinecap="round" />
            <rect x="25" y="85" width="8" height="3.5" rx="1.5" fill="#b91c1c" />
            <rect x="49" y="85" width="8" height="3.5" rx="1.5" fill="#b91c1c" />
          </>
        ) : skin.emblem === 'flash' ? (
          // Flash Golden Lightning Boots
          <>
            <line x1="31" y1="72" x2="28" y2="88" stroke="#facc15" strokeWidth="4.5" strokeLinecap="round" />
            <line x1="49" y1="72" x2="52" y2="88" stroke="#facc15" strokeWidth="4.5" strokeLinecap="round" />
            {/* Winglets on boots */}
            <polygon points="26,82 23,80 26,84" fill="#facc15" />
            <polygon points="54,82 57,80 54,84" fill="#facc15" />
          </>
        ) : skin.emblem === 'wonder' ? (
          // Wonder Woman Red & Gold Greaves
          <>
            <line x1="31" y1="72" x2="28" y2="88" stroke="#dc2626" strokeWidth="4.5" strokeLinecap="round" />
            <line x1="49" y1="72" x2="52" y2="88" stroke="#dc2626" strokeWidth="4.5" strokeLinecap="round" />
            <line x1="31" y1="72" x2="29" y2="80" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" />
            <line x1="49" y1="72" x2="51" y2="80" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" />
          </>
        ) : skin.emblem === 'aquaman' ? (
          // Aquaman Deep Teal Finned Boots
          <>
            <line x1="31" y1="72" x2="28" y2="88" stroke="#0f766e" strokeWidth="4.5" strokeLinecap="round" />
            <line x1="49" y1="72" x2="52" y2="88" stroke="#0f766e" strokeWidth="4.5" strokeLinecap="round" />
            <polygon points="26,83 22,81 26,85" fill="#14b8a6" />
            <polygon points="54,83 58,81 54,85" fill="#14b8a6" />
          </>
        ) : (
          // Batman / Cyborg / Lantern / Justice Lord Boots
          <>
            <line x1="31" y1="74" x2="28" y2="88" stroke={skin.secondaryColor} strokeWidth="4.5" strokeLinecap="round" />
            <line x1="49" y1="74" x2="52" y2="88" stroke={skin.secondaryColor} strokeWidth="4.5" strokeLinecap="round" />
          </>
        )}

        {/* 3. Stick Figure Spine / Torso (40, 31) to (40, 56) */}
        <line x1="40" y1="31" x2="40" y2="56" stroke={skin.primaryColor} strokeWidth="3.5" strokeLinecap="round" />

        {/* Chest Armor Plate (fitted to stick torso) */}
        <path
          d="M 33 33 L 47 33 L 44 54 L 36 54 Z"
          fill={skin.primaryColor}
          stroke={skin.secondaryColor}
          strokeWidth="1.5"
        />

        {/* 4. Authentic Justice League Chest Emblems */}
        {skin.emblem === 'super' && (
          // Superman S-Shield (Red Diamond with Gold S)
          <g>
            <polygon points="40,36 45,39 43,47 37,47 35,39" fill="#facc15" stroke="#dc2626" strokeWidth="1" />
            <path d="M 42 39 Q 39 39 39 41 Q 41 42 41 44 Q 41 46 38 46" stroke="#dc2626" strokeWidth="1.4" fill="none" strokeLinecap="round" />
          </g>
        )}

        {skin.emblem === 'bat' && (
          // Batman Gold-rimmed Bat Insignia
          <g>
            <ellipse cx="40" cy="42" rx="5.5" ry="3.5" fill="#f59e0b" stroke="#0f172a" strokeWidth="0.8" />
            <path
              d="M 36.5 42 L 37.5 40.5 L 39 41.5 L 40 40 L 41 41.5 L 42.5 40.5 L 43.5 42 L 42 43.5 L 40 43 L 38 43.5 Z"
              fill="#0f172a"
            />
          </g>
        )}

        {skin.emblem === 'flash' && (
          // Flash Circular Badge with Lightning Bolt
          <g>
            <circle cx="40" cy="42" r="4.5" fill="#ffffff" stroke="#facc15" strokeWidth="1" />
            <polygon points="41,38 38,42 41,42 39,47 43,41 40,41" fill="#facc15" stroke="#ca8a04" strokeWidth="0.5" />
          </g>
        )}

        {skin.emblem === 'wonder' && (
          // Wonder Woman Golden Eagle / Double-W
          <g>
            <path
              d="M 35 39 L 38 45 L 40 41 L 42 45 L 45 39 L 43 39 L 41 43 L 40 41 L 39 43 L 37 39 Z"
              fill="#fbbf24"
              stroke="#b45309"
              strokeWidth="0.8"
            />
          </g>
        )}

        {skin.emblem === 'lantern' && (
          // Green Lantern Power Battery Insignia
          <g>
            <circle cx="40" cy="42" r="4.5" fill="#ffffff" stroke="#10b981" strokeWidth="1" />
            <circle cx="40" cy="42" r="2.8" stroke="#047857" strokeWidth="1" fill="none" />
            <line x1="36" y1="39.5" x2="44" y2="39.5" stroke="#047857" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="36" y1="44.5" x2="44" y2="44.5" stroke="#047857" strokeWidth="1.2" strokeLinecap="round" />
          </g>
        )}

        {skin.emblem === 'aquaman' && (
          // Aquaman Golden Scale Pattern & Atlantean A
          <g>
            <path d="M 36 38 Q 40 41 44 38" stroke="#fbbf24" strokeWidth="1" fill="none" />
            <path d="M 37 42 Q 40 45 43 42" stroke="#fbbf24" strokeWidth="1" fill="none" />
            <polygon points="40,39 43,46 41,46 40,43 39,46 37,46" fill="#fbbf24" stroke="#b45309" strokeWidth="0.6" />
          </g>
        )}

        {skin.emblem === 'cyborg' && (
          // Cyborg Cybernetic Reactor Core
          <g>
            <circle cx="40" cy="42" r="3.8" fill="#ef4444" stroke="#ffffff" strokeWidth="1" className="animate-pulse" />
            <circle cx="40" cy="42" r="1.5" fill="#ffffff" />
            <line x1="36" y1="42" x2="34" y2="42" stroke="#38bdf8" strokeWidth="1" />
            <line x1="44" y1="42" x2="46" y2="42" stroke="#38bdf8" strokeWidth="1" />
          </g>
        )}

        {skin.emblem === 'justice' && (
          // Cosmic Justice Sovereign Starburst Crest
          <g>
            <polygon points="40,37 42,41 46,42 42,43 40,47 38,43 34,42 38,41" fill="#fbbf24" stroke="#ffffff" strokeWidth="0.8" />
            <circle cx="40" cy="42" r="1.5" fill="#c084fc" />
          </g>
        )}

        {/* 5. Superhero Belt (at pelvis y=54 to y=57) */}
        <rect x="34" y="54" width="12" height="3" rx="1" fill={skin.secondaryColor} />
        {skin.emblem === 'wonder' && (
          // Golden Lasso of Truth coiled on hip
          <ellipse cx="33" cy="56" rx="2" ry="3.5" fill="none" stroke="#fbbf24" strokeWidth="1.2" />
        )}

        {/* 6. Stick Figure Arms & Gauntlets */}
        {/* Left Arm */}
        <line x1="40" y1="35" x2="25" y2="48" stroke={skin.primaryColor} strokeWidth="3" strokeLinecap="round" />
        {/* Right Arm */}
        <line x1="40" y1="35" x2="55" y2="48" stroke={skin.primaryColor} strokeWidth="3" strokeLinecap="round" />

        {/* Gauntlets / Wrist Accents */}
        {skin.emblem === 'bat' ? (
          // Bat Gauntlet Fins
          <>
            <polygon points="26,45 22,43 25,48" fill="#334155" />
            <polygon points="54,45 58,43 55,48" fill="#334155" />
          </>
        ) : skin.emblem === 'wonder' ? (
          // Silver Bracelets of Submission
          <>
            <rect x="23" y="45" width="4" height="4" rx="1" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.8" />
            <rect x="53" y="45" width="4" height="4" rx="1" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.8" />
          </>
        ) : skin.emblem === 'lantern' ? (
          // Green Lantern Power Ring Glowing on Hand!
          <>
            <circle cx="55" cy="48" r="3" fill="#10b981" stroke="#ffffff" strokeWidth="1" className="animate-ping" />
            <circle cx="55" cy="48" r="2.2" fill="#34d399" />
          </>
        ) : skin.emblem === 'cyborg' ? (
          // Cyber Cannon Gauntlet
          <>
            <rect x="51" y="44" width="6" height="5" rx="1" fill="#64748b" stroke="#ef4444" strokeWidth="0.8" />
            <line x1="56" y1="46.5" x2="60" y2="46.5" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" />
          </>
        ) : (
          // Standard Superhero Wrist Bands
          <>
            <circle cx="25" cy="48" r="2" fill={skin.secondaryColor} />
            <circle cx="55" cy="48" r="2" fill={skin.secondaryColor} />
          </>
        )}

        {/* 7. Head (cx=40, cy=22, r=9 - exact same top at y=13) */}
        <circle
          cx="40"
          cy="22"
          r="9"
          fill="#0f172a"
          stroke={skin.primaryColor}
          strokeWidth="2.8"
        />

        {/* Superhero Headgear / Masks / Cowls */}
        {skin.emblem === 'bat' && (
          // Batman Pointed Cowl Ears and White Eyes
          <>
            <polygon points="33,16 29,11 36,15" fill="#0f172a" stroke="#334155" strokeWidth="0.8" />
            <polygon points="47,16 51,11 44,15" fill="#0f172a" stroke="#334155" strokeWidth="0.8" />
            <line x1="36" y1="21" x2="39" y2="22" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="44" y1="22" x2="41" y2="21" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
          </>
        )}

        {skin.emblem === 'super' && (
          // Superman Heroic Forehead Hair Curl and Glowing Blue Eyes
          <>
            <path d="M 37 15 Q 40 13 41 16 Q 42 18 40 18" stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round" />
            <circle cx="43" cy="21" r="1.5" fill="#60a5fa" />
          </>
        )}

        {skin.emblem === 'flash' && (
          // Flash Cowl Golden Lightning Wings on Ears
          <>
            <polygon points="31,21 24,18 29,24" fill="#facc15" stroke="#ca8a04" strokeWidth="0.5" />
            <polygon points="49,21 56,18 51,24" fill="#facc15" stroke="#ca8a04" strokeWidth="0.5" />
            <line x1="37" y1="21" x2="40" y2="21" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="43" y1="21" x2="46" y2="21" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
          </>
        )}

        {skin.emblem === 'wonder' && (
          // Wonder Woman Amazon Golden Tiara with Ruby Star
          <>
            <path d="M 32 20 Q 40 16 48 20" stroke="#fbbf24" strokeWidth="2.4" fill="none" />
            <polygon points="40,15 41,17 43,17 41.5,18 42,20 40,19 38,20 38.5,18 37,17 39,17" fill="#ef4444" />
            <circle cx="43" cy="22" r="1.4" fill="#ffffff" />
          </>
        )}

        {skin.emblem === 'lantern' && (
          // Green Lantern Domino Mask
          <>
            <path d="M 34 21 Q 40 19 46 21 Q 40 23 34 21 Z" fill="#047857" stroke="#10b981" strokeWidth="0.8" />
            <circle cx="38" cy="21" r="1.2" fill="#ffffff" />
            <circle cx="42" cy="21" r="1.2" fill="#ffffff" />
          </>
        )}

        {skin.emblem === 'aquaman' && (
          // Aquaman Golden Circlet Crown
          <>
            <path d="M 33 18 L 36 15 L 40 17 L 44 15 L 47 18" stroke="#fbbf24" strokeWidth="1.6" fill="none" />
            <circle cx="43" cy="21" r="1.4" fill="#2dd4bf" />
          </>
        )}

        {skin.emblem === 'cyborg' && (
          // Cyborg Titanium Half-face with Red Optic
          <>
            <path d="M 33 18 Q 36 14 40 14 L 40 28 L 33 26 Z" fill="#64748b" stroke="#94a3b8" strokeWidth="0.8" />
            <circle cx="37" cy="21" r="2.2" fill="#ef4444" stroke="#ffffff" strokeWidth="0.8" className="animate-pulse" />
            <circle cx="43" cy="21" r="1.2" fill="#ffffff" />
          </>
        )}

        {skin.emblem === 'justice' && (
          // Cosmic Justice Sovereign Imperial Crown
          <>
            <polygon points="36,15 40,12 44,15 40,14" fill="#fbbf24" stroke="#d97706" strokeWidth="0.8" />
            <circle cx="40" cy="21" r="2" fill="#c084fc" className="animate-pulse" />
          </>
        )}
      </svg>
    </div>
  );
};

const ShoesGraphic: React.FC = () => {
  return (
    <div className="relative flex items-center justify-center">
      {/* Animated Spectral Rainbow Aura */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-amber-400 via-emerald-400 via-cyan-400 to-purple-500 rounded-full blur-2xl opacity-50 animate-pulse" />
      <svg width="120" height="75" viewBox="0 0 120 75" fill="none" className="relative z-10 drop-shadow-[0_0_20px_#a855f7]">
        <defs>
          <linearGradient id="rainbowGrad" x1="0" y1="0" x2="100%" y2="0">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="25%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#10b981" />
            <stop offset="75%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
          <linearGradient id="soleGlow" x1="0" y1="0" x2="100%" y2="0">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>
        </defs>

        {/* Sneaker Upper Body */}
        <path
          d="M 20 48 L 40 22 L 64 22 L 68 34 L 98 42 L 104 54 L 18 54 Z"
          fill="#0f172a"
          stroke="url(#rainbowGrad)"
          strokeWidth="3"
        />

        {/* Dynamic Rainbow Side Chevrons */}
        <path d="M 44 26 L 38 48 L 54 48 L 60 26 Z" fill="url(#rainbowGrad)" opacity="0.9" />
        <path d="M 64 36 L 58 48 L 74 48 L 80 38 Z" fill="url(#rainbowGrad)" opacity="0.9" />

        {/* Glowing Laces */}
        <line x1="48" y1="28" x2="56" y2="34" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="54" y1="34" x2="62" y2="40" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="60" y1="40" x2="68" y2="46" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />

        {/* RGB Air Bubble Midsole */}
        <rect x="16" y="54" width="88" height="7" rx="3.5" fill="url(#rainbowGrad)" />

        {/* White Glowing Tread Sole */}
        <rect x="14" y="61" width="92" height="5" rx="2.5" fill="url(#soleGlow)" />

        {/* Trailing Rainbow Sparkle Trail */}
        <circle cx="10" cy="50" r="2.5" fill="#38bdf8" className="animate-ping" />
        <circle cx="6" cy="38" r="2" fill="#ec4899" className="animate-ping" />
        <circle cx="14" cy="28" r="2" fill="#fbbf24" className="animate-ping" />
      </svg>
    </div>
  );
};

const WeaponSkinGraphic: React.FC<{ skin: ShopWeaponSkin }> = ({ skin }) => {
  const isRainbow = skin.glowColor === 'rainbow' || skin.effect === 'rainbow';
  return (
    <div className="relative flex items-center justify-center p-2">
      {/* Radiant Glowing Halo */}
      <div
        className="absolute inset-0 rounded-full blur-xl opacity-45 animate-pulse"
        style={{
          backgroundColor: isRainbow ? '#a855f7' : skin.glowColor,
        }}
      />
      <svg width="84" height="60" viewBox="0 0 100 70" fill="none" className="relative z-10 drop-shadow-md">
        {skin.weaponType === 'axe' ? (
          <>
            {/* Axe Haft */}
            <line x1="20" y1="58" x2="68" y2="16" stroke={skin.primaryColor} strokeWidth="5.5" strokeLinecap="round" />
            <line x1="20" y1="58" x2="68" y2="16" stroke="#ffffff" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
            {/* Axe Collar */}
            <rect x="52" y="24" width="7" height="12" rx="2" fill={skin.secondaryColor} stroke={skin.glowColor} strokeWidth="1.2" transform="rotate(-40 52 24)" />
            {/* Crescent Blade */}
            <path
              d="M 56 12 Q 86 6 82 32 Q 68 36 60 22 Z"
              fill={skin.bladeColor || skin.glowColor}
              stroke={skin.glowColor}
              strokeWidth="2.5"
            />
            {/* Blade Energy Core */}
            <circle cx="70" cy="22" r="3.5" fill="#ffffff" stroke={skin.secondaryColor} strokeWidth="1" />
          </>
        ) : skin.weaponType === 'sword' ? (
          <>
            {/* Hilt */}
            <line x1="16" y1="54" x2="32" y2="42" stroke={skin.primaryColor} strokeWidth="5" strokeLinecap="round" />
            {/* Crossguard */}
            <line x1="25" y1="36" x2="39" y2="52" stroke={skin.secondaryColor} strokeWidth="4" strokeLinecap="round" />
            {/* Radiant Blade */}
            <line x1="30" y1="44" x2="84" y2="14" stroke={skin.bladeColor || skin.glowColor} strokeWidth="5" strokeLinecap="round" />
            <line x1="33" y1="42" x2="80" y2="16" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
            {/* Star sparkle at tip */}
            <circle cx="84" cy="14" r="2.5" fill="#ffffff" className="animate-ping" />
          </>
        ) : skin.weaponType === 'gun' ? (
          <>
            {/* Blaster Handle */}
            <path d="M 28 48 L 36 34 L 46 34 L 38 48 Z" fill={skin.secondaryColor} stroke={skin.primaryColor} strokeWidth="1.5" />
            {/* Blaster Receiver & Barrel */}
            <rect x="30" y="22" width="46" height="15" rx="3" fill={skin.primaryColor} stroke={skin.secondaryColor} strokeWidth="2" />
            <rect x="42" y="25" width="20" height="9" rx="2" fill={skin.secondaryColor} />
            {/* Glowing Laser Muzzle & Beam */}
            <rect x="74" y="25" width="8" height="9" rx="1.5" fill={skin.bladeColor || skin.glowColor} />
            <line x1="84" y1="29.5" x2="94" y2="29.5" stroke={skin.glowColor} strokeWidth="3" strokeLinecap="round" />
          </>
        ) : skin.weaponType === 'rocket' ? (
          <>
            {/* Heavy Launcher Tube */}
            <rect x="18" y="24" width="58" height="18" rx="4" fill={skin.primaryColor} stroke={skin.secondaryColor} strokeWidth="2.5" />
            <line x1="28" y1="24" x2="28" y2="42" stroke={skin.glowColor} strokeWidth="2" />
            <line x1="60" y1="24" x2="60" y2="42" stroke={skin.glowColor} strokeWidth="2" />
            {/* Warhead */}
            <polygon points="76,22 92,33 76,44" fill={skin.secondaryColor} stroke={skin.glowColor} strokeWidth="1.5" />
            <circle cx="82" cy="33" r="3" fill="#ffffff" />
          </>
        ) : skin.weaponType === 'rope' ? (
          <>
            {/* Coiled Spool */}
            <circle cx="35" cy="35" r="14" fill={skin.primaryColor} stroke={skin.secondaryColor} strokeWidth="3" />
            <circle cx="35" cy="35" r="7" fill={skin.glowColor} />
            {/* Luminous Line & Hook */}
            <path d="M 46 30 Q 64 25 72 38" stroke={skin.secondaryColor} strokeWidth="2.5" strokeDasharray="3 2" fill="none" />
            <path d="M 72 38 L 84 28 L 86 36 L 76 44 Z" fill={skin.bladeColor || skin.glowColor} stroke="#ffffff" strokeWidth="1.5" />
          </>
        ) : skin.weaponType === 'magnet' ? (
          <>
            {/* Horseshoe Magnet Core */}
            <path d="M 28 20 C 28 46 72 46 72 20" stroke={skin.primaryColor} strokeWidth="8" strokeLinecap="round" fill="none" />
            <rect x="23" y="16" width="10" height="8" rx="2" fill={skin.secondaryColor} stroke={skin.glowColor} strokeWidth="1.5" />
            <rect x="67" y="16" width="10" height="8" rx="2" fill={skin.glowColor} stroke="#ffffff" strokeWidth="1.5" />
            {/* Pulse Wave */}
            <path d="M 36 14 Q 50 8 64 14" stroke={skin.glowColor} strokeWidth="2" strokeDasharray="2 2" fill="none" />
          </>
        ) : (
          <>
            {/* Supreme God Weapon: Rainbow Infinity Cross */}
            <path d="M 32 35 C 32 24 45 24 50 35 C 55 46 68 46 68 35 C 68 24 55 24 50 35 C 45 46 32 46 32 35 Z" stroke="url(#rainbowGrad)" strokeWidth="4.5" fill="none" />
            <circle cx="50" cy="35" r="4.5" fill="#ffffff" className="animate-ping" />
            <line x1="20" y1="20" x2="80" y2="50" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
            <line x1="20" y1="50" x2="80" y2="20" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
          </>
        )}
      </svg>
    </div>
  );
};

/* ========================================================================= */
/* MAIN SHOP MODAL COMPONENT                                                 */
/* ========================================================================= */

export const ShopModal: React.FC<ShopModalProps> = ({
  isOpen,
  onClose,
  wallet,
  onUpdateWallet,
  playerConfigs,
  onUpdatePlayerConfig,
}) => {
  const [activeTab, setActiveTab] = useState<'hats' | 'skins' | 'shoes' | 'weapons'>('hats');
  const [selectedPlayerId, setSelectedPlayerId] = useState<PlayerId>(1);
  const [showHeightCompare, setShowHeightCompare] = useState<boolean>(false);
  const [weaponFilter, setWeaponFilter] = useState<string>('all');
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(
    null
  );

  if (!isOpen) return null;

  const showFeedback = (text: string, type: 'success' | 'error') => {
    setFeedbackMsg({ text, type });
    setTimeout(() => setFeedbackMsg(null), 3200);
  };

  const targetPlayer = playerConfigs.find((p) => p.id === selectedPlayerId) || playerConfigs[0];

  const handleClaimFreeYoutubeRecharge = () => {
    // Open YouTube channel in new tab safely
    window.open('https://www.youtube.com/@The-Night-Nix/videos', '_blank', 'noopener,noreferrer');

    // Grant free balance bonus
    const result = claimYoutubeRecharge();
    onUpdateWallet(result.newWallet);
    sounds.playPowerUp();
    showFeedback('تم شحن رصيد مجاني بنجاح (+1000 نقود و +100 جوهرة)! تفضل بمشاهدة فيديوهات الأكواد على القناة!', 'success');
  };

  // ================= PURCHASE / EQUIP HANDLERS =================
  const handleBuyHat = (hat: ShopHat) => {
    if (hat.currency === 'coins') {
      if (wallet.coins < hat.price) {
        showFeedback('عذراً! لا تملك ما يكفي من النقود الذهبية.', 'error');
        return;
      }
      const updated: PlayerWallet = {
        ...wallet,
        coins: wallet.coins - hat.price,
        purchasedHats: [...wallet.purchasedHats, hat.id],
        equippedHat: targetPlayer.id === 1 ? hat.id : wallet.equippedHat,
      };
      onUpdateWallet(updated);
      saveWallet(updated);
      onUpdatePlayerConfig(targetPlayer.id, { equippedHat: hat.id });
      sounds.playPowerUp();
      showFeedback(`تم شراء ${hat.nameAr} وتجهيزها لـ ${targetPlayer.name}!`, 'success');
    } else {
      if (wallet.gems < hat.price) {
        showFeedback('عذراً! لا تملك ما يكفي من الجواهر.', 'error');
        return;
      }
      const updated: PlayerWallet = {
        ...wallet,
        gems: wallet.gems - hat.price,
        purchasedHats: [...wallet.purchasedHats, hat.id],
        equippedHat: targetPlayer.id === 1 ? hat.id : wallet.equippedHat,
      };
      onUpdateWallet(updated);
      saveWallet(updated);
      onUpdatePlayerConfig(targetPlayer.id, { equippedHat: hat.id });
      sounds.playPowerUp();
      showFeedback(`تم شراء التاج الأسطوري وتجهيزه لـ ${targetPlayer.name}!`, 'success');
    }
  };

  const handleEquipHat = (hatId: string | null) => {
    const updated: PlayerWallet = {
      ...wallet,
      equippedHat: targetPlayer.id === 1 ? hatId : wallet.equippedHat,
    };
    onUpdateWallet(updated);
    saveWallet(updated);
    onUpdatePlayerConfig(targetPlayer.id, { equippedHat: hatId });
    sounds.playButton();
    showFeedback(hatId ? `تم ارتداء القبعة لـ ${targetPlayer.name}` : `تم خلع القبعة من ${targetPlayer.name}`, 'success');
  };

  const handleBuySkin = (skin: ShopSkin) => {
    if (wallet.gems < skin.price) {
      showFeedback('عذراً! لا تملك ما يكفي من الجواهر لشراء هذا السكين.', 'error');
      return;
    }
    const updated: PlayerWallet = {
      ...wallet,
      gems: wallet.gems - skin.price,
      purchasedSkins: [...wallet.purchasedSkins, skin.id],
      equippedSkin: targetPlayer.id === 1 ? skin.id : wallet.equippedSkin,
    };
    onUpdateWallet(updated);
    saveWallet(updated);
    onUpdatePlayerConfig(targetPlayer.id, { equippedSkin: skin.id });
    sounds.playPowerUp();
    showFeedback(`تم شراء سكين ${skin.nameAr} وتجهيزه لـ ${targetPlayer.name}!`, 'success');
  };

  const handleEquipSkin = (skinId: string | null) => {
    const updated: PlayerWallet = {
      ...wallet,
      equippedSkin: targetPlayer.id === 1 ? skinId : wallet.equippedSkin,
    };
    onUpdateWallet(updated);
    saveWallet(updated);
    onUpdatePlayerConfig(targetPlayer.id, { equippedSkin: skinId });
    sounds.playButton();
    showFeedback(skinId ? `تم تجهيز السكين لـ ${targetPlayer.name}` : `تم خلع السكين من ${targetPlayer.name}`, 'success');
  };

  const handleBuyShoes = (shoe: ShopShoes) => {
    if (wallet.gems < shoe.price) {
      showFeedback(`عذراً! حذاء الأطياف الأسطوري يتطلب 1000 جوهرة. رصيدك الحالي: ${wallet.gems} جوهرة`, 'error');
      return;
    }
    const updated: PlayerWallet = {
      ...wallet,
      gems: wallet.gems - shoe.price,
      purchasedShoes: [...wallet.purchasedShoes, shoe.id],
      equippedShoes: targetPlayer.id === 1 ? shoe.id : wallet.equippedShoes,
    };
    onUpdateWallet(updated);
    saveWallet(updated);
    onUpdatePlayerConfig(targetPlayer.id, { equippedShoes: shoe.id });
    sounds.playPowerUp();
    showFeedback(`مبروك! تم شراء حذاء الأطياف وتجهيزه لـ ${targetPlayer.name}!`, 'success');
  };

  const handleEquipShoes = (shoeId: string | null) => {
    const updated: PlayerWallet = {
      ...wallet,
      equippedShoes: targetPlayer.id === 1 ? shoeId : wallet.equippedShoes,
    };
    onUpdateWallet(updated);
    saveWallet(updated);
    onUpdatePlayerConfig(targetPlayer.id, { equippedShoes: shoeId });
    sounds.playButton();
    showFeedback(shoeId ? `تم ارتداء الحذاء لـ ${targetPlayer.name}` : `تم خلع الحذاء من ${targetPlayer.name}`, 'success');
  };

  const handleBuyWeaponSkin = (skin: ShopWeaponSkin) => {
    if (wallet.gems < skin.price) {
      showFeedback(`عذراً! يتطلب هذا السلاح ${skin.price} جوهرة. رصيدك الحالي: ${wallet.gems} جوهرة.`, 'error');
      return;
    }
    const updated: PlayerWallet = {
      ...wallet,
      gems: wallet.gems - skin.price,
      purchasedWeaponSkins: [...(wallet.purchasedWeaponSkins || []), skin.id],
      equippedWeaponSkin: targetPlayer.id === 1 ? skin.id : wallet.equippedWeaponSkin,
    };
    onUpdateWallet(updated);
    saveWallet(updated);
    onUpdatePlayerConfig(targetPlayer.id, { equippedWeaponSkin: skin.id });
    sounds.playPowerUp();
    showFeedback(`مبروك! تم شراء ${skin.nameAr} وتجهيزه لـ ${targetPlayer.name}!`, 'success');
  };

  const handleEquipWeaponSkin = (skinId: string | null) => {
    const updated: PlayerWallet = {
      ...wallet,
      equippedWeaponSkin: targetPlayer.id === 1 ? skinId : wallet.equippedWeaponSkin,
    };
    onUpdateWallet(updated);
    saveWallet(updated);
    onUpdatePlayerConfig(targetPlayer.id, { equippedWeaponSkin: skinId });
    sounds.playButton();
    showFeedback(skinId ? `تم تجهيز سلاح النيون لـ ${targetPlayer.name}` : `تم خلع سكين السلاح من ${targetPlayer.name}`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/90 backdrop-blur-xl select-none animate-fade-in">
      <div className="relative w-full max-w-5xl h-[92vh] max-h-[860px] bg-slate-900 border border-slate-800 rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden">
        {/* ============================================================== */}
        {/* HEADER: TITLE, WALLET (COINS & GEMS) AND CLOSE                 */}
        {/* ============================================================== */}
        <div className="shrink-0 px-6 py-4 border-b border-slate-800 bg-slate-950/85 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-amber-500/20 via-sky-500/10 to-purple-500/20 border border-amber-500/30 text-amber-400 shadow-md">
              <ShoppingBag className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide uppercase">
                  متجر ستيك أرينا (SHOP)
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  COSMETICS
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                اربح <span className="text-amber-300 font-bold">50 نقود</span> و <span className="text-cyan-300 font-bold">1 جوهرة</span> تلقائياً بعد كل جولة تلعبها!
              </p>
            </div>
          </div>

          {/* Wallet Balances + Close Button */}
          <div className="flex items-center gap-3">
            {/* Gold Coins Badge */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-300 font-mono shadow-sm">
              <Coins className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-sm font-black tracking-wide">{wallet.coins}</span>
              <span className="text-[10px] font-sans text-amber-400/80">نقود</span>
            </div>

            {/* Gems Badge */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 font-mono shadow-sm">
              <Gem className="w-4 h-4 text-cyan-400 fill-cyan-400 animate-pulse" />
              <span className="text-sm font-black tracking-wide">{wallet.gems}</span>
              <span className="text-[10px] font-sans text-cyan-400/80">جواهر</span>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="إغلاق المتجر"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feedback Alert Bar */}
        {feedbackMsg && (
          <div
            className={`px-6 py-2 text-xs font-bold text-center border-b transition-all ${
              feedbackMsg.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-300'
                : 'bg-rose-950/90 border-rose-500/50 text-rose-300'
            }`}
          >
            {feedbackMsg.text}
          </div>
        )}

        {/* FREE BALANCE RECHARGE VIA YOUTUBE PROMO BANNER */}
        <div className="shrink-0 px-6 py-2.5 bg-gradient-to-r from-red-950/80 via-slate-900 to-amber-950/80 border-b border-red-500/40 flex flex-col md:flex-row items-center justify-between gap-3 shadow-inner">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-red-600/50 animate-pulse">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-black text-white">
                  اشحن رصيد مجاني عبر الدخول الى رابط قناتي على اليوتيوب
                </span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse flex items-center gap-1">
                  <StickmanGift className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span>هدية مجانية</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                ادخل إلى القناة لمشاهدة فيديوهات لأكواد مجانية إضافية واحصل فوراً على <span className="text-amber-300 font-bold">+1000 نقود</span> و <span className="text-cyan-300 font-bold">+100 جوهرة</span>!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
            <button
              onClick={handleClaimFreeYoutubeRecharge}
              className="flex-1 md:flex-initial px-4 py-2.5 bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-xs rounded-xl shadow-lg shadow-red-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
            >
              <Gift className="w-4 h-4" />
              <span>اشحن رصيد مجاني الآن</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
            <a
              href="https://www.youtube.com/@The-Night-Nix/videos"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
              title="زيارة القناة مباشرة"
            >
              <span>زيارة القناة</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>
        </div>

        {/* ============================================================== */}
        {/* PLAYER SELECTOR BAR: PLAYER 1 (HUMAN) & PLAYERS 2-6 (BOTS)     */}
        {/* ============================================================== */}
        <div className="shrink-0 px-6 py-2.5 bg-slate-950/95 border-b border-slate-800 flex flex-col md:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-white">تجهيز المقاتل:</span>
            <span className="text-[11px] text-slate-400">
              اختر اللاعب أو البوت من 1 إلى 6 لإلباسه وتجهيزه بالثياب والأسلحة:
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 md:pb-0">
            {playerConfigs.map((p) => {
              const isSelected = p.id === selectedPlayerId;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedPlayerId(p.id);
                    sounds.playButton();
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-slate-800 border-sky-400 text-white shadow-md ring-1 ring-sky-400/50'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: p.color, boxShadow: `0 0 6px ${p.glowColor}` }}
                  />
                  <span>P{p.id}: {p.name}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono ${
                      p.type === 'human'
                        ? 'bg-cyan-500/20 text-cyan-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {p.type === 'human' ? 'لاعب' : 'بوت'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ============================================================== */}
        {/* TABS SELECTOR (HATS, FULL SKINS, SHOES, WEAPON SKINS)          */}
        {/* ============================================================== */}
        <div className="shrink-0 px-6 pt-3 pb-2 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveTab('hats')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black tracking-wide transition-all cursor-pointer ${
                activeTab === 'hats'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-md shadow-amber-500/25'
                  : 'bg-slate-800/70 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Crown className="w-4 h-4" />
              <span>1. القبعات</span>
            </button>

            <button
              onClick={() => setActiveTab('skins')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black tracking-wide transition-all cursor-pointer ${
                activeTab === 'skins'
                  ? 'bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-md shadow-sky-500/25'
                  : 'bg-slate-800/70 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Shirt className="w-4 h-4" />
              <span>2. السكينات الكاملة</span>
            </button>

            <button
              onClick={() => setActiveTab('shoes')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black tracking-wide transition-all cursor-pointer ${
                activeTab === 'shoes'
                  ? 'bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 text-white shadow-md shadow-fuchsia-500/25'
                  : 'bg-slate-800/70 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Footprints className="w-4 h-4" />
              <span>3. الأحذية النادرة (RGB)</span>
            </button>

            <button
              onClick={() => setActiveTab('weapons')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black tracking-wide transition-all cursor-pointer ${
                activeTab === 'weapons'
                  ? 'bg-gradient-to-r from-rose-500 via-purple-500 to-amber-500 text-white shadow-md shadow-rose-500/25'
                  : 'bg-slate-800/70 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Swords className="w-4 h-4" />
              <span>4. سكينات الأسلحة المضيئة</span>
              <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded-full">
                جديد
              </span>
            </button>
          </div>

          <div className="text-[11px] text-slate-400 hidden lg:flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-sky-400" />
            <span>
              تجهيز حالي لـ: <span className="text-white font-bold">{targetPlayer.name} ({targetPlayer.type === 'human' ? 'لاعب' : 'بوت'})</span>
            </span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* MAIN BODY: ITEMS GRID + SCROLLABLE CONTAINER                   */}
        {/* ============================================================== */}
        <div className="custom-scrollbar overflow-y-auto flex-1 p-6 flex flex-col gap-6">
          {/* ================= TAB 1: HATS SECTION ================= */}
          {activeTab === 'hats' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <span>قسم القبعات (Hats Section)</span>
                    <span className="text-[10px] bg-slate-800 text-amber-400 font-bold px-2 py-0.5 rounded-full">
                      7 بالنقود · الثامنة بـ 50 جوهرة متوهجة
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    قبعات حقيقية مرسومة تزيّن رأس بطلك في ساحة المعركة.
                  </p>
                </div>

                {wallet.equippedHat && (
                  <button
                    onClick={() => handleEquipHat(null)}
                    className="text-xs text-rose-400 hover:text-rose-300 underline font-semibold cursor-pointer"
                  >
                    خلع القبعة الحالية
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {HATS.map((hat) => {
                  const isOwned = wallet.purchasedHats.includes(hat.id);
                  const isEquipped = wallet.equippedHat === hat.id;
                  const canAfford =
                    hat.currency === 'coins' ? wallet.coins >= hat.price : wallet.gems >= hat.price;

                  return (
                    <div
                      key={hat.id}
                      className={`relative rounded-2xl p-4 flex flex-col justify-between transition-all border ${
                        hat.isSpecial
                          ? 'bg-gradient-to-b from-amber-950/40 via-slate-900 to-amber-950/20 border-amber-400 ring-2 ring-amber-400/40 shadow-xl shadow-amber-950/60'
                          : isEquipped
                          ? 'bg-slate-900 border-sky-400 ring-1 ring-sky-400/40 shadow-md'
                          : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      {/* Special Glowing Ribbon for 8th Hat */}
                      {hat.isSpecial && (
                        <div className="absolute -top-2.5 right-3 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-md animate-pulse">
                          تاج أسطوري متوهج (50 جوهرة)
                        </div>
                      )}

                      {/* Hat Visual Vector Illustration (REAL GRAPHIC, NO EMOJI) */}
                      <div className="flex flex-col items-center justify-center py-3">
                        <div
                          className={`w-20 h-20 rounded-2xl flex items-center justify-center relative p-2 ${
                            hat.isSpecial
                              ? 'bg-amber-500/15 border border-amber-400/50 shadow-inner'
                              : 'bg-slate-800/60 border border-slate-700/80 shadow-inner'
                          }`}
                        >
                          <HatGraphic hatId={hat.id} isSpecial={hat.isSpecial} />
                        </div>
                        <h4 className="text-xs font-bold text-white mt-3 text-center">{hat.nameAr}</h4>
                        <span className="text-[10px] font-mono text-slate-400">{hat.name}</span>
                        <p className="text-[11px] text-slate-400 text-center mt-1.5 leading-relaxed line-clamp-2">
                          {hat.description}
                        </p>
                      </div>

                      {/* Price & Action Button */}
                      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 mt-auto">
                        <div className="flex items-center gap-1 font-mono font-bold text-xs">
                          {hat.currency === 'coins' ? (
                            <>
                              <Coins className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                              <span className="text-amber-300">{hat.price} نقود</span>
                            </>
                          ) : (
                            <>
                              <Gem className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400 animate-pulse" />
                              <span className="text-cyan-300">{hat.price} جوهرة</span>
                            </>
                          )}
                        </div>

                        {isEquipped ? (
                          <span className="flex items-center gap-1 px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-bold">
                            <Check className="w-3 h-3" />
                            <span>مُرتدى</span>
                          </span>
                        ) : isOwned ? (
                          <button
                            onClick={() => handleEquipHat(hat.id)}
                            className="px-3.5 py-1 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm"
                          >
                            ارتداء
                          </button>
                        ) : (
                          <button
                            onClick={() => handleBuyHat(hat)}
                            disabled={!canAfford}
                            className={`px-3 py-1 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md ${
                              hat.isSpecial
                                ? 'bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 text-slate-950 disabled:opacity-40'
                                : 'bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-40'
                            }`}
                          >
                            {canAfford ? 'شراء' : 'رصيد غير كافٍ'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================= TAB 2: FULL SKINS SECTION ================= */}
          {activeTab === 'skins' && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <span>سكينات أبطال عصبة العدالة الفخمة (Justice League Heroes)</span>
                    <span className="text-[10px] bg-blue-500/20 text-blue-300 font-bold px-2 py-0.5 rounded-full border border-blue-500/30">
                      بنفس طول الشخصية دون سكين 100%
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    سكينات فخمة بتصميم عصري وأصيل لأبطال العدالة مع العباءات والشعارات وبنفس أبعاد وارتفاع الشخصية الأصلية تماماً.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowHeightCompare((prev) => !prev)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      showHeightCompare
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                        : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
                    }`}
                    title="مقارنة الطول مع الشخصية بدون سكين"
                  >
                    {showHeightCompare ? (
                      '✓ عرض مقارنة الطول نشط'
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <StickmanRuler className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span>مقارنة الطول مع الأصل</span>
                      </span>
                    )}
                  </button>

                  {wallet.equippedSkin && (
                    <button
                      onClick={() => handleEquipSkin(null)}
                      className="text-xs text-rose-400 hover:text-rose-300 underline font-semibold cursor-pointer"
                    >
                      خلع السكين
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {SKINS.map((skin) => {
                  const isOwned = wallet.purchasedSkins.includes(skin.id);
                  const isEquipped = wallet.equippedSkin === skin.id;
                  const canAfford = wallet.gems >= skin.price;

                  return (
                    <div
                      key={skin.id}
                      className={`relative rounded-2xl p-4 flex flex-col justify-between transition-all border ${
                        isEquipped
                          ? 'bg-slate-900 border-sky-400 ring-2 ring-sky-400/40 shadow-lg'
                          : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        عصبة العدالة
                      </div>

                      {/* Real Graphical Skin Avatar Preview (NO EMOJI) */}
                      <div className="flex flex-col items-center justify-center py-2">
                        <div
                          className={`rounded-2xl flex items-center justify-center relative p-1.5 border shadow-inner transition-all ${
                            showHeightCompare ? 'w-36 h-24 gap-1' : 'w-20 h-24'
                          }`}
                          style={{
                            backgroundColor: `${skin.primaryColor}20`,
                            borderColor: skin.glowColor,
                            boxShadow: `0 0 15px ${skin.glowColor}30`,
                          }}
                        >
                          {showHeightCompare ? (
                            <div className="flex items-center justify-center gap-2">
                              <div className="flex flex-col items-center">
                                <span className="text-[8px] font-mono text-slate-400 mb-[-2px]">السكين</span>
                                <SkinGraphic skin={skin} />
                              </div>
                              <div className="h-16 w-[1px] bg-slate-700/60" />
                              <div className="flex flex-col items-center">
                                <span className="text-[8px] font-mono text-cyan-400 mb-[-2px]">دون سكين</span>
                                <BaseStickmanGraphic color="#38bdf8" />
                              </div>
                            </div>
                          ) : (
                            <SkinGraphic skin={skin} />
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-white mt-3 text-center">{skin.nameAr}</h4>
                        <span className="text-[10px] font-mono text-slate-400">{skin.name}</span>
                        <p className="text-[11px] text-slate-400 text-center mt-1.5 leading-relaxed line-clamp-2">
                          {skin.description}
                        </p>
                      </div>

                      {/* Price & Action Button */}
                      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 mt-auto">
                        <div className="flex items-center gap-1.5 font-mono font-bold text-xs text-cyan-300">
                          <Gem className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
                          <span>{skin.price} جوهرة</span>
                        </div>

                        {isEquipped ? (
                          <span className="flex items-center gap-1 px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-bold">
                            <Check className="w-3 h-3" />
                            <span>مُرتدى</span>
                          </span>
                        ) : isOwned ? (
                          <button
                            onClick={() => handleEquipSkin(skin.id)}
                            className="px-3.5 py-1 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm"
                          >
                            ارتداء
                          </button>
                        ) : (
                          <button
                            onClick={() => handleBuySkin(skin)}
                            disabled={!canAfford}
                            className="px-3.5 py-1 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 text-white font-bold text-xs rounded-xl disabled:opacity-40 transition-all cursor-pointer shadow-md"
                          >
                            {canAfford ? 'شراء' : 'رصيد غير كافٍ'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================= TAB 3: SHOES SECTION (1000 GEMS RGB) ================= */}
          {activeTab === 'shoes' && (
            <div className="max-w-2xl mx-auto w-full my-auto py-4">
              <div className="text-center mb-6">
                <span className="text-xs font-black uppercase tracking-widest text-fuchsia-400 px-3 py-1 rounded-full bg-fuchsia-950/60 border border-fuchsia-500/30">
                  القسم الأسطوري النادر (1000 جوهرة)
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-2">
                  حذاء الأطياف المتوهج الأسطوري (Chroma Prism RGB)
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                  حذاء واحد استثنائي نادر يشع ألواناً متتالية ويتغير لونه باستمرار عبر أطياف قوس قزح في كل ثانية!
                </p>
              </div>

              {SHOES.map((shoe) => {
                const isOwned = wallet.purchasedShoes.includes(shoe.id);
                const isEquipped = wallet.equippedShoes === shoe.id;
                const canAfford = wallet.gems >= shoe.price;

                return (
                  <div
                    key={shoe.id}
                    className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-2 border-fuchsia-500/60 shadow-[0_0_50px_rgba(217,70,239,0.25)] flex flex-col items-center text-center gap-6"
                  >
                    {/* Real Graphical Sneaker Illustration (NO EMOJI) */}
                    <div className="py-2">
                      <ShoesGraphic />
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-300 via-emerald-400 via-cyan-400 to-purple-400 animate-pulse">
                        {shoe.nameAr}
                      </h4>
                      <p className="text-xs text-slate-300 max-w-md leading-relaxed">
                        {shoe.description}
                      </p>
                    </div>

                    {/* Features list */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full text-xs text-slate-300">
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-red-500 to-blue-500 animate-ping" />
                        <span>تغير لوني مستمر RGB</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                        <span>شرارات ملونة خلف الأقدام</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                        <span>مظهر أسطوري فريد باللعبة</span>
                      </div>
                    </div>

                    {/* Price and Action */}
                    <div className="w-full pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-2 text-cyan-300 font-mono font-black text-lg">
                        <Gem className="w-6 h-6 text-cyan-400 fill-cyan-400 animate-pulse" />
                        <span>{shoe.price} جوهرة</span>
                        <span className="text-xs text-slate-400 font-sans font-normal">
                          (رصيدك: {wallet.gems} جوهرة)
                        </span>
                      </div>

                      {isEquipped ? (
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1.5 px-6 py-2.5 bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 rounded-2xl font-black text-sm">
                            <Check className="w-4 h-4" />
                            <span>مُرتدى حالياً في المعارك</span>
                          </span>
                          <button
                            onClick={() => handleEquipShoes(null)}
                            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
                          >
                            خلع
                          </button>
                        </div>
                      ) : isOwned ? (
                        <button
                          onClick={() => handleEquipShoes(shoe.id)}
                          className="px-8 py-3 bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-400 text-white font-black text-sm rounded-2xl shadow-lg shadow-fuchsia-500/30 transition-all cursor-pointer"
                        >
                          ارتداء الحذاء الأسطوري
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBuyShoes(shoe)}
                          disabled={!canAfford}
                          className="px-8 py-3 bg-gradient-to-r from-fuchsia-500 via-purple-600 to-cyan-500 hover:scale-105 text-white font-black text-sm rounded-2xl shadow-xl shadow-fuchsia-500/30 disabled:opacity-40 disabled:hover:scale-100 transition-all cursor-pointer"
                        >
                          {canAfford ? 'شراء الحذاء الأسطوري (1000 جوهرة)' : 'رصيد غير كافٍ (1000 جوهرة مطلوبة)'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
