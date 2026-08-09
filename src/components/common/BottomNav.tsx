import React from 'react';
import { ActiveTab } from '../../types';
import { LayoutDashboard, Calendar, FileText, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={19} /> },
    { id: 'calendar', label: 'Calendar', icon: <Calendar size={19} /> },
    { id: 'invoice', label: 'Invoices', icon: <FileText size={19} /> },
    { id: 'profile', label: 'Settings', icon: <User size={19} /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40 px-4 pb-4 pt-1 pointer-events-none">
      <div className="bg-white/95 border border-slate-200 rounded-3xl p-1.5 shadow-xl shadow-slate-300/50 flex items-center justify-around pointer-events-auto backdrop-blur-md">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ActiveTab)}
              className={`flex-1 py-2 rounded-2xl flex flex-col items-center justify-center text-[10px] font-black transition-all duration-200 cursor-pointer select-none ${
                isActive
                  ? 'text-[#0284C7] bg-cyan-50 border border-cyan-200 scale-105 shadow-sm'
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
