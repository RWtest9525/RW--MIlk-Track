import React from 'react';
import { Shield } from 'lucide-react';

export const DeviceWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] text-slate-900 transition-colors relative">
      {/* Top Desktop Navbar */}
      <header className="px-6 md:px-12 py-3.5 border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="RW-Milk Tracker"
            className="w-9 h-9 rounded-full border-2 border-[#0284C7] object-cover shadow-sm bg-white p-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black tracking-tight text-slate-900">
                RW-Milk Tracker
              </span>
              <span className="text-[10px] bg-cyan-100 text-cyan-800 font-extrabold px-2 py-0.5 rounded-full uppercase border border-cyan-200">
                Pro
              </span>
            </div>
          </div>
        </div>

        {/* Right Badge */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
          <Shield size={13} className="text-emerald-600" />
          <span>Firebase Synced</span>
        </div>
      </header>

      {/* Main Full-Width Application Body */}
      <div className="max-w-6xl mx-auto min-h-[calc(100vh-80px)] p-0 sm:p-6 relative z-10">
        {children}
      </div>
    </div>
  );
};
