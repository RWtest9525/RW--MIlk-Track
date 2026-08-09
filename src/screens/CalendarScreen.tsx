import React, { useState } from 'react';
import { CalendarGrid } from '../components/calendar/CalendarGrid';
import { EditDateModal } from '../components/calendar/EditDateModal';
import { useMilk } from '../context/MilkContext';
import { CheckCircle2, XCircle, PlusCircle, RotateCcw } from 'lucide-react';

export const CalendarScreen: React.FC = () => {
  const { selectedMonth, clearMonthLogs } = useMilk();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [clearing, setClearing] = useState(false);

  const [yearStr, monthStr] = selectedMonth.split('-');
  const dateObj = new Date(parseInt(yearStr, 10), parseInt(monthStr, 10) - 1, 1);
  const monthName = dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const handleClearAll = async () => {
    if (window.confirm('Clear all logs for this month and reset all dates to 0 L?')) {
      setClearing(true);
      await clearMonthLogs();
      setClearing(false);
    }
  };

  return (
    <div className="space-y-5 pb-28 animate-fade-in max-w-4xl mx-auto">
      {/* Header Info with Reset Button */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-black text-slate-900">{monthName} Calendar</h2>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            Tap any date card to record or edit your daily milk delivery
          </p>
        </div>

        <button
          onClick={handleClearAll}
          disabled={clearing}
          className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-600 hover:text-rose-600 text-xs font-extrabold px-3 py-1.5 rounded-2xl transition-all cursor-pointer shadow-2xs shrink-0"
          title="Reset all month logs to 0 L"
        >
          <RotateCcw size={14} className={clearing ? 'animate-spin' : ''} />
          <span className="hidden sm:inline">Reset to 0 L</span>
        </button>
      </div>

      {/* Legend Chips (Delivered, Missed, Custom Qty) */}
      <div className="flex flex-wrap items-center justify-start gap-4 bg-white border border-slate-200 rounded-2xl p-3 text-xs shadow-xs">
        <div className="flex items-center gap-1.5 text-emerald-700 font-extrabold">
          <CheckCircle2 size={15} className="text-emerald-600" /> Delivered
        </div>

        <div className="flex items-center gap-1.5 text-rose-700 font-extrabold">
          <XCircle size={15} className="text-rose-600" /> Missed (0L)
        </div>

        <div className="flex items-center gap-1.5 text-amber-700 font-extrabold">
          <PlusCircle size={15} className="text-amber-600" /> Custom Qty
        </div>
      </div>

      {/* Main Grid Calendar Container */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-xl">
        <CalendarGrid onSelectDate={(dStr) => setSelectedDate(dStr)} />
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
