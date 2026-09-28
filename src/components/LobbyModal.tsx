import React, { useState, useRef } from 'react';
import {
  GameMode,
  PlayerConfig,
  PlayerId,
  GameSettings,
  AIDifficulty,
  PlayerKeyBindingsMap,
} from '../types/game';
import {
  Play,
  Users,
  Bot,
  User,
  HelpCircle,
  Swords,
  Home,
  ChevronDown,
  ChevronUp,
  Gamepad2,
  MapPin,
  Flame,
  Coins,
  Gem,
  Crown,
  Shield,
  Zap,
  Skull,
  Dices,
} from 'lucide-react';
import { MAPS } from '../engine/maps';
import { getKeyDisplayLabel, DEFAULT_KEY_BINDINGS } from '../engine/keybindings';
import { PlayerWallet } from '../types/shop';

interface LobbyModalProps {
  playerConfigs: PlayerConfig[];
  onUpdatePlayerConfig: (id: PlayerId, updates: Partial<PlayerConfig>) => void;
  settings: GameSettings;
  onUpdateSettings: (updates: Partial<GameSettings>) => void;
  onStartGame: () => void;
  onOpenControls: () => void;
  onBackToMainMenu?: () => void;
  keyBindings?: PlayerKeyBindingsMap;
  wallet?: PlayerWallet;
}

export const LobbyModal: React.FC<LobbyModalProps> = ({
  playerConfigs,
  onUpdatePlayerConfig,
  settings,
  onUpdateSettings,
  onStartGame,
  onOpenControls,
  onBackToMainMenu,
  keyBindings,
  wallet,
}) => {
  const [activeTab, setActiveTab] = useState<'modes' | 'roster' | 'rules'>('modes');
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const modesSectionRef = useRef<HTMLDivElement>(null);
  const rosterSectionRef = useRef<HTMLDivElement>(null);
  const rulesSectionRef = useRef<HTMLDivElement>(null);

  const modes: { id: GameMode; title: string; desc: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'battle_royale',
      title: 'Battle Royale',
      desc: 'حلبة ضخمة 2000px مع عاصفة وسلاح الفأس الجديد (Battleaxe). حتى 6 لاعبين.',
      icon: <Swords className="w-5 h-5 text-amber-400" />,
      badge: 'ماب ضخم 6P',
    },
    {
      id: 'infection',
      title: 'Infection Mode',
      desc: 'زومبي عشوائي ينشر العدوى بضربة التحويل (2s CD). الناجي الأخير يفوز!',
      icon: <Skull className="w-5 h-5 text-emerald-400" />,
      badge: 'Survivor Win',
    },
    {
      id: 'the_hero',
      title: 'The Hero',
      desc: 'طور الأبطال: فؤوس فقط (Axes Only) مع دم 300 HP ومنطقة هيل زون تشفيك +5 HP كل ثانية!',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-5 h-5 text-rose-400">
          <circle cx="7" cy="6" r="2.5" />
          <line x1="7" y1="8.5" x2="7" y2="15" />
          <line x1="7" y1="11" x2="15" y2="8" />
          <line x1="13" y1="13" x2="19" y2="3" strokeWidth="2.5" stroke="#fbbf24" />
          <path d="M 17 4 Q 23 2 21 8 Q 18 10 16 7 Z" fill="#cbd5e1" stroke="#f8fafc" strokeWidth="1" />
          <polyline points="4,21 7,15 10,21" />
        </svg>
      ),
      badge: '300 HP · فؤوس فقط',
    },
    {
      id: 'king_of_the_hill',
      title: 'King of the Hill',
      desc: 'السيطرة على التل المشع (+1pt/s) مع منطقة علاج تشفيك +3 HP كل ثانية.',
      icon: <Crown className="w-5 h-5 text-amber-300" />,
    },
    {
      id: 'weapon_roulette',
      title: 'Weapon Roulette',
      desc: 'كل 10 ثوانٍ يتغير سلاح كل المقاتلين عشوائياً بدون توقف.',
      icon: <Dices className="w-5 h-5 text-purple-400" />,
    },
    {
      id: 'team_deathmatch',
      title: 'Team Deathmatch',
      desc: 'قتال فرق 2v2 أو مخصص: فريق أحمر ضد فريق أزرق بدون ضرر للأصدقاء.',
      icon: <Shield className="w-5 h-5 text-blue-400" />,
      badge: 'Red vs Blue',
    },
    {
      id: 'chaos',
      title: 'Chaos Mode',
      desc: 'جنون مطلق: زلازل، انعدام جاذبية، رياح عاتية، وأسلحة متساقطة.',
      icon: <Zap className="w-5 h-5 text-yellow-400" />,
    },
  ];

  const enabledCount = playerConfigs.filter((p) => p.enabled).length;

  const scrollToSection = (target: 'modes' | 'roster' | 'rules') => {
    setActiveTab(target);
    const ref =
      target === 'modes'
        ? modesSectionRef.current
        : target === 'roster'
        ? rosterSectionRef.current
        : rulesSectionRef.current;

    if (ref && scrollContainerRef.current) {
      ref.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const maxScroll = el.scrollHeight - el.clientHeight;
    if (maxScroll > 0) {
      const progress = el.scrollTop / maxScroll;
      setScrollProgress(progress);
    }
  };

  const handleScrollDownOrUp = () => {
    if (!scrollContainerRef.current) return;
    if (scrollProgress < 0.8) {
      scrollContainerRef.current.scrollBy({ top: 380, behavior: 'smooth' });
    } else {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-5 select-none overflow-hidden bg-slate-950">
      {/* ============================================================== */}
      {/* 1. BACKGROUND: ANIMATED STICKMAN SILHOUETTES & BREATHING NEON  */}
      {/* ============================================================== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Cyberpunk Ground Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b22_1px,transparent_1px),linear-gradient(to_bottom,#1e293b22_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-70" />

        {/* Breathing Neon Spotlights ("اضاءة تزول وتعود") */}
        {/* Cyan Spotlight (Left - Katana Master) */}
        <div className="absolute -top-20 -left-20 w-[550px] h-[550px] rounded-full bg-cyan-500/20 animate-neon-cyan" />
        {/* Amber/Fire Spotlight (Right - Berserker Battleaxe) */}
        <div className="absolute top-1/3 -right-24 w-[600px] h-[600px] rounded-full bg-amber-500/20 animate-neon-amber" />
        {/* Emerald Toxic Spotlight (Bottom-Left - Zombie Horde) */}
        <div className="absolute -bottom-24 left-1/4 w-[500px] h-[500px] rounded-full bg-emerald-500/20 animate-neon-emerald" />
        {/* Purple Mystic Spotlight (Top-Center) */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[650px] h-[450px] rounded-full bg-purple-600/15 animate-neon-purple" />

        {/* ================= STICKMAN SILHOUETTES IN BACKGROUND ================= */}
        {/* Stickman 1: Katana Leap Strike (Left Side) */}
        <div className="absolute left-4 sm:left-12 top-24 sm:top-28 text-cyan-400/30 animate-stickman-glow animate-stickman-float hidden md:block">
          <svg width="240" height="280" viewBox="0 0 200 240" fill="none" stroke="currentColor">
            {/* Glowing Katana Slash Arc */}
            <path
              d="M 30 180 Q 90 20 185 70"
              stroke="#38bdf8"
              strokeWidth="4"
              strokeDasharray="4 2"
              className="drop-shadow-[0_0_12px_#38bdf8]"
            />
            {/* Stickman Head & Glowing Eyes */}
            <circle cx="100" cy="50" r="18" strokeWidth="4" fill="#0369a1" />
            <circle cx="95" cy="48" r="2.5" fill="#e0f2fe" className="animate-ping" />
            {/* Torso */}
            <line x1="100" y1="68" x2="100" y2="125" strokeWidth="4.5" strokeLinecap="round" />
            {/* Katana Arm Raised */}
            <line x1="100" y1="80" x2="135" y2="45" strokeWidth="4" strokeLinecap="round" />
            <line x1="135" y1="45" x2="175" y2="25" strokeWidth="3.5" stroke="#7dd3fc" strokeLinecap="round" />
            {/* Blade Hilt Guard */}
            <line x1="130" y1="40" x2="140" y2="50" stroke="#f8fafc" strokeWidth="4" />
            {/* Support Arm */}
            <line x1="100" y1="85" x2="65" y2="95" strokeWidth="4" strokeLinecap="round" />
            <line x1="65" y1="95" x2="45" y2="80" strokeWidth="3.5" strokeLinecap="round" />
            {/* Dynamic Flying Jump Legs */}
            <line x1="100" y1="125" x2="130" y2="160" strokeWidth="4.5" strokeLinecap="round" />
            <line x1="130" y1="160" x2="165" y2="185" strokeWidth="4" strokeLinecap="round" />
            <line x1="100" y1="125" x2="70" y2="155" strokeWidth="4.5" strokeLinecap="round" />
            <line x1="70" y1="155" x2="60" y2="200" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>

        {/* Stickman 2: Heavy Berserker with Giant Battleaxe (Right Side) */}
        <div className="absolute right-4 sm:right-12 bottom-16 sm:bottom-20 text-amber-400/30 animate-stickman-glow hidden lg:block">
          <svg width="250" height="300" viewBox="0 0 220 260" fill="none" stroke="currentColor">
            {/* Fire Energy Trail */}
            <path
              d="M 60 40 Q 150 20 180 120"
              stroke="#f59e0b"
              strokeWidth="5"
              strokeLinecap="round"
              className="drop-shadow-[0_0_15px_#f59e0b]"
            />
            {/* Berserker Head with Horns */}
            <circle cx="110" cy="70" r="19" strokeWidth="4.5" fill="#78350f" />
            <path d="M 98 56 L 90 42 M 122 56 L 130 42" stroke="#fbbf24" strokeWidth="3.5" strokeLinecap="round" />
            {/* Torso */}
            <line x1="110" y1="89" x2="105" y2="150" strokeWidth="5" strokeLinecap="round" />
            {/* Giant Battleaxe Shaft */}
            <line x1="50" y1="30" x2="155" y2="180" stroke="#d97706" strokeWidth="5.5" strokeLinecap="round" />
            {/* Battleaxe Double Blades */}
            <path
              d="M 50 30 Q 30 10 15 35 Q 35 55 55 45 Z"
              fill="#fbbf24"
              stroke="#f59e0b"
              strokeWidth="3"
              className="drop-shadow-[0_0_12px_#fbbf24]"
            />
            <path
              d="M 55 25 Q 75 5 95 28 Q 75 50 50 35 Z"
              fill="#fbbf24"
              stroke="#f59e0b"
              strokeWidth="3"
              className="drop-shadow-[0_0_12px_#fbbf24]"
            />
            {/* Arms Gripping Axe */}
            <line x1="110" y1="100" x2="80" y2="70" strokeWidth="4.5" strokeLinecap="round" />
            <line x1="110" y1="105" x2="115" y2="120" strokeWidth="4.5" strokeLinecap="round" />
            {/* Heavy Combat Stance Legs */}
            <line x1="105" y1="150" x2="70" y2="185" strokeWidth="5" strokeLinecap="round" />
            <line x1="70" y1="185" x2="55" y2="230" strokeWidth="4.5" strokeLinecap="round" />
            <line x1="105" y1="150" x2="140" y2="185" strokeWidth="5" strokeLinecap="round" />
            <line x1="140" y1="185" x2="160" y2="230" strokeWidth="4.5" strokeLinecap="round" />
          </svg>
        </div>

        {/* Stickman 3: Infection Zombie Claw Stalker (Bottom-Left) */}
        <div className="absolute left-1/4 -bottom-8 text-emerald-400/25 animate-stickman-glow hidden xl:block">
          <svg width="200" height="200" viewBox="0 0 180 180" fill="none" stroke="currentColor">
            {/* Zombie Head */}
            <circle cx="80" cy="50" r="16" strokeWidth="4" fill="#064e3b" />
            <circle cx="76" cy="48" r="2.5" fill="#34d399" />
            <circle cx="85" cy="48" r="2.5" fill="#34d399" />
            {/* Crooked Spine */}
            <path d="M 80 66 Q 95 95 75 125" strokeWidth="4.5" strokeLinecap="round" />
            {/* Zombie Claws reaching forward */}
            <line x1="85" y1="80" x2="120" y2="75" strokeWidth="4" strokeLinecap="round" />
            <line x1="120" y1="75" x2="145" y2="65" strokeWidth="3" stroke="#6ee7b7" strokeLinecap="round" />
            <line x1="85" y1="85" x2="115" y2="95" strokeWidth="4" strokeLinecap="round" />
            <line x1="115" y1="95" x2="140" y2="90" strokeWidth="3" stroke="#6ee7b7" strokeLinecap="round" />
            {/* Stalking Legs */}
            <line x1="75" y1="125" x2="50" y2="150" strokeWidth="4" strokeLinecap="round" />
            <line x1="50" y1="150" x2="35" y2="175" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="75" y1="125" x2="105" y2="150" strokeWidth="4" strokeLinecap="round" />
            <line x1="105" y1="150" x2="120" y2="175" strokeWidth="3.5" strokeLinecap="round" />
          </svg>
        </div>

        {/* Floating Neon Embers */}
        <div className="absolute top-1/4 left-1/3 w-2 h-2 rounded-full bg-cyan-400 animate-ping opacity-75" />
        <div className="absolute bottom-1/3 right-1/4 w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping opacity-60" />
        <div className="absolute top-2/3 left-1/5 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping opacity-70" />
      </div>

      {/* ============================================================== */}
      {/* 2. MAIN MODAL CONTAINER WITH STICKY HEADER & CUSTOM SCROLLBAR  */}
      {/* ============================================================== */}
      <div className="relative z-20 w-full max-w-5xl h-[92vh] max-h-[860px] bg-slate-900/90 border border-slate-800 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-xl flex flex-col overflow-hidden">
        {/* ========================================== */}
        {/* A. FIXED TOP BAR (HEADER & ACTIONS)       */}
        {/* ========================================== */}
        <div className="shrink-0 px-5 sm:px-8 pt-5 pb-3 border-b border-slate-800/80 bg-slate-900/95 backdrop-blur-md flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            {/* Title & Status */}
            <div className="flex items-center gap-3">
              <div className="relative p-2 rounded-2xl bg-gradient-to-br from-sky-500/20 to-indigo-500/10 border border-sky-400/30 text-sky-400 shadow-md">
                <Swords className="w-6 h-6 animate-pulse" />
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black tracking-wider text-white uppercase drop-shadow-sm">
                    STICK ARENA
                  </h1>
                  <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    LOBBY
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block">
                  حلبة القتال متعددة اللاعبين • اختر نمط اللعب وقائمة المقاتلين
                </p>
              </div>
            </div>

            {/* Quick Actions (Home, Controls, Play) */}
            <div className="flex items-center gap-2 sm:gap-3">
              {onBackToMainMenu && (
                <button
                  onClick={onBackToMainMenu}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-300 hover:text-white bg-slate-800/90 hover:bg-slate-700 rounded-xl border border-slate-700/80 transition-all cursor-pointer shadow-sm"
                  title="العودة للقائمة الرئيسية"
                >
                  <Home className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden md:inline">الرئيسية</span>
                </button>
              )}

              <button
                onClick={onOpenControls}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-300 hover:text-white bg-slate-800/90 hover:bg-slate-700 rounded-xl border border-slate-700/80 transition-all cursor-pointer shadow-sm"
                title="دليل أزرار التحكم"
              >
                <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
                <span className="hidden md:inline">التحكم</span>
              </button>

              <button
                onClick={onStartGame}
                disabled={enabledCount < 2}
                className="flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-black tracking-wider uppercase text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 disabled:opacity-40 rounded-xl shadow-lg shadow-amber-500/25 transition-all transform active:scale-95 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>START MATCH ({enabledCount}P)</span>
              </button>
            </div>
          </div>

          {/* ============================================================== */}
          {/* B. QUICK SECTION NAVIGATION BAR ("شريط نهبط بيه ونختار")        */}
          {/* ============================================================== */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5 sm:gap-2 p-1 bg-slate-950/70 border border-slate-800/80 rounded-2xl w-full sm:w-auto">
              <button
                onClick={() => scrollToSection('modes')}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'modes'
                    ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Gamepad2 className="w-3.5 h-3.5" />
                <span>1. أنماط اللعب</span>
              </button>

              <button
                onClick={() => scrollToSection('roster')}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'roster'
                    ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>2. تشكيلة اللاعبين ({enabledCount})</span>
              </button>

              <button
                onClick={() => scrollToSection('rules')}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'rules'
                    ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>3. الخرائط والقوانين</span>
              </button>
            </div>

            {/* Quick Scroll Indicator Helper */}
            <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-400">
              <span className="text-slate-500 font-mono">اسحب الشريط للتنقل</span>
              <button
                onClick={handleScrollDownOrUp}
                className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition-colors cursor-pointer"
                title={scrollProgress > 0.8 ? 'الصعود للأعلى' : 'النزول للأسفل'}
              >
                {scrollProgress > 0.8 ? (
                  <>
                    <ChevronUp className="w-3.5 h-3.5 text-sky-400" />
                    <span>للأعلى</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3.5 h-3.5 text-sky-400 animate-bounce" />
                    <span>للأسفل</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* C. SCROLLABLE CONTENT BODY (WITH CUSTOM NEON SCROLLBAR)        */}
        {/* ============================================================== */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="custom-scrollbar overflow-y-auto flex-1 px-5 sm:px-8 py-6 flex flex-col gap-8 scroll-smooth"
        >
          {/* ================= SECTION 1: GAME MODE SELECTOR ================= */}
          <div ref={modesSectionRef} className="scroll-mt-4">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
                <label className="text-xs font-black uppercase tracking-wider text-sky-400">
                  Select Game Mode (اختر نمط القتال)
                </label>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                النمط الحالي: <span className="text-white font-bold">{settings.mode}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {modes.map((m) => {
                const selected = settings.mode === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      onUpdateSettings({ mode: m.id });
                      setActiveTab('modes');
                    }}
                    className={`relative text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      selected
                        ? 'bg-slate-800/90 border-sky-400 ring-2 ring-sky-400/40 shadow-lg shadow-sky-950/40'
                        : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/40 hover:border-slate-700'
                    }`}
                  >
                    {m.badge && (
                      <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                        {m.badge}
                      </span>
                    )}
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <span className="p-1 rounded-lg bg-slate-800/80">{m.icon}</span>
                      <span className="text-xs font-bold text-white uppercase tracking-wide">
                        {m.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{m.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mode Highlights: Battle Royale / Infection / Teams */}
          {settings.mode === 'battle_royale' && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/50 via-slate-900 to-amber-950/40 border border-amber-500/40 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300">
                  <Swords className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                      Apex Battle Royale (ماب ضخم 2000px · حتى 6 مقاتلين)
                    </span>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full">
                      سلاح الفأس + عاصفة
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-200/80 leading-relaxed mt-0.5">
                    كاميرا ديناميكية تتتبع شخصيتك وتكبر/تصغر حسب سرعة القتال، مع سلاح الفأس الجديد وحدود الماب الواسعة.
                  </p>
                </div>
              </div>
              {settings.selectedMap !== 'grand_battle_royale' && (
                <button
                  onClick={() => onUpdateSettings({ selectedMap: 'grand_battle_royale' })}
                  className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all whitespace-nowrap shadow-sm cursor-pointer"
                >
                  اختيار ماب Apex Warzone الضخم
                </button>
              )}
            </div>
          )}

          {settings.mode === 'infection' && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/50 via-slate-900 to-emerald-950/40 border border-emerald-500/40 flex items-center gap-3.5 shadow-lg">
              <div className="p-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
                <Skull className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                  <span>Infection Mode (وضع الزومبي الصامد)</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                    بدون أسلحة · تفادي وقفز فقط
                  </span>
                </div>
                <p className="text-[11px] text-emerald-200/80 leading-relaxed mt-0.5">
                  يبدأ راوند القتال باختيار زومبي عشوائي. الزومبي يملك ضربة تحويل (2s Cooldown). الناجي الأخير الصامد يفوز بنقطة الجولة!
                </p>
              </div>
            </div>
          )}

          {settings.mode === 'team_deathmatch' && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/40 via-slate-900 to-blue-950/40 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-800 text-sky-400">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-white">
                      Team Setup: Red vs Blue
                    </span>
                    <span className="text-[11px] text-slate-400">(لا يوجد ضرر لأعضاء الفريق)</span>
                  </div>
                  <div className="text-xs mt-1 flex items-center gap-3 font-semibold">
                    <span className="text-red-400 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                      <span>الفريق الأحمر ({playerConfigs.filter((p) => p.enabled && p.team === 'red').length}):</span>
                      <span>
                        {playerConfigs
                          .filter((p) => p.enabled && p.team === 'red')
                          .map((p) => p.name)
                          .join(', ') || 'فارغ'}
                      </span>
                    </span>
                    <span className="text-slate-600">|</span>
                    <span className="text-blue-400 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                      <span>الفريق الأزرق ({playerConfigs.filter((p) => p.enabled && p.team === 'blue').length}):</span>
                      <span>
                        {playerConfigs
                          .filter((p) => p.enabled && p.team === 'blue')
                          .map((p) => p.name)
                          .join(', ') || 'فارغ'}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onUpdatePlayerConfig(1, { team: 'red' });
                    onUpdatePlayerConfig(2, { team: 'red' });
                    onUpdatePlayerConfig(3, { team: 'blue' });
                    onUpdatePlayerConfig(4, { team: 'blue' });
                  }}
                  className="px-3 py-1.5 text-[11px] font-bold text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors shadow-sm cursor-pointer"
                >
                  تقسيم تلقائي (P1+P2 ضد P3+P4)
                </button>
                <button
                  onClick={() => {
                    playerConfigs.forEach((p) => {
                      onUpdatePlayerConfig(p.id, { team: p.team === 'red' ? 'blue' : 'red' });
                    });
                  }}
                  className="px-3 py-1.5 text-[11px] font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors cursor-pointer"
                >
                  تبديل الفرق
                </button>
              </div>
            </div>
          )}

          {/* ================= SECTION 2: PLAYER ROSTER SETUP ================= */}
          <div ref={rosterSectionRef} className="scroll-mt-4 pt-4 border-t border-slate-800/80">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-400" />
                <label className="text-xs font-black uppercase tracking-wider text-sky-400">
                  Player Roster ({settings.mode === 'battle_royale' ? 'حتى 6 لاعبين' : '2 إلى 4 لاعبين'})
                </label>
                {settings.mode === 'battle_royale' && (
                  <span className="text-[10px] bg-amber-500/20 text-amber-400 font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                    6-PLAYERS READY
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-400">
                فعّل أو عطّل أي لاعب · واختر بين بشري (Human) أو ذكاء اصطناعي (CPU)
              </span>
            </div>

            <div
              className={`grid grid-cols-1 sm:grid-cols-2 ${
                settings.mode === 'battle_royale'
                  ? 'lg:grid-cols-3 xl:grid-cols-6'
                  : 'lg:grid-cols-4'
              } gap-3`}
            >
              {(settings.mode === 'battle_royale' ? playerConfigs : playerConfigs.slice(0, 4)).map(
                (cfg) => {
                  const currentBindings =
                    (keyBindings && keyBindings[cfg.id]) || DEFAULT_KEY_BINDINGS[cfg.id];
                  const controlsSummary = currentBindings
                    ? `${getKeyDisplayLabel(currentBindings.left)}/${getKeyDisplayLabel(
                        currentBindings.right
                      )} + ${getKeyDisplayLabel(currentBindings.attack)}`
                    : 'Custom';

                  return (
                    <div
                      key={cfg.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        cfg.enabled
                          ? settings.mode === 'team_deathmatch'
                            ? cfg.team === 'red'
                              ? 'bg-slate-950/90 border-red-500/60 shadow-lg shadow-red-950/30'
                              : 'bg-slate-950/90 border-blue-500/60 shadow-lg shadow-blue-950/30'
                            : 'bg-slate-950/80 border-slate-800 shadow-md'
                          : 'bg-slate-950/30 border-slate-900 opacity-50'
                      }`}
                    >
                      {/* Top Bar of Card */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3.5 h-3.5 rounded-full shadow-sm ring-2 ring-slate-800"
                            style={{ backgroundColor: cfg.color }}
                          />
                          <span className="font-bold text-xs uppercase tracking-wider text-white">
                            P{cfg.id}
                          </span>
                        </div>

                        {/* Enable / Disable toggle */}
                        <button
                          onClick={() => {
                            if (cfg.enabled && enabledCount <= 2) return;
                            onUpdatePlayerConfig(cfg.id, { enabled: !cfg.enabled });
                          }}
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border transition-colors cursor-pointer ${
                            cfg.enabled
                              ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20'
                              : 'text-slate-500 border-slate-800 bg-slate-900 hover:text-slate-300'
                          }`}
                        >
                          {cfg.enabled ? 'ACTIVE' : 'OFF'}
                        </button>
                      </div>

                      {/* Player Name Input */}
                      <div className="mb-3">
                        <input
                          type="text"
                          value={cfg.name}
                          maxLength={14}
                          onChange={(e) => onUpdatePlayerConfig(cfg.id, { name: e.target.value })}
                          disabled={!cfg.enabled}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-sky-400 font-semibold disabled:opacity-50"
                        />
                      </div>

                      {/* Type Selector: Human vs CPU */}
                      <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-lg border border-slate-800/80 mb-2">
                        <button
                          onClick={() => onUpdatePlayerConfig(cfg.id, { type: 'human' })}
                          disabled={!cfg.enabled}
                          className={`flex-1 flex items-center justify-center gap-1.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                            cfg.type === 'human'
                              ? 'bg-slate-800 text-white shadow-sm'
                              : 'text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          <User className="w-3 h-3" />
                          <span>Human</span>
                        </button>
                        <button
                          onClick={() => onUpdatePlayerConfig(cfg.id, { type: 'cpu' })}
                          disabled={!cfg.enabled}
                          className={`flex-1 flex items-center justify-center gap-1.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                            cfg.type === 'cpu'
                              ? 'bg-slate-800 text-sky-400 shadow-sm'
                              : 'text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          <Bot className="w-3 h-3" />
                          <span>CPU AI</span>
                        </button>
                      </div>

                      {/* Per-Bot Difficulty Selector */}
                      {cfg.type === 'cpu' && (
                        <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800 mb-2.5">
                          {(['easy', 'normal', 'hard'] as AIDifficulty[]).map((diff) => {
                            const active = (cfg.aiDifficulty || settings.aiDifficulty) === diff;
                            const label =
                              diff === 'easy' ? 'سهل' : diff === 'normal' ? 'عادي' : 'صعب';
                            const colorClass =
                              diff === 'easy'
                                ? active
                                  ? 'bg-emerald-500 text-white shadow-sm'
                                  : 'text-emerald-400/60 hover:text-emerald-300'
                                : diff === 'normal'
                                ? active
                                  ? 'bg-amber-500 text-white shadow-sm'
                                  : 'text-amber-400/60 hover:text-amber-300'
                                : active
                                ? 'bg-rose-500 text-white shadow-sm'
                                : 'text-rose-400/60 hover:text-rose-300';

                            return (
                              <button
                                key={diff}
                                onClick={() => onUpdatePlayerConfig(cfg.id, { aiDifficulty: diff })}
                                disabled={!cfg.enabled}
                                className={`flex-1 py-0.5 text-[10px] font-bold rounded transition-colors cursor-pointer ${colorClass}`}
                              >
                                {label}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* Team Selector if in Team Deathmatch mode */}
                      {settings.mode === 'team_deathmatch' && (
                        <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800 mb-2.5">
                          <button
                            onClick={() => onUpdatePlayerConfig(cfg.id, { team: 'red' })}
                            disabled={!cfg.enabled}
                            className={`flex-1 py-0.5 text-[11px] font-bold rounded transition-colors cursor-pointer ${
                              cfg.team === 'red'
                                ? 'bg-red-500 text-white shadow-sm'
                                : 'text-red-400/70 hover:text-red-300'
                            }`}
                          >
                            Red
                          </button>
                          <button
                            onClick={() => onUpdatePlayerConfig(cfg.id, { team: 'blue' })}
                            disabled={!cfg.enabled}
                            className={`flex-1 py-0.5 text-[11px] font-bold rounded transition-colors cursor-pointer ${
                              cfg.team === 'blue'
                                ? 'bg-blue-500 text-white shadow-sm'
                                : 'text-blue-400/70 hover:text-blue-300'
                            }`}
                          >
                            Blue
                          </button>
                        </div>
                      )}

                      {/* Controls hint */}
                      <div className="text-[11px] font-mono text-slate-500 text-center">
                        {cfg.type === 'human' ? controlsSummary : 'Automated Bot'}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>

          {/* ================= SECTION 3: ARENA MAP & MATCH RULES ================= */}
          <div ref={rulesSectionRef} className="scroll-mt-4 pt-4 border-t border-slate-800/80">
            <div className="flex items-center gap-2 mb-3.5">
              <MapPin className="w-4 h-4 text-sky-400" />
              <label className="text-xs font-black uppercase tracking-wider text-sky-400">
                Arena Map & Match Rules (حلبات القتال وقوانين الجولات)
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Arena Map Selection */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Arena Map (الحلبة)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(settings.mode === 'battle_royale'
                    ? MAPS
                    : MAPS.filter((m) => m.id !== 'grand_battle_royale')
                  ).map((m) => (
                    <button
                      key={m.id}
                      onClick={() => onUpdateSettings({ selectedMap: m.id })}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        settings.selectedMap === m.id
                          ? 'bg-slate-800 border-sky-400 text-white shadow-md'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-bold flex items-center justify-between">
                        <span>{m.name}</span>
                        {m.id === 'grand_battle_royale' && (
                          <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 py-0.5 rounded font-mono">
                            حصري BR
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5 font-mono">{m.width}x{m.height}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Bot Difficulty Selector (Global) */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Bot Difficulty (صعوبة الذكاء الاصطناعي)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    {
                      id: 'easy',
                      label: 'Easy (سهل)',
                      activeClass: 'bg-emerald-950/80 border-emerald-400 text-emerald-300',
                    },
                    {
                      id: 'normal',
                      label: 'Normal (عادي)',
                      activeClass: 'bg-amber-950/80 border-amber-400 text-amber-300',
                    },
                    {
                      id: 'hard',
                      label: 'Hard (صعب)',
                      activeClass: 'bg-rose-950/80 border-rose-400 text-rose-300',
                    },
                  ].map((diff) => (
                    <button
                      key={diff.id}
                      onClick={() => {
                        const d = diff.id as AIDifficulty;
                        onUpdateSettings({ aiDifficulty: d });
                        playerConfigs.forEach((p) => {
                          if (p.type === 'cpu') {
                            onUpdatePlayerConfig(p.id, { aiDifficulty: d });
                          }
                        });
                      }}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        settings.aiDifficulty === diff.id
                          ? `${diff.activeClass} font-bold shadow-md`
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="text-xs font-bold block">{diff.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* First to X Rounds */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Rounds to Victory (عدد الجولات للفوز)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[3, 5, 7].map((num) => (
                    <button
                      key={num}
                      onClick={() => onUpdateSettings({ roundsToWin: num })}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        settings.roundsToWin === num
                          ? 'bg-slate-800 border-amber-400 text-amber-300 font-bold shadow-md'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="text-xs font-mono">First to {num}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Bottom Play CTA */}
          <div className="pt-2 pb-1 flex items-center justify-between border-t border-slate-800/80">
            <span className="text-xs text-slate-400">
              جاهز للقتال؟ اضغط لبدء الجولة مع {enabledCount} مقاتلين
            </span>
            <button
              onClick={onStartGame}
              disabled={enabledCount < 2}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-black tracking-wider uppercase text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 disabled:opacity-40 rounded-xl shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Start Match</span>
            </button>
          </div>
        </div>

        {/* Scroll Progress Bar at the very bottom */}
        <div className="h-1 w-full bg-slate-950 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-sky-400 via-indigo-500 to-amber-400 transition-all duration-150"
            style={{ width: `${Math.max(5, Math.min(100, scrollProgress * 100))}%` }}
          />
        </div>
      </div>
    </div>
  );
};
