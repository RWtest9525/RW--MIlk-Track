import React from 'react';
import { DailyLog } from '../../types';
import { Check, X, Plus, Edit2 } from 'lucide-react';

interface DateCardProps {
  dayNumber: number;
  dateStr: string;
  isFuture: boolean;
  isToday: boolean;
  log?: DailyLog;
  defaultQty: number;
  onSelectDate: () => void;
}

export const DateCard: React.FC<DateCardProps> = ({
  dayNumber,
  isFuture,
  isToday,
  log,
  defaultQty,
  onSelectDate,
}) => {
  const status = log?.status || (isFuture ? 'future' : 'delivered');
  const qty = log ? log.quantity : (isFuture ? 0 : defaultQty);

  const getCardStyle = () => {
    if (isFuture) {
      return 'bg-slate-900/40 border-slate-800/40 opacity-40 cursor-not-allowed';
    }
    if (status === 'missed') {
      return 'bg-rose-950/30 border-rose-500/40 text-rose-300 shadow-md shadow-rose-950/40 hover:border-rose-400';
    }
    if (status === 'custom') {
      return 'bg-amber-950/30 border-amber-500/40 text-amber-300 shadow-md shadow-amber-950/40 hover:border-amber-400';
    }
    // Delivered (default green)
    return 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300 shadow-md shadow-emerald-950/40 hover:border-emerald-400';
  };

  const getBadgeIcon = () => {
    if (isFuture) return null;
    if (status === 'missed') {
      return <X size={13} className="text-rose-400 font-bold stroke-[3]" />;
    }
    if (status === 'custom') {
      return <Plus size={13} className="text-amber-400 font-bold stroke-[3]" />;
    }
    return <Check size={13} className="text-emerald-400 font-bold stroke-[3]" />;
  };

  return (
    <div
      onClick={() => {
        if (!isFuture) onSelectDate();
      }}
      className={`relative rounded-2xl p-2.5 flex flex-col justify-between h-20 transition-all duration-200 border cursor-pointer select-none active:scale-95 group ${getCardStyle()}`}
    >
      {/* Today Indicator Pill */}
      {isToday && (
        <span className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 bg-cyan-400 text-slate-950 text-[9px] font-black uppercase px-2 py-0.2 rounded-full shadow-md z-10">
          Today
        </span>
      )}

      {/* Date Number Header */}
      <div className="flex items-center justify-between">
        <span className={`text-sm font-extrabold ${isToday ? 'text-cyan-300 font-black' : 'text-slate-200'}`}>
          {dayNumber}
        </span>
        <div className="w-5 h-5 rounded-full bg-slate-950/60 flex items-center justify-center">
          {getBadgeIcon()}
        </div>
      </div>

      {/* Quantity & Notes Footer */}
      <div className="mt-auto">
        {!isFuture ? (
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-tight">
              {status === 'missed' ? (
                <span className="text-rose-400">0 L</span>
              ) : (
                <span>{qty.toFixed(1)} L</span>
              )}
            </span>

            {log?.notes && (
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" title={log.notes} />
            )}
          </div>
        ) : (
          <span className="text-[10px] text-slate-600 font-medium">--</span>
        )}
      </div>

      {/* Hover Edit Icon hint */}
      {!isFuture && (
        <div className="absolute inset-0 bg-slate-900/80 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs">
          <Edit2 size={16} className="text-cyan-300" />
        </div>
      )}
    </div>
  );
};
