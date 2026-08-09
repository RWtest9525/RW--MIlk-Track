import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMilk } from '../../context/MilkContext';
import { useTheme } from '../../context/ThemeContext';
import { ChevronDown, Store, Sun, Moon, Calendar as CalendarIcon, Sparkles } from 'lucide-react';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const Header: React.FC = () => {
  const { user } = useAuth();
  const { selectedMonth, setSelectedMonth } = useMilk();
  const { theme, toggleTheme } = useTheme();

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(e.target.value);
  };

  const monthOptions = [];
  const now = new Date();
  for (let i = -5; i <= 3; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
    monthOptions.push({ key, label });
  }

  return (
    <header className={`px-5 pt-5 pb-3 sticky top-0 z-30 border-b backdrop-blur-2xl transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-[#080C14]/90 border-white/5 text-slate-100' 
        : 'bg-white/90 border-slate-200/80 text-slate-900'
    }`}>
      <div className="flex items-center justify-between gap-2">
        {/* User Info & Avatar */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={user?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={user?.name}
              className="w-11 h-11 rounded-full border-2 border-cyan-400 object-cover shadow-md shadow-cyan-500/20"
            />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-white dark:border-[#080C14] rounded-full" />
          </div>

          <div>
            <div className="flex items-center gap-1">
              <h1 className="text-sm font-extrabold leading-tight">
                Hello, {user?.name.split(' ')[0]} 👋
              </h1>
            </div>
            
            {/* Vendor Chip */}
            <div className="flex items-center gap-1 text-[11px] text-cyan-600 dark:text-cyan-400 font-semibold mt-0.5">
              <Store size={12} className="text-cyan-500" />
              <span className="truncate max-w-[120px]">{user?.vendor.name}</span>
            </div>
          </div>
        </div>

        {/* Right Controls: Theme Switcher & Month Selector */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`w-9 h-9 rounded-2xl flex items-center justify-center border transition-all duration-200 cursor-pointer ${
              theme === 'dark'
                ? 'bg-slate-900 border-slate-700 text-amber-400 hover:bg-slate-800'
                : 'bg-slate-100 border-slate-300 text-cyan-600 hover:bg-slate-200'
            }`}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* Month Selector Pill */}
          <div className={`relative inline-flex items-center border rounded-2xl px-2.5 py-1.5 text-xs font-bold transition-colors ${
            theme === 'dark'
              ? 'bg-slate-900 border-slate-700 text-slate-200'
              : 'bg-slate-100 border-slate-300 text-slate-800'
          }`}>
            <CalendarIcon size={13} className="text-cyan-500 mr-1.5" />
            <select
              value={selectedMonth}
              onChange={handleMonthChange}
              className="bg-transparent focus:outline-none appearance-none pr-4 cursor-pointer text-xs font-bold"
            >
              {monthOptions.map((opt) => (
                <option key={opt.key} value={opt.key} className={theme === 'dark' ? 'bg-slate-900 text-slate-200' : 'bg-white text-slate-800'}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown size={13} className="absolute right-2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>
    </header>
  );
};
