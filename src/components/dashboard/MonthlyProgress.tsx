import React from 'react';
import { useMilk } from '../../context/MilkContext';
import { CheckCircle2, XCircle, TrendingUp } from 'lucide-react';

export const MonthlyProgress: React.FC = () => {
  const { invoice } = useMilk();

  const deliveredPct = Math.round((invoice.deliveredDays / Math.max(1, invoice.totalDays)) * 100);
  const missedPct = Math.round((invoice.missedDays / Math.max(1, invoice.totalDays)) * 100);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
          Delivery Overview
        </h3>
        <span className="text-xs text-emerald-700 font-extrabold flex items-center gap-1">
          <TrendingUp size={14} className="text-emerald-600" />
          {deliveredPct}% Delivery Success Rate
        </span>
      </div>

      {/* Visual Progress Multi-Bar */}
      <div className="h-3.5 w-full bg-slate-200 rounded-full overflow-hidden p-0.5 border border-slate-300 flex">
        <div
          style={{ width: `${deliveredPct}%` }}
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500 shadow-sm"
        />
        <div
          style={{ width: `${missedPct}%` }}
          className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all duration-500 shadow-sm"
        />
      </div>

      {/* Grid Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Delivered Days */}
        <div className="bg-emerald-50 border border-emerald-200/90 rounded-2xl p-3.5 flex items-center gap-3 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shrink-0">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <div className="text-xs text-emerald-900 font-extrabold">Delivered Days</div>
            <div className="text-base font-black text-emerald-700 mt-0.5">
              {invoice.deliveredDays} <span className="text-xs font-bold text-emerald-800">/ {invoice.totalDays} days</span>
            </div>
          </div>
        </div>

        {/* Missed Days */}
        <div className="bg-rose-50 border border-rose-200/90 rounded-2xl p-3.5 flex items-center gap-3 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-700 shrink-0">
            <XCircle size={20} />
          </div>
          <div>
            <div className="text-xs text-rose-900 font-extrabold">Missed Days</div>
            <div className="text-base font-black text-rose-700 mt-0.5">
              {invoice.missedDays} <span className="text-xs font-bold text-rose-800">days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
