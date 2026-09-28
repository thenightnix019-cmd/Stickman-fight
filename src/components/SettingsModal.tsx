import React, { useState, useEffect } from 'react';
import { GameSettings, AIDifficulty } from '../types/game';
import { sounds } from '../audio/soundEngine';
import {
  Volume2,
  VolumeX,
  Music,
  Maximize,
  Minimize,
  Sliders,
  X,
  HelpCircle,
  Sparkles,
  Bot,
} from 'lucide-react';
import { StickmanGamer, StickmanParkour, StickmanHero } from './StickmanIcons';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onUpdateSettings: (updates: Partial<GameSettings>) => void;
  onOpenControls: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onOpenControls,
}) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [musicOn, setMusicOn] = useState<boolean>(sounds.musicEnabled);
  const [musicVol, setMusicVol] = useState<number>(Math.round(sounds.musicVolume * 100));

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  if (!isOpen) return null;

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

  const handleMusicVolumeChange = (val: number) => {
    setMusicVol(val);
    sounds.setMusicVolume(val / 100);
  };

  const handleToggleSound = () => {
    const next = !settings.soundEnabled;
    sounds.enabled = next;
    onUpdateSettings({ soundEnabled: next });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <StickmanGamer className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-wider">
                إعدادات اللعبة (SETTINGS)
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                تخصيص الصوت، حجم الشاشة، ومستوى التحدي
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings List */}
        <div className="space-y-5">
          {/* Fullscreen Option */}
          <div className="flex items-center justify-between p-3.5 bg-slate-950/70 border border-slate-800/80 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
              </div>
              <div>
                <span className="text-sm font-bold text-white block">حجم الشاشة (Fullscreen)</span>
                <span className="text-[11px] text-slate-400 block">
                  تشغيل اللعبة بملء شاشة الحاسوب لتجربة لعب مثالية
                </span>
              </div>
            </div>
            <button
              onClick={toggleFullscreen}
              className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                isFullscreen
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
              <span>{isFullscreen ? 'تصغير الشاشة' : 'ملء الشاشة'}</span>
            </button>
          </div>

          {/* Background Music Option */}
          <div className="p-3.5 bg-slate-950/70 border border-slate-800/80 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Music className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-bold text-white block">
                    موسيقى الخلفية (BGM)
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    موسيقى أركيد تفاعلية وحماسية
                  </span>
                </div>
              </div>
              <button
                onClick={handleToggleMusic}
                className={`px-4 py-1.5 rounded-xl font-bold text-xs transition-all ${
                  musicOn
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {musicOn ? 'مفعّلة (ON)' : 'معطّلة (OFF)'}
              </button>
            </div>

            {/* Volume slider */}
            {musicOn && (
              <div className="flex items-center gap-3 pt-1 border-t border-slate-800/60">
                <span className="text-[11px] text-slate-400 font-mono w-16">
                  الصوت: {musicVol}%
                </span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={musicVol}
                  onChange={(e) => handleMusicVolumeChange(Number(e.target.value))}
                  className="flex-1 accent-purple-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Sound Effects Option */}
          <div className="flex items-center justify-between p-3.5 bg-slate-950/70 border border-slate-800/80 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </div>
              <div>
                <span className="text-sm font-bold text-white block">
                  المؤثرات الصوتية (SFX)
                </span>
                <span className="text-[11px] text-slate-400 block">
                  أصوات القفز، اللكمات، الأسلحة والانفجارات
                </span>
              </div>
            </div>
            <button
              onClick={handleToggleSound}
              className={`px-4 py-1.5 rounded-xl font-bold text-xs transition-all ${
                settings.soundEnabled
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {settings.soundEnabled ? 'مفعّلة (ON)' : 'معطّلة (OFF)'}
            </button>
          </div>

          {/* Bot Difficulty Selector */}
          <div className="p-3.5 bg-slate-950/70 border border-slate-800/80 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <Bot className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold uppercase text-slate-300">
                صعوبة البوتات الافتراضية (Bot Difficulty)
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'easy', label: 'Easy (سهل جداً)', activeClass: 'bg-emerald-600 text-white border-emerald-400' },
                { id: 'normal', label: 'Normal (عادي)', activeClass: 'bg-amber-600 text-white border-amber-400' },
                { id: 'hard', label: 'Hard (صعب)', activeClass: 'bg-rose-600 text-white border-rose-400' },
              ].map((diff) => (
                <button
                  key={diff.id}
                  onClick={() => onUpdateSettings({ aiDifficulty: diff.id as AIDifficulty })}
                  className={`py-2 px-1 rounded-xl text-center text-xs font-bold border transition-all ${
                    settings.aiDifficulty === diff.id
                      ? `${diff.activeClass} shadow-md`
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {diff.label}
                </button>
              ))}
            </div>
          </div>

          {/* Controls Quick Access */}
          <div className="pt-2">
            <button
              onClick={() => {
                onClose();
                onOpenControls();
              }}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700/80 text-slate-200 border border-slate-700 rounded-2xl font-bold text-xs flex items-center justify-center gap-2.5 transition-all"
            >
              <StickmanParkour className="w-5 h-5 text-cyan-400 shrink-0" />
              <span>عرض أزرار التحكم وحركات القتال (Controls Guide)</span>
            </button>
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-6 pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-black text-sm uppercase tracking-wider rounded-2xl transition-all shadow-lg shadow-cyan-600/25"
          >
            حفظ وإغلاق (Save & Close)
          </button>
        </div>
      </div>
    </div>
  );
};
