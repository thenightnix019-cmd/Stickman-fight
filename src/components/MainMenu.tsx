import React, { useState, useEffect } from 'react';
import {
  Play,
  Settings,
  LogOut,
  Volume2,
  VolumeX,
  Music,
  Maximize,
  Minimize,
  HelpCircle,
  Swords,
  Shield,
  Zap,
  ShoppingBag,
  Coins,
  Gem,
  KeyRound,
} from 'lucide-react';
import { sounds } from '../audio/soundEngine';
import { StickmanGamer, StickmanParkour } from './StickmanIcons';

interface MainMenuProps {
  onPlay: () => void;
  onOpenSettings: () => void;
  onOpenControls: () => void;
  onOpenShop: () => void;
  onOpenRedeemCode: () => void;
  coins?: number;
  gems?: number;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onPlay,
  onOpenSettings,
  onOpenControls,
  onOpenShop,
  onOpenRedeemCode,
  coins = 0,
  gems = 0,
}) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [musicOn, setMusicOn] = useState<boolean>(sounds.musicEnabled);
  const [showExitModal, setShowExitModal] = useState<boolean>(false);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleToggleMusic = () => {
    const nextState = sounds.toggleBGM();
    setMusicOn(nextState);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-6 sm:p-10 select-none overflow-hidden bg-slate-950 text-slate-100">
      {/* Background Cyberpunk Grid & Ambient Breathing Lights ("اضاءة تزول وتعود") */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b22_1px,transparent_1px),linear-gradient(to_bottom,#1e293b22_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute -top-20 left-1/4 w-[550px] h-[450px] bg-cyan-500/20 rounded-full animate-neon-cyan pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-[550px] h-[550px] bg-amber-500/20 rounded-full animate-neon-amber pointer-events-none" />
      <div className="absolute -bottom-20 left-10 w-[500px] h-[500px] bg-purple-600/20 rounded-full animate-neon-purple pointer-events-none" />

      {/* Background Stickmen Silhouettes */}
      <div className="absolute left-6 lg:left-16 bottom-20 text-cyan-400/25 animate-stickman-glow animate-stickman-float pointer-events-none hidden md:block">
        <svg width="220" height="260" viewBox="0 0 200 240" fill="none" stroke="currentColor">
          <path d="M 30 180 Q 90 20 185 70" stroke="#38bdf8" strokeWidth="4" strokeDasharray="4 2" />
          <circle cx="100" cy="50" r="18" strokeWidth="4" fill="#0369a1" />
          <circle cx="95" cy="48" r="2.5" fill="#e0f2fe" />
          <line x1="100" y1="68" x2="100" y2="125" strokeWidth="4.5" strokeLinecap="round" />
          <line x1="100" y1="80" x2="135" y2="45" strokeWidth="4" strokeLinecap="round" />
          <line x1="135" y1="45" x2="175" y2="25" strokeWidth="3.5" stroke="#7dd3fc" strokeLinecap="round" />
          <line x1="100" y1="85" x2="65" y2="95" strokeWidth="4" strokeLinecap="round" />
          <line x1="100" y1="125" x2="130" y2="160" strokeWidth="4.5" strokeLinecap="round" />
          <line x1="130" y1="160" x2="165" y2="185" strokeWidth="4" strokeLinecap="round" />
          <line x1="100" y1="125" x2="70" y2="155" strokeWidth="4.5" strokeLinecap="round" />
          <line x1="70" y1="155" x2="60" y2="200" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </div>

      <div className="absolute right-6 lg:right-16 top-24 text-amber-400/25 animate-stickman-glow pointer-events-none hidden md:block">
        <svg width="220" height="260" viewBox="0 0 220 260" fill="none" stroke="currentColor">
          <path d="M 60 40 Q 150 20 180 120" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" />
          <circle cx="110" cy="70" r="19" strokeWidth="4.5" fill="#78350f" />
          <line x1="110" y1="89" x2="105" y2="150" strokeWidth="5" strokeLinecap="round" />
          <line x1="50" y1="30" x2="155" y2="180" stroke="#d97706" strokeWidth="5.5" strokeLinecap="round" />
          <path d="M 50 30 Q 30 10 15 35 Q 35 55 55 45 Z" fill="#fbbf24" stroke="#f59e0b" strokeWidth="3" />
          <path d="M 55 25 Q 75 5 95 28 Q 75 50 50 35 Z" fill="#fbbf24" stroke="#f59e0b" strokeWidth="3" />
          <line x1="110" y1="100" x2="80" y2="70" strokeWidth="4.5" strokeLinecap="round" />
          <line x1="110" y1="105" x2="115" y2="120" strokeWidth="4.5" strokeLinecap="round" />
          <line x1="105" y1="150" x2="70" y2="185" strokeWidth="5" strokeLinecap="round" />
          <line x1="70" y1="185" x2="55" y2="230" strokeWidth="4.5" strokeLinecap="round" />
          <line x1="105" y1="150" x2="140" y2="185" strokeWidth="5" strokeLinecap="round" />
          <line x1="140" y1="185" x2="160" y2="230" strokeWidth="4.5" strokeLinecap="round" />
        </svg>
      </div>

      {/* Top Bar: Quick Utilities */}
      <header className="relative z-10 w-full max-w-6xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-mono tracking-widest text-slate-400 uppercase">
            STICK ARENA v2.5 • ONLINE PC READY
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Wallet / Shop Access in Header */}
          <button
            onClick={() => {
              sounds.playButton();
              onOpenShop();
            }}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-xs font-bold transition-all shadow-sm cursor-pointer"
            title="فتح متجر التخصيص"
          >
            <div className="flex items-center gap-1 text-amber-300 font-mono">
              <Coins className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>{coins}</span>
            </div>
            <div className="flex items-center gap-1 text-cyan-300 font-mono border-l border-slate-700 pl-2">
              <Gem className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400 animate-pulse" />
              <span>{gems}</span>
            </div>
            <span className="hidden lg:inline text-[11px] text-amber-400 font-sans ml-1">المتجر</span>
          </button>

          {/* Quick Promo Code Button in Header */}
          <button
            onClick={() => {
              sounds.playButton();
              onOpenRedeemCode();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 hover:text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            title="تفعيل كود الهدية"
          >
            <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">تفعيل كود</span>
          </button>

          {/* Background Music Quick Toggle */}
          <button
            onClick={handleToggleMusic}
            title={musicOn ? 'كتم الموسيقى' : 'تشغيل الموسيقى'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
              musicOn
                ? 'bg-purple-950/60 border-purple-500/40 text-purple-300 shadow-sm shadow-purple-500/20'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{musicOn ? 'BGM: ON' : 'BGM: OFF'}</span>
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'تصغير الشاشة' : 'ملء الشاشة'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-xs font-bold transition-all"
          >
            {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isFullscreen ? 'تصغير' : 'ملء الشاشة'}</span>
          </button>

          {/* Controls Quick Access */}
          <button
            onClick={onOpenControls}
            title="دليل أزرار التحكم"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-xs font-bold transition-all"
          >
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">أزرار التحكم</span>
          </button>
        </div>
      </header>

      {/* Hero Center: Title & Menu Actions */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center my-auto max-w-2xl w-full">
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-black tracking-widest uppercase mb-4 shadow-lg shadow-cyan-950/50">
          <Swords className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>حلبة القتال الأسطورية • 4 PLAYERS PC BRAWLER</span>
        </div>

        {/* Main Title */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400 drop-shadow-[0_15px_35px_rgba(6,182,212,0.35)] leading-tight mb-3">
          STICK ARENA
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-md mb-8 font-medium">
          معارك ستيك مان حماسية على شاشة واحدة! تفادى الأسلحة، اهزم الزومبي، واصمد حتى النهاية!
        </p>

        {/* Action Buttons Stack */}
        <div className="flex flex-col gap-3.5 w-full max-w-sm sm:max-w-md">
          {/* PLAY BUTTON (العب) */}
          <button
            onClick={() => {
              sounds.playButton();
              sounds.startBGM();
              onPlay();
            }}
            className="group relative flex items-center justify-center gap-3 w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-black text-lg sm:text-xl tracking-wider uppercase shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all border border-cyan-400/40 cursor-pointer"
          >
            <Play className="w-6 h-6 fill-white transition-transform group-hover:scale-110" />
            <span>العب الآن (PLAY)</span>
          </button>

          {/* SHOP BUTTON (المتجر) */}
          <button
            onClick={() => {
              sounds.playButton();
              onOpenShop();
            }}
            className="group relative flex items-center justify-center gap-3 w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-base sm:text-lg tracking-wider uppercase shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all border border-amber-300/60 cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5 fill-slate-950 transition-transform group-hover:scale-110" />
            <span>المتجر (SHOP)</span>
            <span className="text-[10px] bg-slate-950 text-amber-300 font-extrabold px-2.5 py-0.5 rounded-full ml-1 shadow-sm">
              قبعات • سكينات • أحذية
            </span>
          </button>

          {/* REDEEM CODE BUTTON (زر تفعيل كود في بداية اللعبة) */}
          <button
            onClick={() => {
              sounds.playButton();
              onOpenRedeemCode();
            }}
            className="group relative flex items-center justify-center gap-3 w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-base sm:text-lg tracking-wider uppercase shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all border border-emerald-300/60 cursor-pointer"
          >
            <KeyRound className="w-5 h-5 text-slate-950 transition-transform group-hover:rotate-12" />
            <span>تفعيل كود (REDEEM CODE)</span>
            <span className="text-[10px] bg-slate-950 text-emerald-300 font-extrabold px-2.5 py-0.5 rounded-full ml-1 shadow-sm">
              كود سري مجاناً
            </span>
          </button>

          {/* SETTINGS BUTTON (إعدادات) */}
          <button
            onClick={() => {
              sounds.playButton();
              onOpenSettings();
            }}
            className="flex items-center justify-center gap-3 w-full py-3.5 px-6 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-bold text-base tracking-wide border border-slate-700/80 hover:border-slate-600 shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all"
          >
            <Settings className="w-5 h-5 text-slate-400" />
            <span>الإعدادات (SETTINGS)</span>
          </button>

          {/* EXIT BUTTON (خروج من اللعبة) */}
          <button
            onClick={() => {
              sounds.playButton();
              setShowExitModal(true);
            }}
            className="flex items-center justify-center gap-3 w-full py-3.5 px-6 rounded-2xl bg-slate-950/80 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 font-bold text-base tracking-wide border border-slate-800/80 hover:border-rose-900/60 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>خروج من اللعبة (EXIT)</span>
          </button>
        </div>

        {/* Feature Highlights pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-8 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900/70 border border-slate-800 rounded-xl">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>وضع الزومبي (Infection Mode)</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900/70 border border-slate-800 rounded-xl">
            <Shield className="w-3.5 h-3.5 text-indigo-400" />
            <span>وضع الفرق (Team Deathmatch)</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900/70 border border-slate-800 rounded-xl">
            <Swords className="w-3.5 h-3.5 text-rose-400" />
            <span>حلبات وفوضى عشوائية</span>
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="relative z-10 w-full max-w-6xl flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2 border-t border-slate-900 pt-4">
        <div className="flex items-center gap-2">
          <StickmanGamer className="w-5 h-5 text-cyan-400 shrink-0" />
          <span>تدعم لوحة المفاتيح حتى 4 لاعبين محليين + بوتات ذكية</span>
        </div>
        <div className="flex items-center gap-2">
          <StickmanParkour className="w-5 h-5 text-indigo-400 shrink-0" />
          <span>باركور الجدران السريع متوفر في جميع الحلبات</span>
        </div>
      </footer>

      {/* Exit Confirmation Modal */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
              <LogOut className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-black text-white">هل تريد الخروج؟</h3>
            <p className="text-xs text-slate-400">
              شكراً للعبك ستيك أرينا! يمكنك إغلاق التبويب أو البقاء لخوض معركة جديدة.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowExitModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
              >
                البقاء واللعب
              </button>
              <button
                onClick={() => {
                  sounds.stopBGM();
                  window.close();
                  // Fallback if window.close blocked by browser sandbox
                  setShowExitModal(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors shadow-lg shadow-rose-600/30"
              >
                تأكيد الخروج
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
