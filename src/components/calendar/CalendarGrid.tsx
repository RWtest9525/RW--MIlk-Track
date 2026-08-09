import React from 'react';
import { DateCard } from './DateCard';
import { useMilk } from '../../context/MilkContext';
import { useAuth } from '../../context/AuthContext';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const CalendarGrid: React.FC<{ onSelectDate: (dateStr: string) => void }> = ({ onSelectDate }) => {
  const { selectedMonth, logs } = useMilk();
  const { user } = useAuth();

  const defaultQty = user?.vendor?.defaultDailyQuantity ?? 1.5;

  const [yearStr, monthStr] = selectedMonth.split('-');
  const year = parseInt(yearStr, 10);
  const monthIdx = parseInt(monthStr, 10) - 1;

  const firstDayOfWeek = new Date(year, monthIdx, 1).getDay();
  const totalDaysInMonth = new Date(year, monthIdx + 1, 0).getDate();

  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  // Allow editing from 1st of current selected month up to today
  const firstOfMonthStr = `${year}-${String(monthIdx + 1).padStart(2, '0')}-01`;

  const daysArray = Array.from({ length: totalDaysInMonth }, (_, i) => i + 1);
  const paddingArray = Array.from({ length: firstDayOfWeek }, (_, i) => i);

  return (
    <div className="space-y-3">
      {/* Weekday Labels Header */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-black text-slate-700 uppercase tracking-wider py-1.5 border-b border-slate-200">
        {WEEKDAYS.map((day) => (
          <div key={day} className="py-0.5">
            {day}
          </div>
        ))}
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {paddingArray.map((_, idx) => (
          <div key={`pad-${idx}`} className="h-20 bg-transparent" />
        ))}

        {daysArray.map((dayNum) => {
          const dateStr = `${year}-${String(monthIdx + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
          
          // Editable range: From 1st of month up to today!
          const isBeforeFirstOfMonth = dateStr < firstOfMonthStr;
          const isFuture = dateStr > todayStr;
          const isToday = dateStr === todayStr;
          const log = logs[dateStr];

          return (
            <DateCard
              key={dateStr}
              dayNumber={dayNum}
              dateStr={dateStr}
              isFuture={isFuture}
              isBeforeRegistration={isBeforeFirstOfMonth}
              isToday={isToday}
              log={log}
              defaultQty={defaultQty}
              onSelectDate={() => onSelectDate(dateStr)}
            />
          );
        })}
      </div>
    </div>
  );
};
