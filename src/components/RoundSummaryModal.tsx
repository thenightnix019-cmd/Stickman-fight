import React, { useEffect, useState } from 'react';
import { PlayerConfig, PlayerId, GameMode } from '../types/game';
import { Trophy, RotateCcw, ArrowRight, Home, Coins, Gem } from 'lucide-react';

interface RoundSummaryModalProps {
  winnerId: PlayerId | null;
  matchChampionId: PlayerId | null;
  playerConfigs: PlayerConfig[];
  currentRound: number;
  maxRounds: number;
  gameMode?: GameMode;
  winningTeam?: 'red' | 'blue' | null;
  infectionOutcome?: 'zombies' | 'survivors' | null;
  onNextRound: () => void;
  onRestartMatch: () => void;
  onBackToLobby: () => void;
  roundReward?: { coins: number; gems: number };
}

export const RoundSummaryModal: React.FC<RoundSummaryModalProps> = ({
  winnerId,
  matchChampionId,
  playerConfigs,
  currentRound,
  maxRounds,
  gameMode,
  winningTeam,
  infectionOutcome,
  onNextRound,
  onRestartMatch,
  onBackToLobby,
  roundReward = { coins: 50, gems: 1 },
}) => {
  const winner = playerConfigs.find((p) => p.id === winnerId);
  const champion = playerConfigs.find((p) => p.id === matchChampionId);
  const isMatchOver = matchChampionId !== null;

  const [countdown, setCountdown] = useState<number>(isMatchOver ? 5 : 4);

  // Countdown timer decrement
  useEffect(() => {
    setCountdown(isMatchOver ? 5 : 4);
    const interval = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isMatchOver, currentRound]);

  // When countdown hits 0, trigger navigation safely outside render dispatch
  useEffect(() => {
    if (countdown === 0) {
      if (isMatchOver) {
        onBackToLobby();
      } else {
        onNextRound();
      }
    }
  }, [countdown, isMatchOver, onBackToLobby, onNextRound]);

  // Determine round title & subtitle
  let roundTitle = `ROUND ${currentRound} FINISHED!`;
  let roundSubtitle = winner ? `${winner.name} takes the round!` : 'Round Draw!';
  let titleColor = winner?.color || '#38bdf8';

  if (gameMode === 'team_deathmatch' && winningTeam) {
    titleColor = winningTeam === 'red' ? '#ef4444' : '#3b82f6';
    roundSubtitle = `${winningTeam.toUpperCase()} TEAM WINS THE ROUND!`;
  } else if (gameMode === 'infection') {
    titleColor = '#38bdf8';
    if (winner) {
      roundTitle = `${winner.name.toUpperCase()} WINS THE ROUND!`;
      roundSubtitle = 'صمد حتى النهاية كناجٍ أخير! (Last Survivor Standing)';
    } else {
      roundSubtitle = 'انتهت جولة العدوى!';
    }
  }

  // Champion match text
  let champTitle = 'MATCH CHAMPION!';
  let champSubtitle = `${champion?.name || 'Player'} WINS THE TOURNAMENT!`;
  let champColor = champion?.color || '#fbbf24';

  if (gameMode === 'team_deathmatch' && winningTeam) {
    champColor = winningTeam === 'red' ? '#ef4444' : '#3b82f6';
    champSubtitle = `${winningTeam.toUpperCase()} TEAM WINS THE TOURNAMENT!`;
  } else if (gameMode === 'infection') {
    if (infectionOutcome === 'zombies') {
      champColor = '#22c55e';
      champSubtitle = 'THE ZOMBIE APOCALYPSE PREVAILED!';
    } else {
      champColor = '#38bdf8';
      champSubtitle = 'THE SURVIVORS PREVAILED!';
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl text-center">
        {/* Victory Icon / Banner */}
        <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 mb-4">
          <Trophy className="w-8 h-8 text-amber-400" />
        </div>

        {isMatchOver ? (
          <div>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-wider text-white">
              {champTitle}
            </h2>
            <div
              className="text-xl md:text-2xl font-black mt-2 tracking-wide"
              style={{ color: champColor }}
            >
              {champSubtitle}
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-wider text-white">
              {roundTitle}
            </h2>
            <div
              className="text-lg md:text-xl font-bold mt-1"
              style={{ color: titleColor }}
            >
              {roundSubtitle}
            </div>
          </div>
        )}

        {/* Round Completion Currency Reward Badge */}
        <div className="my-4 py-2.5 px-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-800 to-cyan-950/40 border border-amber-500/30 flex items-center justify-between shadow-inner">
          <span className="text-xs font-bold text-slate-300">مكافأة لعب الجولة:</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-mono font-black text-amber-300 text-xs">
              <Coins className="w-4 h-4 text-amber-400 fill-amber-400" />
              +{roundReward?.coins ?? 50} نقود
            </span>
            <span className="flex items-center gap-1 font-mono font-black text-cyan-300 text-xs">
              <Gem className="w-4 h-4 text-cyan-400 fill-cyan-400 animate-pulse" />
              +{roundReward?.gems ?? 1} جوهرة
            </span>
          </div>
        </div>

        {/* Current Scoreboard Standings */}
        <div className="my-6 space-y-2.5">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Match Standings (First to {maxRounds} Wins)
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {playerConfigs
              .filter((p) => p.enabled)
              .map((cfg) => {
                const isRoundWinner =
                  gameMode === 'team_deathmatch'
                    ? cfg.team === winningTeam
                    : cfg.id === winnerId;
                const isChamp = cfg.id === matchChampionId;

                return (
                  <div
                    key={cfg.id}
                    className={`p-3 rounded-xl border flex items-center justify-between text-left transition-all ${
                      isChamp || isRoundWinner
                        ? 'bg-slate-800/90 border-amber-400/60 shadow-md'
                        : 'bg-slate-950/60 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: cfg.color }}
                      />
                      <div className="flex flex-col">
                        <span className="font-bold text-xs text-white truncate max-w-[90px]">
                          {cfg.name}
                        </span>
                        {gameMode === 'team_deathmatch' && (
                          <span
                            className={`text-[9px] font-bold uppercase ${
                              cfg.team === 'red' ? 'text-red-400' : 'text-blue-400'
                            }`}
                          >
                            {cfg.team === 'red' ? 'RED TEAM' : 'BLUE TEAM'}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-mono tabular-nums text-sm font-black text-amber-400">
                        {cfg.score} W
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-3 pt-2">
          {isMatchOver ? (
            <>
              <button
                onClick={onBackToLobby}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-600 transition-colors shadow-sm"
              >
                <Home className="w-4 h-4 text-sky-400" />
                <span>Main Menu ({countdown}s)</span>
              </button>

              <button
                onClick={onRestartMatch}
                className="flex items-center gap-1.5 px-6 py-2.5 text-xs font-black uppercase tracking-wider text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-lg shadow-amber-400/20 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Play Again</span>
              </button>
            </>
          ) : (
            <button
              onClick={onNextRound}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-black uppercase tracking-wider text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-lg shadow-amber-400/20 transition-all cursor-pointer"
            >
              <span>Next Round ({countdown}s)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
