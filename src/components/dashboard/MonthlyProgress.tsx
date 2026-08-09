import React from 'react';
import { useMilk } from '../../context/MilkContext';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2, XCircle, IndianRupee, Clock, TrendingUp } from 'lucide-react';

export const MonthlyProgress: React.FC = () => {
  const { invoice } = useMilk();
  const { user } = useAuth();

  const deliveredPct = Math.round((invoice.deliveredDays / Math.max(1, invoice.totalDays)) * 100);
  const missedPct = Math.round((invoice.missedDays / Math.max(1, invoice.totalDays)) * 100);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
          Delivery Overview
        </h3>
        <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
          <TrendingUp size={13} className="text-emerald-400" />
          {deliveredPct}% Delivery Success Rate
        </span>
      </div>

      {/* Visual Progress Multi-Bar */}
      <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800 flex">
        <div
          style={{ width: `${deliveredPct}%` }}
          className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-500 shadow-sm shadow-emerald-500/50"
        />
        <div
          style={{ width: `${missedPct}%` }}
          className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all duration-500 shadow-sm shadow-rose-500/50"
        />
      </div>

      {/* Grid Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Delivered Days */}
        <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-2xl p-3.5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Delivered Days</div>
            <div className="text-base font-extrabold text-emerald-400 mt-0.5">
              {invoice.deliveredDays} <span className="text-xs font-semibold text-slate-400">/ {invoice.totalDays} days</span>
            </div>
          </div>
        </div>

        {/* Missed Days */}
        <div className="bg-rose-950/20 border border-rose-500/20 rounded-2xl p-3.5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
            <XCircle size={20} />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Missed Days</div>
            <div className="text-base font-extrabold text-rose-400 mt-0.5">
              {invoice.missedDays} <span className="text-xs font-semibold text-slate-400">days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rates & Slot Bar */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <IndianRupee size={14} className="text-cyan-400" />
          <span>Base Rate: <strong className="text-white">₹{user?.vendor.defaultPricePerLitre} / Litre</strong></span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400 border-l border-slate-800 pl-3">
          <Clock size={13} className="text-amber-400" />
          <span className="capitalize">{user?.vendor.preferredSlot || 'morning'} Slot</span>
        </div>
      </div>
    </div>
  );
};
