import React, { useState } from 'react';
import { CalendarGrid } from '../components/calendar/CalendarGrid';
import { EditDateModal } from '../components/calendar/EditDateModal';
import { useMilk } from '../context/MilkContext';
import { CheckCircle2, XCircle, PlusCircle, Info } from 'lucide-react';

export const CalendarScreen: React.FC = () => {
  const { selectedMonth } = useMilk();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const [yearStr, monthStr] = selectedMonth.split('-');
  const dateObj = new Date(parseInt(yearStr, 10), parseInt(monthStr, 10) - 1, 1);
  const monthName = dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="p-5 space-y-5 pb-28 animate-fade-in">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100">{monthName}</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Tap any past or current date card to override milk quantity
          </p>
        </div>
      </div>

      {/* Legend Chips */}
      <div className="flex items-center justify-between bg-slate-900/80 border border-slate-800 rounded-2xl p-3 text-xs">
        <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
          <CheckCircle2 size={14} /> Delivered
        </div>

        <div className="flex items-center gap-1.5 text-rose-400 font-semibold">
          <XCircle size={14} /> Missed (0L)
        </div>

        <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
          <PlusCircle size={14} /> Custom Qty
        </div>
      </div>

      {/* Main Grid Calendar */}
      <div className="bg-[#131C2E]/80 border border-white/10 backdrop-blur-xl rounded-3xl p-4 shadow-xl">
        <CalendarGrid onSelectDate={(dStr) => setSelectedDate(dStr)} />
      </div>

      {/* Tip Banner */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-slate-400">
        <Info size={16} className="text-cyan-400 shrink-0 mt-0.5" />
        <span>
          Auto-logic automatically marks past & current days as delivered with your vendor default quantity. Future days remain disabled.
        </span>
      </div>

      {/* Edit Modal */}
      <EditDateModal
        isOpen={!!selectedDate}
        dateStr={selectedDate}
        onClose={() => setSelectedDate(null)}
      />
    </div>
  );
};
