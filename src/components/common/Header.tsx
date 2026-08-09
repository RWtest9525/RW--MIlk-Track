import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMilk } from '../../context/MilkContext';
import { ChevronDown, Calendar as CalendarIcon } from 'lucide-react';
import { ActiveTab } from '../../types';
import { getUserAvailableMonths } from '../../utils/dateUtils';

export const Header: React.FC<{ activeTab?: ActiveTab }> = ({ activeTab = 'dashboard' }) => {
  const { user } = useAuth();
  const { selectedMonth, setSelectedMonth } = useMilk();

  const monthOptions = getUserAvailableMonths(user?.createdAt);

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(e.target.value);
  };

  return (
    <header className="px-4 sm:px-6 py-2.5 sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs text-slate-900 print:hidden">
      <div className="flex items-center justify-between gap-2 max-w-7xl mx-auto">
        {/* App Logo & Company Brand Header */}
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="RW-Milk Tracker"
            className="w-10 h-10 rounded-full border-2 border-[#0284C7] object-cover shadow-sm bg-white p-0 shrink-0"
          />

          <div>
            <h1 className="text-sm font-black leading-tight text-slate-900 tracking-tight">
              RW-Milk Tracker
            </h1>
            <p className="text-[10px] font-extrabold text-[#0284C7]">
              Smart Dairy Logistics
            </p>
          </div>
        </div>

        {/* Month Selector Pill */}
        <div className="relative inline-flex items-center border border-slate-300 bg-slate-50 rounded-2xl px-3 py-1.5 text-xs font-bold text-slate-800 shadow-2xs">
          <CalendarIcon size={14} className="text-[#0284C7] mr-1.5" />
          <select
            value={selectedMonth}
            onChange={handleMonthChange}
            className="bg-transparent focus:outline-none appearance-none pr-4 cursor-pointer text-xs font-bold text-slate-800"
          >
            {monthOptions.map((opt) => (
              <option key={opt.key} value={opt.key} className="bg-white text-slate-900">
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-2 text-slate-500 pointer-events-none" />
        </div>
      </div>
    </header>
  );
};
