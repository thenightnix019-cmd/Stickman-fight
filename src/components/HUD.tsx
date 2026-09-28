import React, { useState, useEffect } from 'react';
import {
  PlayerState,
  PlayerConfig,
  GameMode,
  ActiveEvent,
} from '../types/game';
import { PlayerWallet } from '../types/shop';
import {
  Volume2,
  VolumeX,
  Music,
  Maximize,
  Minimize,
  HelpCircle,
  Pause,
  Play,
  RotateCcw,
  Home,
  Coins,
  Gem,
} from 'lucide-react';
import { sounds } from '../audio/soundEngine';

/* Stickman Silhouette Vector Weapons (Zero Emojis!) */
const StickmanWeaponIcon: React.FC<{ weapon: string; className?: string }> = ({
  weapon,
  className = 'w-3.5 h-3.5 inline-block shrink-0',
}) => {
  switch (weapon) {
    case 'sword':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className}>
          <circle cx="6" cy="6" r="2.5" />
          <line x1="6" y1="8.5" x2="6" y2="15" />
          <line x1="6" y1="11" x2="14" y2="7" />
          <line x1="14" y1="7" x2="22" y2="3" strokeWidth="2.5" stroke="#f8fafc" />
          <polyline points="3,21 6,15 9,21" />
        </svg>
      );
    case 'axe':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className}>
          <circle cx="7" cy="6" r="2.5" />
          <line x1="7" y1="8.5" x2="7" y2="15" />
          <line x1="7" y1="11" x2="15" y2="8" />
          <line x1="13" y1="13" x2="19" y2="3" strokeWidth="2.5" stroke="#fbbf24" />
          <path d="M 17 4 Q 23 2 21 8 Q 18 10 16 7 Z" fill="#cbd5e1" stroke="#f8fafc" strokeWidth="1" />
          <polyline points="4,21 7,15 10,21" />
        </svg>
      );
    case 'gun':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className}>
          <circle cx="6" cy="6" r="2.5" />
          <line x1="6" y1="8.5" x2="6" y2="15" />
          <line x1="6" y1="10" x2="15" y2="10" />
          <rect x="14" y="8" width="7" height="4" rx="1" fill="#38bdf8" stroke="none" />
          <polyline points="3,21 6,15 9,21" />
        </svg>
      );
    case 'rocket':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className}>
          <circle cx="6" cy="6" r="2.5" />
          <line x1="6" y1="8.5" x2="6" y2="15" />
          <line x1="6" y1="10" x2="13" y2="9" />
          <rect x="11" y="7" width="10" height="5" rx="2" fill="#ef4444" stroke="none" />
          <polyline points="3,21 6,15 9,21" />
        </svg>
      );
    case 'rope':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className}>
          <circle cx="6" cy="6" r="2.5" />
          <line x1="6" y1="8.5" x2="6" y2="15" />
          <path d="M 6 11 Q 12 6 18 11" stroke="#a855f7" />
          <polyline points="3,21 6,15 9,21" />
        </svg>
      );
    case 'magnet':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className}>
          <circle cx="6" cy="6" r="2.5" />
          <line x1="6" y1="8.5" x2="6" y2="15" />
          <path d="M 14 8 A 4 4 0 0 1 14 16" stroke="#06b6d4" strokeWidth="2.5" />
          <polyline points="3,21 6,15 9,21" />
        </svg>
      );
    case 'fists':
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className}>
          <circle cx="8" cy="6" r="2.5" />
          <line x1="8" y1="8.5" x2="8" y2="15" />
          <line x1="8" y1="10" x2="16" y2="10" strokeWidth="2.5" stroke="#f59e0b" />
          <polyline points="5,21 8,15 11,21" />
        </svg>
      );
  }
};

interface HUDProps {
  players: PlayerState[];
  playerConfigs: PlayerConfig[];
  gameMode: GameMode;
  currentRound: number;
  maxRounds: number;
  roundTimer: number;
  activeEvent: ActiveEvent | null;
  nextEventTimer: number;
  rouletteTimer: number;
  isPaused: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onTogglePause: () => void;
  onOpenControls: () => void;
  onRestartMatch: () => void;
  onBackToLobby: () => void;
  wallet?: PlayerWallet;
}

export const HUD: React.FC<HUDProps> = ({
  players,
  playerConfigs,
  gameMode,
  currentRound,
  maxRounds,
  roundTimer,
  activeEvent,
  nextEventTimer,
  rouletteTimer,
  isPaused,
  soundEnabled,
  onToggleSound,
  onTogglePause,
  onOpenControls,
  onRestartMatch,
  onBackToLobby,
  wallet,
}) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [musicOn, setMusicOn] = useState<boolean>(sounds.musicEnabled);

  useEffect(() => {
    const handleFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFs);
    return () => document.removeEventListener('fullscreenchange', handleFs);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleToggleMusic = () => {
    const next = sounds.toggleBGM();
    setMusicOn(next);
  };
  const modeNames: Record<GameMode, string> = {
    battle_royale: 'Battle Royale',
    king_of_the_hill: 'King of the Hill',
    weapon_roulette: 'Weapon Roulette',
    chaos: 'Chaos Mode',
    team_deathmatch: 'Team Deathmatch',
    infection: 'Infection Mode',
    the_hero: 'The Hero (300 HP · Axes Only)',
  };

  // Team Deathmatch calculations
  const redPlayers = playerConfigs.filter((p) => p.enabled && p.team === 'red');
  const bluePlayers = playerConfigs.filter((p) => p.enabled && p.team === 'blue');
  const redWins = redPlayers[0]?.score ?? 0;
  const blueWins = bluePlayers[0]?.score ?? 0;
  const aliveRed = players.filter((p) => p.isAlive && p.team === 'red').length;
  const aliveBlue = players.filter((p) => p.isAlive && p.team === 'blue').length;

  // Infection calculations
  const aliveSurvivors = players.filter((p) => p.isAlive && !p.isInfected).length;
  const aliveInfected = players.filter((p) => p.isAlive && p.isInfected).length;
  const survivalTimeRemaining = Math.max(0, 45 - Math.floor(roundTimer));

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 z-20">
      {/* Top Header Bar */}
      <header className="flex items-center justify-between pointer-events-auto bg-slate-900/85 backdrop-blur-md px-5 py-2.5 rounded-xl border border-slate-800 shadow-xl">
        {/* Zone 1: Title Wordmark & Permanent Currency Bar */}
        <div className="flex items-center gap-3">
          <span className="text-lg font-black tracking-wider text-slate-100 uppercase">
            STICK ARENA
          </span>
          <span className="text-slate-600">/</span>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest hidden sm:inline">
            {modeNames[gameMode]}
          </span>

          {/* Permanent Currency Bar (شريط الأرصدة الدائم: النقود والجواهر) */}
          {wallet && (
            <div className="flex items-center gap-2.5 px-3 py-1 rounded-xl bg-slate-950/80 border border-slate-700/80 shadow-inner">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-300">
                <Coins className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>{wallet.coins.toLocaleString()}</span>
                <span className="text-[10px] font-sans text-amber-400/80 hidden md:inline">نقود</span>
              </div>
              <span className="text-slate-700">|</span>
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-300">
                <Gem className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400 animate-pulse" />
                <span>{wallet.gems.toLocaleString()}</span>
                <span className="text-[10px] font-sans text-cyan-400/80 hidden md:inline">جواهر</span>
              </div>
            </div>
          )}
        </div>

        {/* Zone 2: Round & Event Telemetry (Clean unboxed text) */}
        <div className="flex items-center gap-4 text-xs font-medium text-slate-300">
          <div>
            <span className="text-slate-500 uppercase tracking-wider mr-1.5">Round</span>
            <span className="font-mono tabular-nums font-bold text-white">
              {currentRound} / {maxRounds}
            </span>
          </div>

          <span className="text-slate-600" aria-hidden="true">·</span>

          {gameMode === 'infection' ? (
            <div className="flex items-center gap-3">
              <div className="text-amber-300 font-bold">
                <span className="text-slate-500 uppercase tracking-wider mr-1">Survival:</span>
                <span className="font-mono tabular-nums text-amber-400">{survivalTimeRemaining}s</span>
              </div>
              <span className="text-slate-600" aria-hidden="true">·</span>
              <div className="flex items-center gap-2">
                <span className="text-sky-400 font-semibold font-mono">Surv: {aliveSurvivors}</span>
                <span className="text-slate-500">vs</span>
                <span className="text-emerald-400 font-semibold font-mono">Zomb: {aliveInfected}</span>
              </div>
            </div>
          ) : gameMode === 'team_deathmatch' ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-red-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                <span>RED: {redWins}W</span>
                <span className="text-slate-400 font-mono text-[11px]">({aliveRed} alive)</span>
              </div>
              <span className="text-slate-500 font-bold">vs</span>
              <div className="flex items-center gap-1.5 text-blue-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span>BLUE: {blueWins}W</span>
                <span className="text-slate-400 font-mono text-[11px]">({aliveBlue} alive)</span>
              </div>
            </div>
          ) : (
            <div>
              <span className="text-slate-500 uppercase tracking-wider mr-1.5">Time</span>
              <span className="font-mono tabular-nums font-bold text-white">
                {Math.floor(roundTimer / 60)}:{(Math.floor(roundTimer) % 60).toString().padStart(2, '0')}
              </span>
            </div>
          )}

          {gameMode === 'weapon_roulette' && (
            <>
              <span className="text-slate-600" aria-hidden="true">·</span>
              <div className="text-amber-400 font-semibold">
                <span className="text-slate-500 uppercase tracking-wider mr-1.5">Roulette</span>
                <span className="font-mono tabular-nums font-bold">
                  {Math.ceil(rouletteTimer)}s
                </span>
              </div>
            </>
          )}

          <span className="text-slate-600" aria-hidden="true">·</span>

          <div>
            <span className="text-slate-500 uppercase tracking-wider mr-1.5">Next Event</span>
            <span className="font-mono tabular-nums font-bold text-sky-400">
              {Math.ceil(nextEventTimer)}s
            </span>
          </div>
        </div>

        {/* Zone 3: Functional Actions */}
        <div className="flex items-center gap-2">
          {/* Main Menu Button */}
          <button
            onClick={onBackToLobby}
            title="Main Menu"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-200 hover:text-white bg-slate-800/90 hover:bg-slate-700/90 rounded-lg border border-slate-700 shadow-sm transition-colors cursor-pointer"
          >
            <Home className="w-3.5 h-3.5 text-sky-400" />
            <span>Main Menu</span>
          </button>

          <button
            onClick={onOpenControls}
            title="Controls & Keys Guide"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 rounded-lg border border-slate-700 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Controls</span>
          </button>

          {/* Music Toggle with Label */}
          <button
            onClick={handleToggleMusic}
            title={musicOn ? 'كتم موسيقى الخلفية' : 'تشغيل موسيقى الخلفية'}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
              musicOn
                ? 'bg-purple-950/70 border-purple-500/40 text-purple-300 shadow-sm'
                : 'bg-slate-800/80 border-slate-700 text-slate-500 hover:text-slate-300'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span className="text-[10px] font-mono hidden sm:inline">{musicOn ? 'BGM ON' : 'BGM OFF'}</span>
          </button>

          {/* Sound FX Toggle with Label */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'كتم المؤثرات الصوتية' : 'تشغيل المؤثرات الصوتية'}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300 shadow-sm'
                : 'bg-slate-800/80 border-slate-700 text-rose-400 hover:text-rose-300'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="text-[10px] font-mono hidden sm:inline">{soundEnabled ? 'SFX ON' : 'SFX OFF'}</span>
          </button>

          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            className="p-1.5 text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 rounded-lg border border-slate-700 transition-colors"
          >
            {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5 text-cyan-400" />}
          </button>

          <button
            onClick={onTogglePause}
            title={isPaused ? 'Resume Match' : 'Pause Match'}
            className="p-1.5 text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 rounded-lg border border-slate-700 transition-colors"
          >
            {isPaused ? <Play className="w-4 h-4 text-amber-400" /> : <Pause className="w-4 h-4" />}
          </button>

          <button
            onClick={onRestartMatch}
            title="Restart Match"
            className="p-1.5 text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 rounded-lg border border-slate-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Center Event Banner Notification */}
      {activeEvent && (
        <div className="self-center pointer-events-none mt-2">
          <div className="bg-slate-950/90 border border-amber-500/50 text-amber-300 px-5 py-2 rounded-xl shadow-2xl backdrop-blur-md flex items-center gap-3 animate-bounce">
            <span className="text-base font-black tracking-wide uppercase text-white">
              {activeEvent.name}
            </span>
            <span className="text-slate-500" aria-hidden="true">·</span>
            <span className="text-xs text-amber-200">
              {activeEvent.description}
            </span>
            <span className="text-slate-500" aria-hidden="true">·</span>
            <span className="font-mono tabular-nums text-xs font-bold text-amber-400">
              {Math.ceil(activeEvent.timeRemaining)}s
            </span>
          </div>
        </div>
      )}

      {/* Bottom Player Status HUD Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3 pointer-events-none mt-auto">
        {playerConfigs.map((cfg) => {
          const st = players.find((p) => p.id === cfg.id);
          const isAlive = st?.isAlive ?? false;
          const hp = Math.max(0, Math.round(st?.hp ?? 0));
          const maxHp = st?.maxHp ?? (gameMode === 'the_hero' ? 300 : 200);
          const hpPercent = (hp / maxHp) * 100;

          const weaponLabels: Record<string, string> = {
            fists: 'Fists',
            sword: 'Sword',
            axe: 'Battleaxe',
            gun: 'Blaster',
            rocket: 'Rocket',
            rope: 'Grapple',
            magnet: 'Magnet',
          };

          return (
            <div
              key={cfg.id}
              className={`p-3 rounded-xl border backdrop-blur-md transition-all ${
                isAlive
                  ? gameMode === 'the_hero'
                    ? 'bg-slate-900/90 border-rose-500/40 shadow-lg shadow-rose-950/30'
                    : gameMode === 'team_deathmatch'
                    ? cfg.team === 'red'
                      ? 'bg-slate-900/90 border-red-500/40 shadow-lg shadow-red-950/30'
                      : 'bg-slate-900/90 border-blue-500/40 shadow-lg shadow-blue-950/30'
                    : gameMode === 'infection' && st?.isInfected
                    ? 'bg-slate-900/90 border-emerald-500/40 shadow-lg shadow-emerald-950/30'
                    : 'bg-slate-900/85 border-slate-800 shadow-lg'
                  : 'bg-slate-950/60 border-slate-900 opacity-60'
              }`}
            >
              {/* Player Header */}
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: cfg.color }}
                  />
                  <span className="font-bold text-xs text-white">
                    {cfg.name}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase font-mono">
                    {cfg.type === 'cpu'
                      ? `CPU (${(cfg.aiDifficulty || 'normal').toUpperCase()})`
                      : 'P' + cfg.id}
                  </span>
                  {gameMode === 'the_hero' && (
                    <span className="text-[9px] font-black px-1.5 py-0.2 rounded uppercase bg-rose-500/20 text-rose-300">
                      HERO
                    </span>
                  )}
                  {gameMode === 'team_deathmatch' && (
                    <span
                      className={`text-[9px] font-black px-1.5 py-0.2 rounded uppercase ${
                        cfg.team === 'red' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                      }`}
                    >
                      {cfg.team === 'red' ? 'RED' : 'BLUE'}
                    </span>
                  )}
                  {gameMode === 'infection' && (
                    <span
                      className={`text-[9px] font-black px-1.5 py-0.2 rounded uppercase ${
                        st?.isInfected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-sky-500/20 text-sky-400'
                      }`}
                    >
                      {st?.isInfected ? 'INFECTED' : 'SURVIVOR'}
                    </span>
                  )}
                </div>

                {/* Score wins / KOTH points */}
                <div className="text-right">
                  <span className="text-xs font-mono tabular-nums font-bold text-amber-400">
                    {gameMode === 'king_of_the_hill' ? `${Math.floor(cfg.points)} pts` : `${cfg.score} W`}
                  </span>
                </div>
              </div>

              {/* Health Bar */}
              <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                <span className="text-slate-400">HP</span>
                <span className={`font-bold ${hpPercent > 50 ? 'text-emerald-400' : hpPercent > 25 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {hp}/{maxHp}
                </span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden mb-1.5 border border-slate-800">
                <div
                  className="h-full transition-all duration-150"
                  style={{
                    width: `${hpPercent}%`,
                    backgroundColor:
                      hpPercent > 50
                        ? '#10b981'
                        : hpPercent > 25
                        ? '#f59e0b'
                        : '#ef4444',
                  }}
                />
              </div>

              {/* Status Info (Clean Unboxed Text with Stickman Icons) */}
              <div className="flex items-center justify-between text-[11px] text-slate-300">
                <div className="flex items-center gap-1.5 font-medium truncate">
                  {isAlive ? (
                    gameMode === 'infection' ? (
                      st?.isInfected ? (
                        <span className="text-emerald-400 text-[10px]">
                          ضربة التحويل: {(st?.attackCooldown || 0) > 0 ? (st?.attackCooldown || 0).toFixed(1) + 's' : 'جاهزة ✦'}
                        </span>
                      ) : (
                        <span className="text-sky-400 text-[10px]">
                          مراوغة وقفز (بدون أسلحة)
                        </span>
                      )
                    ) : (
                      <>
                        <StickmanWeaponIcon weapon={st?.weapon || 'fists'} className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>
                          {weaponLabels[st?.weapon || 'fists']}
                          {st?.weapon !== 'fists' ? ` (${st?.ammo})` : ''}
                        </span>
                      </>
                    )
                  ) : (
                    <span className="text-rose-400">ELIMINATED</span>
                  )}
                </div>

                <span className="font-mono tabular-nums text-slate-400 text-xs">
                  {isAlive ? `${hp} HP` : 'K.O.'}
                </span>
              </div>

              {/* Active Power-up line */}
              {st?.activePowerUp && isAlive && (
                <div className="mt-1 text-[10px] font-semibold text-sky-400 flex items-center justify-between">
                  <span>
                    {st.activePowerUp === 'giant' && '✦ GIANT'}
                    {st.activePowerUp === 'speed' && '✦ SPEED'}
                    {st.activePowerUp === 'shield' && `✦ SHIELD (${Math.round(st.shieldHp)})`}
                    {st.activePowerUp === 'combo' && '✦ 2X COMBO'}
                    {st.activePowerUp === 'jetpack' && '✦ JETPACK'}
                  </span>
                  <span className="font-mono tabular-nums">
                    {Math.ceil(st.powerUpTimeRemaining)}s
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
