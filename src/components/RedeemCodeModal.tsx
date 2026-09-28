import React, { useState } from 'react';
import { PlayerWallet } from '../types/shop';
import { redeemPromoCode } from '../services/shopStorage';
import { sounds } from '../audio/soundEngine';
import { KeyRound, X, Sparkles, CheckCircle, AlertCircle, Coins, Gem } from 'lucide-react';

interface RedeemCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: PlayerWallet;
  onUpdateWallet: (wallet: PlayerWallet) => void;
}

export const RedeemCodeModal: React.FC<RedeemCodeModalProps> = ({
  isOpen,
  onClose,
  onUpdateWallet,
}) => {
  const [code, setCode] = useState<string>('');
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
    coins?: number;
    gems?: number;
  }>({ type: null, message: '' });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    const result = redeemPromoCode(code);

    if (result.success && result.newWallet) {
      onUpdateWallet(result.newWallet);
      sounds.playPowerUp();
      setStatus({
        type: 'success',
        message: result.message,
        coins: result.coinsAwarded,
        gems: result.gemsAwarded,
      });
      setCode('');
    } else {
      sounds.playPunch();
      setStatus({
        type: 'error',
        message: result.message,
      });
    }
  };

  const handleClose = () => {
    setCode('');
    setStatus({ type: null, message: '' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md select-none animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-[0_0_50px_rgba(0,0,0,0.85)] flex flex-col text-center overflow-hidden">
        {/* Ambient neon decorative background light */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 left-4 p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
          title="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Title */}
        <div className="flex flex-col items-center justify-center pt-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 via-sky-500/10 to-purple-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-3 shadow-lg">
            <KeyRound className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-black text-white tracking-wide">تفعيل كود المكافآت</h3>
          <p className="text-xs text-slate-400 mt-1">
            أدخل كود الهدية السري للحصول على مكافآت وجواهر مجانية
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div className="relative">
            <input
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                if (status.type) setStatus({ type: null, message: '' });
              }}
              placeholder="اكتب الكود هنا..."
              autoFocus
              className="w-full px-4 py-3 bg-slate-950/90 border border-slate-700 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 rounded-2xl text-center text-sm font-mono tracking-wider text-white placeholder-slate-500 outline-none transition-all shadow-inner"
            />
          </div>

          {/* Feedback status message */}
          {status.type === 'error' && (
            <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs font-bold animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{status.message}</span>
            </div>
          )}

          {status.type === 'success' && (
            <div className="flex flex-col items-center gap-2 p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold animate-fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{status.message}</span>
              </div>
              <div className="flex items-center gap-4 mt-1 font-mono text-sm">
                <div className="flex items-center gap-1.5 text-amber-300">
                  <Coins className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>+{status.coins} نقود</span>
                </div>
                <div className="flex items-center gap-1.5 text-cyan-300">
                  <Gem className="w-4 h-4 text-cyan-400 fill-cyan-400 animate-pulse" />
                  <span>+{status.gems} جوهرة</span>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-amber-500/25 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>تفعيل الكود</span>
          </button>
        </form>
      </div>
    </div>
  );
};
