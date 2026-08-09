import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMilk } from '../../context/MilkContext';
import { ChevronDown, Store, UserCheck, Calendar as CalendarIcon } from 'lucide-react';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const Header: React.FC = () => {
  const { user } = useAuth();
  const { selectedMonth, setSelectedMonth } = useMilk();

  const currentYear = parseInt(selectedMonth.split('-')[0], 10);
  const currentMonthIdx = parseInt(selectedMonth.split('-')[1], 10) - 1;

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(e.target.value);
  };

  // Generate options for previous 6 months and next 3 months
  const monthOptions = [];
  const now = new Date();
  for (let i = -5; i <= 3; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
    monthOptions.push({ key, label });
  }

  return (
    <header className="px-5 pt-6 pb-4 bg-[#0B0F17]/90 backdrop-blur-lg sticky top-0 z-30 border-b border-white/5">
      <div className="flex items-center justify-between gap-3">
        {/* User Info & Avatar */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={user?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={user?.name}
              className="w-11 h-11 rounded-full border-2 border-cyan-400/40 object-cover shadow-md shadow-cyan-500/20"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#0B0F17] rounded-full" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-bold text-slate-100 leading-tight">
                Hello, {user?.name.split(' ')[0]} 👋
              </h1>
            </div>
            
            {/* Vendor Chip */}
            <div className="flex items-center gap-1 text-[11px] text-cyan-400 font-medium mt-0.5">
              <Store size={12} className="text-cyan-400" />
              <span className="truncate max-w-[130px]">{user?.vendor.name}</span>
            </div>
          </div>
        </div>

        {/* Month Selector Pill */}
        <div className="relative inline-flex items-center bg-slate-900/90 border border-slate-700/80 rounded-2xl px-3 py-2 text-xs font-semibold text-slate-200 shadow-md">
          <CalendarIcon size={14} className="text-cyan-400 mr-2" />
          <select
            value={selectedMonth}
            onChange={handleMonthChange}
            className="bg-transparent text-slate-200 focus:outline-none appearance-none pr-5 cursor-pointer text-xs font-semibold"
          >
            {monthOptions.map((opt) => (
              <option key={opt.key} value={opt.key} className="bg-slate-900 text-slate-200">
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 text-slate-400 pointer-events-none" />
        </div>
      </div>
    </header>
  );
};
