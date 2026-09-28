import React, { useState, useEffect } from 'react';
import { X, Keyboard, Shield, Zap, Sparkles, RotateCcw, Check, Swords } from 'lucide-react';
import { PlayerId, PlayerKeyBindingsMap, PlayerKeyBinding } from '../types/game';
import { DEFAULT_KEY_BINDINGS, getKeyDisplayLabel } from '../engine/keybindings';

interface ControlsGuideProps {
  isOpen: boolean;
  onClose: () => void;
  keyBindings?: PlayerKeyBindingsMap;
  onUpdateKeyBindings?: (bindings: PlayerKeyBindingsMap) => void;
}

export const ControlsGuide: React.FC<ControlsGuideProps> = ({
  isOpen,
  onClose,
  keyBindings = DEFAULT_KEY_BINDINGS,
  onUpdateKeyBindings,
}) => {
  const [activeTab, setActiveTab] = useState<'controls' | 'weapons' | 'powerups' | 'events'>('controls');
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerId>(1);
  const [rebinding, setRebinding] = useState<{
    playerId: PlayerId;
    action: keyof PlayerKeyBinding;
  } | null>(null);

  // Keyboard capture when rebinding a key
  useEffect(() => {
    if (!rebinding || !onUpdateKeyBindings) return;

    const handleCaptureKey = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // Escape cancels rebinding
      if (e.key === 'Escape') {
        setRebinding(null);
        return;
      }

      const assignedCode = e.code || e.key;
      const updated = {
        ...keyBindings,
        [rebinding.playerId]: {
          ...keyBindings[rebinding.playerId],
          [rebinding.action]: assignedCode,
        },
      };

      onUpdateKeyBindings(updated);
      setRebinding(null);
    };

    window.addEventListener('keydown', handleCaptureKey, { capture: true });
    return () => window.removeEventListener('keydown', handleCaptureKey, { capture: true });
  }, [rebinding, keyBindings, onUpdateKeyBindings]);

  if (!isOpen) return null;

  const handleResetDefaults = () => {
    if (onUpdateKeyBindings) {
      onUpdateKeyBindings(DEFAULT_KEY_BINDINGS);
    }
  };

  const playerColors: Record<PlayerId, { name: string; color: string; border: string }> = {
    1: { name: 'Player 1 (Red)', color: '#ef4444', border: 'border-red-500/40' },
    2: { name: 'Player 2 (Blue)', color: '#3b82f6', border: 'border-blue-500/40' },
    3: { name: 'Player 3 (Green)', color: '#10b981', border: 'border-emerald-500/40' },
    4: { name: 'Player 4 (Gold)', color: '#f59e0b', border: 'border-amber-500/40' },
    5: { name: 'Player 5 (Purple)', color: '#a855f7', border: 'border-purple-500/40' },
    6: { name: 'Player 6 (Orange)', color: '#f97316', border: 'border-orange-500/40' },
  };

  const actionLabels: { key: keyof PlayerKeyBinding; labelEn: string; labelAr: string }[] = [
    { key: 'left', labelEn: 'Move Left', labelAr: 'التحرك لليسار' },
    { key: 'right', labelEn: 'Move Right', labelAr: 'التحرك لليمين' },
    { key: 'jump', labelEn: 'Jump / Double Jump', labelAr: 'القفز / قفز مزدوج' },
    { key: 'down', labelEn: 'Drop Down / Duck', labelAr: 'نزول من المنصة' },
    { key: 'attack', labelEn: 'Attack / Special Strike', labelAr: 'الهجوم / ضربة السلاح' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in select-none">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white uppercase tracking-wider">
                دليل التحكم وتخصيص الأزرار (CUSTOM CONTROLS)
              </h2>
              <p className="text-[11px] text-slate-400">
                يمكنك تخصيص وتغيير أحرف الكيبورد كما تشاء لجميع اللاعبين
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

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 p-2.5 bg-slate-950 border-b border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('controls')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'controls'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>تخصيص الكيبورد (Keybindings)</span>
          </button>
          <button
            onClick={() => setActiveTab('weapons')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'weapons'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            <span>الأسلحة (Weapons)</span>
          </button>
          <button
            onClick={() => setActiveTab('powerups')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'powerups'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>صناديق الطاقة (Power-Ups)</span>
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'events'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>أحداث الحلبة (Events)</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {activeTab === 'controls' && (
            <div className="space-y-4">
              {/* Player Selector Tabs (P1 to P6) */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {([1, 2, 3, 4, 5, 6] as PlayerId[]).map((pid) => {
                  const pInfo = playerColors[pid];
                  const isSel = selectedPlayer === pid;
                  return (
                    <button
                      key={pid}
                      onClick={() => setSelectedPlayer(pid)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                        isSel
                          ? 'bg-slate-800 text-white shadow-md border-cyan-400 ring-1 ring-cyan-400/40'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: pInfo.color }}
                      />
                      <span>P{pid}</span>
                    </button>
                  );
                })}

                <button
                  onClick={handleResetDefaults}
                  title="استعادة الأزرار الافتراضية للجميع"
                  className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden sm:inline">استعادة الافتراضي</span>
                </button>
              </div>

              {/* Current Player Key Configuration Card */}
              <div
                className={`p-5 rounded-2xl bg-slate-950/80 border ${playerColors[selectedPlayer].border} shadow-lg space-y-3`}
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-3.5 h-3.5 rounded-full"
                      style={{ backgroundColor: playerColors[selectedPlayer].color }}
                    />
                    <span className="font-black text-sm text-white">
                      أزرار تحكم: {playerColors[selectedPlayer].name}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    انقر على الزر لتغييره ثم اضغط أي مفتاح
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {actionLabels.map((act) => {
                    const currentBinding = keyBindings[selectedPlayer]?.[act.key] || '';
                    const isCapturing =
                      rebinding?.playerId === selectedPlayer && rebinding?.action === act.key;

                    return (
                      <div
                        key={act.key}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800/90"
                      >
                        <div>
                          <span className="text-xs font-bold text-white block">
                            {act.labelAr}
                          </span>
                          <span className="text-[10px] text-slate-400 block font-mono">
                            {act.labelEn}
                          </span>
                        </div>

                        <button
                          onClick={() => setRebinding({ playerId: selectedPlayer, action: act.key })}
                          className={`min-w-20 px-3 py-1.5 rounded-lg font-mono text-xs font-black transition-all border ${
                            isCapturing
                              ? 'bg-amber-500 text-slate-950 border-amber-300 animate-pulse shadow-md shadow-amber-500/40'
                              : 'bg-slate-800 text-cyan-300 border-slate-700 hover:border-cyan-400 hover:bg-slate-700'
                          }`}
                        >
                          {isCapturing ? 'اضغط مفتاحاً...' : getKeyDisplayLabel(currentBinding)}
                        </button>
                      </div>
                    );
                  })}
                </div>

                {rebinding && (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs text-center font-bold">
                    جاري الاستماع... اضغط أي مفتاح على الكيبورد لتعيينه، أو اضغط ESC للإلغاء
                  </div>
                )}
              </div>

              {/* Quick Summary Grid of All Players */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
                {([1, 2, 3, 4, 5, 6] as PlayerId[]).map((pid) => (
                  <div
                    key={pid}
                    className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] space-y-1"
                  >
                    <div className="flex items-center gap-1.5 font-bold text-slate-300">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: playerColors[pid].color }}
                      />
                      <span>P{pid}</span>
                    </div>
                    <div className="text-slate-400 font-mono text-[10px]">
                      {getKeyDisplayLabel(keyBindings[pid]?.left)} /{' '}
                      {getKeyDisplayLabel(keyBindings[pid]?.right)} · Jump:{' '}
                      {getKeyDisplayLabel(keyBindings[pid]?.jump)} · Atk:{' '}
                      <span className="text-amber-400 font-bold">
                        {getKeyDisplayLabel(keyBindings[pid]?.attack)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'weapons' && (
            <div className="space-y-3">
              {/* New Axe Weapon */}
              <div className="p-4 bg-gradient-to-r from-amber-950/40 to-slate-900 rounded-2xl border border-amber-500/40 flex items-start gap-3 shadow-md">
                <span className="text-2xl">🪓</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-black text-amber-400 uppercase tracking-wide">
                      Battleaxe (الفأس الحربي - جديد في باتل رويال)
                    </h4>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                      ضرر عنيف (42 DMG)
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    ضربة قاطعة ثقيلة تشق مساراً واسعاً، تسبب ضرراً هائلاً (42 دمج) مع ارتداد ودفع قوي يطيح بالخصوم خارج المنصات.
                  </p>
                </div>
              </div>

              {/* Sword */}
              <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800 flex items-start gap-3">
                <span className="text-xl">🗡️</span>
                <div>
                  <h4 className="text-sm font-bold text-white">Sword (السيف)</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    ضربة قوسية سريعة بضرر 26 مع القدرة على صد وتفجير مقذوفات الخصوم.
                  </p>
                </div>
              </div>

              {/* Gun */}
              <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800 flex items-start gap-3">
                <span className="text-xl">🔫</span>
                <div>
                  <h4 className="text-sm font-bold text-white">Blaster Gun (مسدس الليزر)</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    إطلاق رصاصات سريعة بعيدة المدى (15 دمج لكل طلقة) مع ارتداد بسيط للخلف.
                  </p>
                </div>
              </div>

              {/* Rocket Launcher */}
              <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800 flex items-start gap-3">
                <span className="text-xl">🚀</span>
                <div>
                  <h4 className="text-sm font-bold text-white">Rocket Launcher (قاذف الصواريخ)</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    صاروخ انفجاري هائل (45 دمج مباشر مع ضرر محيطي واسع واهتزاز شاشة).
                  </p>
                </div>
              </div>

              {/* Grapple Hook */}
              <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800 flex items-start gap-3">
                <span className="text-xl">🪝</span>
                <div>
                  <h4 className="text-sm font-bold text-white">Grapple Hook (خطاف السحب)</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    سحب الخصوم نحوك مباشرة أو التشبث بالمنصات المرتفعة للنجاة.
                  </p>
                </div>
              </div>

              {/* Magnet Pulse */}
              <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800 flex items-start gap-3">
                <span className="text-xl">🧲</span>
                <div>
                  <h4 className="text-sm font-bold text-white">Magnet Pulse (مغناطيس الدفع)</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    موجة دفع دائرية تبعد جميع الأعداء ومقذوفاتهم دفعة واحدة.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'powerups' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-950/70 rounded-xl border border-amber-500/30">
                <span className="text-lg">⭐</span>
                <h4 className="text-xs font-bold text-amber-400 mt-1 uppercase">Giant Mode</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  حجم مضاعف + زيادة المدى والضرر بنسبة 40% مع مقاومة الارتداد.
                </p>
              </div>

              <div className="p-3.5 bg-slate-950/70 rounded-xl border border-cyan-500/30">
                <span className="text-lg">⚡</span>
                <h4 className="text-xs font-bold text-cyan-400 mt-1 uppercase">Speed Boost</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  سرعة حركة مضاعفة وقفزات رشيقة جداً للمراوغة السريعة.
                </p>
              </div>

              <div className="p-3.5 bg-slate-950/70 rounded-xl border border-sky-500/30">
                <span className="text-lg">🛡️</span>
                <h4 className="text-xs font-bold text-sky-400 mt-1 uppercase">Energy Shield</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  فقاعة حماية زرقاء تمتص حتى 60 نقطة ضرر من جميع الهجمات.
                </p>
              </div>

              <div className="p-3.5 bg-slate-950/70 rounded-xl border border-pink-500/30">
                <span className="text-lg">🔥</span>
                <h4 className="text-xs font-bold text-pink-400 mt-1 uppercase">Combo 2X Multiplier</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  مضاعفة الضرر والارتداد مع كل ضربة متتالية سريعة.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'events' && (
            <div className="space-y-3">
              <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800">
                <h4 className="text-xs font-bold text-white uppercase">🌀 Reverse Gravity (انقلاب الجاذبية)</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  انعكاس الجاذبية للأعلى ليطير المقاتلون نحو السقف!
                </p>
              </div>
              <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800">
                <h4 className="text-xs font-bold text-white uppercase">💨 Gale Winds (رياح عاتية)</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  رياح شرسة تدفع جميع المقاتلين نحو حواف الحلبة.
                </p>
              </div>
              <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800">
                <h4 className="text-xs font-bold text-white uppercase">🌋 Magma Inferno (حمم نارية)</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  اشتعال منصات الحلبة بنيران حارقة تسبب ضرراً مستمراً.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">
            جميع التغييرات تُحفظ تلقائياً في المتصفح
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-md shadow-cyan-600/30"
          >
            إغلاق (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
