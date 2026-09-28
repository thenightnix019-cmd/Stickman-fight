import { ArenaMap } from '../types/game';

export const MAPS: ArenaMap[] = [
  {
    id: 'grand_battle_royale',
    name: 'Apex Warzone',
    subtitle: 'Massive 2000px multi-level warzone for 6 players with shrinking storm & axe drops',
    width: 2000,
    height: 1050,
    spawnPoints: [
      { x: 180, y: 880 },
      { x: 1820, y: 880 },
      { x: 500, y: 640 },
      { x: 1500, y: 640 },
      { x: 820, y: 440 },
      { x: 1180, y: 440 },
    ],
    theme: {
      bgGradient: ['#0f172a', '#020617'],
      gridColor: 'rgba(56, 189, 248, 0.12)',
      platformColor: '#1e293b',
      platformBorder: '#38bdf8',
      accentColor: '#38bdf8',
    },
    platforms: [
      // Base bedrock floors
      { x: 100, y: 960, width: 1800, height: 50, oneWay: false, name: 'Main Ground' },
      
      // West District (Low, Mid, High)
      { x: 140, y: 780, width: 340, height: 20, oneWay: true, name: 'West Lower Deck' },
      { x: 260, y: 620, width: 300, height: 20, oneWay: true, name: 'West Outpost' },
      { x: 160, y: 440, width: 260, height: 18, oneWay: true, name: 'West Sniper Nest' },

      // East District (Low, Mid, High)
      { x: 1520, y: 780, width: 340, height: 20, oneWay: true, name: 'East Lower Deck' },
      { x: 1440, y: 620, width: 300, height: 20, oneWay: true, name: 'East Outpost' },
      { x: 1580, y: 440, width: 260, height: 18, oneWay: true, name: 'East Sniper Nest' },

      // Central Valley & Fortress
      { x: 620, y: 820, width: 320, height: 20, oneWay: true, name: 'Central Rampart Left' },
      { x: 1060, y: 820, width: 320, height: 20, oneWay: true, name: 'Central Rampart Right' },
      { x: 740, y: 650, width: 520, height: 22, oneWay: true, name: 'Command Bridge' },
      { x: 860, y: 480, width: 280, height: 20, oneWay: true, name: 'Apex Watchtower' },
      { x: 920, y: 320, width: 160, height: 18, oneWay: true, name: 'Sky High Perch' },

      // Mid-air stepping stones
      { x: 580, y: 530, width: 140, height: 16, oneWay: true, name: 'Mid Step W' },
      { x: 1280, y: 530, width: 140, height: 16, oneWay: true, name: 'Mid Step E' },
    ],
  },
  {
    id: 'foundry',
    name: 'The Foundry',
    subtitle: 'Industrial multi-tier battleground with central Hill Zone (-5 HP/s)',
    width: 1400,
    height: 750,
    spawnPoints: [
      { x: 180, y: 620 },
      { x: 1220, y: 620 },
      { x: 360, y: 440 },
      { x: 1040, y: 440 },
      { x: 580, y: 280 },
      { x: 820, y: 280 },
    ],
    hillZone: {
      x: 560,
      y: 220,
      width: 280,
      height: 130,
      name: 'HILL ZONE (-5 HP/s)',
      dps: 5,
      color: '#f59e0b',
    },
    theme: {
      bgGradient: ['#0f172a', '#020617'],
      gridColor: 'rgba(51, 65, 85, 0.25)',
      platformColor: '#1e293b',
      platformBorder: '#38bdf8',
      accentColor: '#38bdf8',
    },
    platforms: [
      // Solid base floor
      { x: 100, y: 680, width: 1200, height: 40, oneWay: false, name: 'Ground Floor' },
      // Left low platform
      { x: 180, y: 530, width: 240, height: 18, oneWay: true, name: 'Left Platform' },
      // Right low platform
      { x: 980, y: 530, width: 240, height: 18, oneWay: true, name: 'Right Platform' },
      // Mid center platform (Hill zone)
      { x: 530, y: 370, width: 340, height: 20, oneWay: true, name: 'Center Rig' },
      // Top left perch
      { x: 280, y: 250, width: 200, height: 16, oneWay: true, name: 'Left Perch' },
      // Top right perch
      { x: 920, y: 250, width: 200, height: 16, oneWay: true, name: 'Right Perch' },
    ],
  },
  {
    id: 'rooftop',
    name: 'Neon Skyline',
    subtitle: 'Dual skyscrapers with central Hell Zone hazard (-10 HP/s)',
    width: 1400,
    height: 750,
    spawnPoints: [
      { x: 180, y: 570 },
      { x: 1220, y: 570 },
      { x: 340, y: 390 },
      { x: 1060, y: 390 },
      { x: 540, y: 270 },
      { x: 860, y: 270 },
    ],
    hillZone: {
      x: 580,
      y: 410,
      width: 240,
      height: 110,
      name: 'HELL ZONE (-10 HP/s)',
      dps: 10,
      color: '#ef4444',
    },
    theme: {
      bgGradient: ['#18181b', '#09090b'],
      gridColor: 'rgba(236, 72, 153, 0.15)',
      platformColor: '#27272a',
      platformBorder: '#ec4899',
      accentColor: '#ec4899',
    },
    platforms: [
      // Left tower roof
      { x: 80, y: 630, width: 460, height: 80, oneWay: false, name: 'West Tower' },
      // Right tower roof
      { x: 860, y: 630, width: 460, height: 80, oneWay: false, name: 'East Tower' },
      // Central suspended bridge (Over the chasm!)
      { x: 540, y: 500, width: 320, height: 18, oneWay: true, name: 'Sky Bridge' },
      // High left tower crane
      { x: 180, y: 400, width: 260, height: 16, oneWay: true, name: 'West Antenna' },
      // High right tower crane
      { x: 960, y: 400, width: 260, height: 16, oneWay: true, name: 'East Antenna' },
      // High center platform
      { x: 580, y: 270, width: 240, height: 16, oneWay: true, name: 'Billboard Deck' },
    ],
  },
  {
    id: 'cyber',
    name: 'Cyber Colosseum',
    subtitle: 'Stepped fighting arena with central Hill Zone (-5 HP/s)',
    width: 1400,
    height: 750,
    spawnPoints: [
      { x: 240, y: 600 },
      { x: 1160, y: 600 },
      { x: 440, y: 420 },
      { x: 960, y: 420 },
      { x: 600, y: 310 },
      { x: 800, y: 310 },
    ],
    hillZone: {
      x: 560,
      y: 470,
      width: 280,
      height: 110,
      name: 'HILL ZONE (-5 HP/s)',
      dps: 5,
      color: '#f59e0b',
    },
    theme: {
      bgGradient: ['#042f2e', '#021a19'],
      gridColor: 'rgba(20, 184, 166, 0.2)',
      platformColor: '#134e4a',
      platformBorder: '#2dd4bf',
      accentColor: '#14b8a6',
    },
    platforms: [
      // Solid bottom
      { x: 150, y: 660, width: 1100, height: 40, oneWay: false, name: 'Colosseum Arena' },
      // Low steps
      { x: 220, y: 530, width: 220, height: 16, oneWay: true, name: 'West Tier 1' },
      { x: 960, y: 530, width: 220, height: 16, oneWay: true, name: 'East Tier 1' },
      // Mid steps
      { x: 340, y: 410, width: 220, height: 16, oneWay: true, name: 'West Tier 2' },
      { x: 840, y: 410, width: 220, height: 16, oneWay: true, name: 'East Tier 2' },
      // Crown platform
      { x: 540, y: 320, width: 320, height: 18, oneWay: true, name: 'Crown Podium' },
    ],
  },
];
