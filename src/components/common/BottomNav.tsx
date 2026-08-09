import React from 'react';
import { ActiveTab } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { LayoutDashboard, Calendar, FileText, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const { theme } = useTheme();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={19} /> },
    { id: 'calendar', label: 'Calendar', icon: <Calendar size={19} /> },
    { id: 'invoice', label: 'Invoices', icon: <FileText size={19} /> },
    { id: 'profile', label: 'Settings', icon: <User size={19} /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40 px-4 pb-4 pt-1 pointer-events-none">
      <div className={`backdrop-blur-2xl border rounded-3xl p-1.5 shadow-2xl flex items-center justify-around pointer-events-auto transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-[#111827]/90 border-white/10 shadow-black/80'
          : 'bg-white/95 border-slate-200 shadow-slate-400/20'
      }`}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ActiveTab)}
              className={`flex-1 py-2 rounded-2xl flex flex-col items-center justify-center text-[10px] font-extrabold transition-all duration-200 cursor-pointer select-none ${
                isActive
                  ? theme === 'dark'
                    ? 'text-cyan-300 bg-cyan-500/15 border border-cyan-500/30 scale-105 shadow-md shadow-cyan-950/50'
                    : 'text-cyan-700 bg-cyan-50 border border-cyan-300 scale-105 shadow-sm shadow-cyan-100'
                  : theme === 'dark'
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className={`${isActive ? 'scale-110' : ''} transition-transform`}>
                {tab.icon}
              </div>
              <span className="mt-1">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
