/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import {
  PlayerConfig,
  PlayerId,
  GameSettings,
  PlayerState,
  ActiveEvent,
  PlayerKeyBindingsMap,
} from './types/game';
import { GameCanvas } from './components/GameCanvas';
import { HUD } from './components/HUD';
import { LobbyModal } from './components/LobbyModal';
import { RoundSummaryModal } from './components/RoundSummaryModal';
import { ControlsGuide } from './components/ControlsGuide';
import { MainMenu } from './components/MainMenu';
import { SettingsModal } from './components/SettingsModal';
import { ShopModal } from './components/ShopModal';
import { RedeemCodeModal } from './components/RedeemCodeModal';
import { sounds } from './audio/soundEngine';
import { loadSavedKeyBindings, saveKeyBindings } from './engine/keybindings';
import { loadWallet, awardRoundRewards, loadPlayersGear, savePlayerGear } from './services/shopStorage';
import { PlayerWallet } from './types/shop';

type GameState = 'MAIN_MENU' | 'LOBBY' | 'PLAYING' | 'ROUND_SUMMARY' | 'MATCH_OVER';

const DEFAULT_PLAYERS: PlayerConfig[] = [
  {
    id: 1,
    name: 'Red Blaze',
    color: '#ef4444',
    glowColor: '#f87171',
    type: 'human',
    enabled: true,
    score: 0,
    points: 0,
    kills: 0,
    deaths: 0,
    damageDealt: 0,
    team: 'red',
  },
  {
    id: 2,
    name: 'Blue Bolt',
    color: '#3b82f6',
    glowColor: '#60a5fa',
    type: 'human',
    enabled: true,
    score: 0,
    points: 0,
    kills: 0,
    deaths: 0,
    damageDealt: 0,
    team: 'red',
  },
  {
    id: 3,
    name: 'Green Viper',
    color: '#10b981',
    glowColor: '#34d399',
    type: 'cpu',
    enabled: true,
    score: 0,
    points: 0,
    kills: 0,
    deaths: 0,
    damageDealt: 0,
    team: 'blue',
  },
  {
    id: 4,
    name: 'Gold Striker',
    color: '#f59e0b',
    glowColor: '#fbbf24',
    type: 'cpu',
    enabled: true,
    score: 0,
    points: 0,
    kills: 0,
    deaths: 0,
    damageDealt: 0,
    team: 'blue',
  },
  {
    id: 5,
    name: 'Purple Phantom',
    color: '#a855f7',
    glowColor: '#c084fc',
    type: 'cpu',
    enabled: true,
    score: 0,
    points: 0,
    kills: 0,
    deaths: 0,
    damageDealt: 0,
    team: 'red',
  },
  {
    id: 6,
    name: 'Orange Fury',
    color: '#f97316',
    glowColor: '#fb923c',
    type: 'cpu',
    enabled: true,
    score: 0,
    points: 0,
    kills: 0,
    deaths: 0,
    damageDealt: 0,
    team: 'blue',
  },
];

export default function App() {
  const [gameState, setGameState] = useState<GameState>('MAIN_MENU');
  const [wallet, setWallet] = useState<PlayerWallet>(loadWallet);
  const [showShopModal, setShowShopModal] = useState<boolean>(false);
  const [showRedeemCodeModal, setShowRedeemCodeModal] = useState<boolean>(false);
  const [lastRoundReward, setLastRoundReward] = useState<{ coins: number; gems: number }>({
    coins: 50,
    gems: 1,
  });

  const [playerConfigs, setPlayerConfigs] = useState<PlayerConfig[]>(() => {
    const initialWallet = loadWallet();
    const savedGear = loadPlayersGear();
    return DEFAULT_PLAYERS.map((p, idx) => {
      const gear = savedGear[p.id] || {};
      if (idx === 0) {
        return {
          ...p,
          equippedHat: gear.equippedHat !== undefined ? gear.equippedHat : initialWallet.equippedHat,
          equippedSkin: gear.equippedSkin !== undefined ? gear.equippedSkin : initialWallet.equippedSkin,
          equippedShoes: gear.equippedShoes !== undefined ? gear.equippedShoes : initialWallet.equippedShoes,
          equippedWeaponSkin: gear.equippedWeaponSkin !== undefined ? gear.equippedWeaponSkin : initialWallet.equippedWeaponSkin,
        };
      }
      return {
        ...p,
        equippedHat: gear.equippedHat || null,
        equippedSkin: gear.equippedSkin || null,
        equippedShoes: gear.equippedShoes || null,
        equippedWeaponSkin: gear.equippedWeaponSkin || null,
      };
    });
  });
  const [keyBindings, setKeyBindings] = useState<PlayerKeyBindingsMap>(loadSavedKeyBindings);
  const [settings, setSettings] = useState<GameSettings>({
    mode: 'battle_royale',
    roundsToWin: 3,
    eventInterval: 30,
    selectedMap: 'grand_battle_royale',
    soundEnabled: true,
    aiDifficulty: 'normal',
  });

  const [currentRound, setCurrentRound] = useState<number>(1);
  const [winnerId, setWinnerId] = useState<PlayerId | null>(null);
  const [matchChampionId, setMatchChampionId] = useState<PlayerId | null>(null);
  const [winningTeam, setWinningTeam] = useState<'red' | 'blue' | null>(null);
  const [infectionOutcome, setInfectionOutcome] = useState<'zombies' | 'survivors' | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [showControlsGuide, setShowControlsGuide] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);

  // HUD dynamic data
  const [hudData, setHudData] = useState<{
    players: PlayerState[];
    roundTimer: number;
    activeEvent: ActiveEvent | null;
    nextEventTimer: number;
    rouletteTimer: number;
  }>({
    players: [],
    roundTimer: 0,
    activeEvent: null,
    nextEventTimer: 30,
    rouletteTimer: 10,
  });

  const handleUpdatePlayerConfig = (id: PlayerId, updates: Partial<PlayerConfig>) => {
    setPlayerConfigs((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    savePlayerGear(id, updates);
  };

  const handleUpdateSettings = (updates: Partial<GameSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...updates };
      // Apex Warzone is exclusively for Battle Royale mode
      if (next.mode === 'battle_royale') {
        next.selectedMap = 'grand_battle_royale';
      } else if (next.selectedMap === 'grand_battle_royale') {
        next.selectedMap = 'foundry';
      }
      return next;
    });
  };

  const handleUpdateKeyBindings = (newBindings: PlayerKeyBindingsMap) => {
    setKeyBindings(newBindings);
    saveKeyBindings(newBindings);
  };

  const handleToggleSound = () => {
    const nextVal = !settings.soundEnabled;
    sounds.enabled = nextVal;
    setSettings((prev) => ({ ...prev, soundEnabled: nextVal }));
  };

  const handleStartGame = () => {
    sounds.stopBGM(); // Stop lobby background music during match so it does not loop incessantly
    // Reset round wins and points
    setPlayerConfigs((prev) =>
      prev.map((p) => ({
        ...p,
        score: 0,
        points: 0,
        kills: 0,
        deaths: 0,
        damageDealt: 0,
      }))
    );
    setCurrentRound(1);
    setWinnerId(null);
    setMatchChampionId(null);
    setWinningTeam(null);
    setInfectionOutcome(null);
    setIsPaused(false);
    setGameState('PLAYING');
  };

  const handleRoundOver = useCallback(
    (roundWinner: PlayerId | null) => {
      setWinnerId(roundWinner);

      setPlayerConfigs((prev) => {
        let champ: PlayerId | null = null;
        let updated = [...prev];

        if (settings.mode === 'team_deathmatch') {
          // Find winning team from roundWinner
          const winningP = prev.find((p) => p.id === roundWinner);
          const winTeam = winningP?.team || 'red';
          setWinningTeam(winTeam);

          updated = prev.map((p) =>
            p.enabled && p.team === winTeam ? { ...p, score: p.score + 1 } : p
          );

          // Check if any player or team reached target rounds
          const teamScorers = updated.filter((p) => p.enabled && p.team === winTeam);
          if (teamScorers.some((p) => p.score >= settings.roundsToWin)) {
            champ = winningP?.id || teamScorers[0]?.id || 1;
          }
        } else if (settings.mode === 'infection') {
          // The last survivor standing outlasted all others and takes the round win!
          setInfectionOutcome('survivors');
          updated = prev.map((p) =>
            p.id === roundWinner ? { ...p, score: p.score + 1 } : p
          );

          if (roundWinner !== null) {
            const topScorer = updated.find((p) => p.id === roundWinner);
            if (topScorer && topScorer.score >= settings.roundsToWin) {
              champ = topScorer.id;
            }
          }
        } else {
          // FFA / Battle Royale / Roulette / Chaos
          setWinningTeam(null);
          setInfectionOutcome(null);
          updated = prev.map((p) =>
            p.id === roundWinner ? { ...p, score: p.score + 1 } : p
          );

          if (roundWinner !== null) {
            const winningPlayer = updated.find((p) => p.id === roundWinner);
            if (winningPlayer && winningPlayer.score >= settings.roundsToWin) {
              champ = winningPlayer.id;
            }
          }
        }

        // Also check if current round reached max total rounds (e.g. round 3 completed)
        if (!champ && currentRound >= settings.roundsToWin) {
          // Find player with highest score
          const sorted = [...updated]
            .filter((p) => p.enabled)
            .sort((a, b) => b.score - a.score || (b.points || 0) - (a.points || 0));
          if (sorted.length > 0) {
            champ = sorted[0].id;
          }
        }

        // Guaranteed round currency reward: 50 coins & 1 gem every single round!
        const isHumanWinner = roundWinner === 1;
        const { earnedCoins, earnedGems, newWallet } = awardRoundRewards(isHumanWinner);
        setWallet(newWallet);
        setLastRoundReward({ coins: earnedCoins, gems: earnedGems });

        if (champ) {
          setMatchChampionId(champ);
          setGameState('MATCH_OVER');
        } else {
          setGameState('ROUND_SUMMARY');
        }

        return updated;
      });
    },
    [currentRound, settings.roundsToWin, settings.mode, hudData.players]
  );

  const handleNextRound = () => {
    setCurrentRound((prev) => prev + 1);
    setWinnerId(null);
    setWinningTeam(null);
    setInfectionOutcome(null);
    setGameState('PLAYING');
  };

  const handleRestartMatch = () => {
    handleStartGame();
  };

  const handleBackToLobby = () => {
    setGameState('LOBBY');
  };

  const handleUpdateScore = useCallback(
    (playerId: PlayerId, deltaScore: number, points?: number) => {
      setPlayerConfigs((prev) =>
        prev.map((p) => {
          if (p.id !== playerId) return p;
          const nextPoints = (p.points || 0) + (points || 0);
          return {
            ...p,
            score: p.score + deltaScore,
            points: nextPoints,
          };
        })
      );
    },
    []
  );

  const handleHUDUpdate = useCallback(
    (data: {
      players: PlayerState[];
      roundTimer: number;
      activeEvent: ActiveEvent | null;
      nextEventTimer: number;
      rouletteTimer: number;
    }) => {
      setHudData(data);
    },
    []
  );

  return (
    <div className="fixed inset-0 w-screen h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans select-none flex flex-col">
      {/* 1. Main Menu Screen */}
      {gameState === 'MAIN_MENU' && (
        <MainMenu
          onPlay={() => setGameState('LOBBY')}
          onOpenSettings={() => setShowSettingsModal(true)}
          onOpenControls={() => setShowControlsGuide(true)}
          onOpenShop={() => setShowShopModal(true)}
          onOpenRedeemCode={() => setShowRedeemCodeModal(true)}
          coins={wallet.coins}
          gems={wallet.gems}
        />
      )}

      {/* 2. Character & Match Lobby Modal */}
      {gameState === 'LOBBY' && (
        <LobbyModal
          playerConfigs={playerConfigs}
          onUpdatePlayerConfig={handleUpdatePlayerConfig}
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onStartGame={handleStartGame}
          onOpenControls={() => setShowControlsGuide(true)}
          onBackToMainMenu={() => setGameState('MAIN_MENU')}
          keyBindings={keyBindings}
          wallet={wallet}
        />
      )}

      {/* 3. Active Game Canvas */}
      {gameState !== 'MAIN_MENU' && gameState !== 'LOBBY' && (
        <GameCanvas
          key={`match-${currentRound}`}
          playerConfigs={playerConfigs}
          settings={settings}
          isPaused={isPaused}
          keyBindings={keyBindings}
          onRoundOver={handleRoundOver}
          onMatchOver={(champ) => {
            setMatchChampionId(champ);
            setGameState('MATCH_OVER');
          }}
          onUpdateScore={handleUpdateScore}
          onHUDUpdate={handleHUDUpdate}
        />
      )}

      {/* 4. In-Game HUD overlay */}
      {gameState === 'PLAYING' && (
        <HUD
          players={hudData.players}
          playerConfigs={playerConfigs.filter((p) => p.enabled)}
          gameMode={settings.mode}
          currentRound={currentRound}
          maxRounds={settings.roundsToWin}
          roundTimer={hudData.roundTimer}
          activeEvent={hudData.activeEvent}
          nextEventTimer={hudData.nextEventTimer}
          rouletteTimer={hudData.rouletteTimer}
          isPaused={isPaused}
          soundEnabled={settings.soundEnabled}
          onToggleSound={handleToggleSound}
          onTogglePause={() => setIsPaused((prev) => !prev)}
          onOpenControls={() => setShowControlsGuide(true)}
          onRestartMatch={handleRestartMatch}
          onBackToLobby={() => setGameState('LOBBY')}
          wallet={wallet}
        />
      )}

      {/* 5. Round Summary & Match Victory Modals */}
      {(gameState === 'ROUND_SUMMARY' || gameState === 'MATCH_OVER') && (
        <RoundSummaryModal
          winnerId={winnerId}
          matchChampionId={matchChampionId}
          playerConfigs={playerConfigs}
          currentRound={currentRound}
          maxRounds={settings.roundsToWin}
          gameMode={settings.mode}
          winningTeam={winningTeam}
          infectionOutcome={infectionOutcome}
          onNextRound={handleNextRound}
          onRestartMatch={handleRestartMatch}
          onBackToLobby={() => setGameState('LOBBY')}
          roundReward={lastRoundReward}
        />
      )}

      {/* 6. Settings Modal */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onOpenControls={() => {
          setShowSettingsModal(false);
          setShowControlsGuide(true);
        }}
      />

      {/* 7. Controls & Weapons Guide Modal */}
      <ControlsGuide
        isOpen={showControlsGuide}
        onClose={() => setShowControlsGuide(false)}
        keyBindings={keyBindings}
        onUpdateKeyBindings={handleUpdateKeyBindings}
      />

      {/* 8. Cosmetics & Heroes Shop Modal */}
      <ShopModal
        isOpen={showShopModal}
        onClose={() => setShowShopModal(false)}
        wallet={wallet}
        onUpdateWallet={setWallet}
        playerConfigs={playerConfigs}
        onUpdatePlayerConfig={handleUpdatePlayerConfig}
      />

      {/* 9. Promo Secret Code Redemption Modal */}
      <RedeemCodeModal
        isOpen={showRedeemCodeModal}
        onClose={() => setShowRedeemCodeModal(false)}
        wallet={wallet}
        onUpdateWallet={setWallet}
      />
    </div>
  );
}
