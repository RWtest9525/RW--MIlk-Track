import React from 'react';
import { DailyLog } from '../../types';
import { Check, X, Plus, Edit2 } from 'lucide-react';

interface DateCardProps {
  dayNumber: number;
  dateStr: string;
  isFuture: boolean;
  isBeforeRegistration: boolean;
  isToday: boolean;
  log?: DailyLog;
  defaultQty: number;
  onSelectDate: () => void;
}

export const DateCard: React.FC<DateCardProps> = ({
  dayNumber,
  isFuture,
  isBeforeRegistration,
  isToday,
  log,
  onSelectDate,
}) => {
  const isUnlogged = !log && !isFuture && !isBeforeRegistration;
  const status = log?.status || (isFuture ? 'future' : isBeforeRegistration ? 'inactive' : 'unlogged');
  const qty = log ? log.quantity : 0;

  const isDisabled = isFuture || isBeforeRegistration;

  const getCardStyle = () => {
    if (isBeforeRegistration) {
      return 'bg-slate-100 border-slate-200 opacity-40 cursor-not-allowed text-slate-400';
    }
    if (isFuture) {
      return 'bg-slate-100 border-slate-200 opacity-50 cursor-not-allowed text-slate-400';
    }
    if (isUnlogged) {
      return 'bg-white border-dashed border-slate-300 text-slate-500 hover:border-[#0284C7] shadow-2xs';
    }
    if (status === 'missed') {
      return 'bg-rose-50 border-rose-300 text-rose-950 shadow-xs hover:border-rose-500';
    }
    if (status === 'custom') {
      return 'bg-amber-50 border-amber-300 text-amber-950 shadow-xs hover:border-amber-500';
    }
    // Delivered
    return 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-xs hover:border-emerald-500';
  };

  const getBadgeIcon = () => {
    if (isDisabled) return null;
    if (isUnlogged) {
      return <Plus size={11} className="text-slate-400 font-bold" />;
    }
    if (status === 'missed') {
      return <X size={11} className="text-rose-700 font-black stroke-[3]" />;
    }
    if (status === 'custom') {
      return <Plus size={11} className="text-amber-700 font-black stroke-[3]" />;
    }
    return <Check size={11} className="text-emerald-700 font-black stroke-[3]" />;
  };

  return (
    <div
      onClick={() => {
        if (!isDisabled) onSelectDate();
      }}
      className={`relative rounded-xl sm:rounded-2xl p-1.5 sm:p-2.5 flex flex-col justify-between h-16 sm:h-20 transition-all duration-200 border cursor-pointer select-none active:scale-95 group ${getCardStyle()}`}
    >
      {/* Today Indicator Pill */}
      {isToday && (
        <span className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-[#0284C7] text-white text-[8px] sm:text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full shadow-xs z-10 whitespace-nowrap">
          Today
        </span>
      )}

      {/* Date Number Header */}
      <div className="flex items-center justify-between">
        <span className={`text-xs sm:text-sm font-black leading-none ${isToday ? 'text-[#0284C7]' : 'text-slate-900'}`}>
          {dayNumber}
        </span>
        {!isDisabled && (
          <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-2xs shrink-0">
            {getBadgeIcon()}
          </div>
        )}
      </div>

      {/* Quantity Footer (Horizontal Clean Rendering) */}
      <div className="mt-auto flex items-center justify-center text-center">
        {isBeforeRegistration ? (
          <span className="text-[8px] sm:text-[9px] text-slate-400 font-bold">Join</span>
        ) : isFuture ? (
          <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium">--</span>
        ) : isUnlogged ? (
          <span className="text-[9px] sm:text-[10px] text-slate-500 font-black">0 L</span>
        ) : (
          <span className="text-[10px] sm:text-xs font-black tracking-tight whitespace-nowrap">
            {status === 'missed' ? (
              <span className="text-rose-600">0 L</span>
            ) : (
              <span className="text-slate-900">{qty.toFixed(1)}L</span>
            )}
          </span>
        )}
      </div>

      {/* Hover Edit Icon hint */}
      {!isDisabled && (
        <div className="absolute inset-0 bg-white/90 rounded-xl sm:rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Edit2 size={15} className="text-[#0284C7]" />
        </div>
      )}
    </div>
  );
};
