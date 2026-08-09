import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Shield } from 'lucide-react';

export const DeviceWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`min-h-screen w-full transition-colors duration-300 relative ${
      theme === 'dark' ? 'bg-[#060911] text-slate-100' : 'bg-slate-100 text-slate-900'
    }`}>
      {/* Background ambient lighting glows */}
      <div className={`fixed top-0 left-1/3 w-[600px] h-[600px] rounded-full blur-[150px] pointer-events-none transition-opacity duration-500 ${
        theme === 'dark' ? 'bg-cyan-500/10' : 'bg-cyan-400/15'
      }`} />
      <div className={`fixed bottom-0 right-1/3 w-[600px] h-[600px] rounded-full blur-[150px] pointer-events-none transition-opacity duration-500 ${
        theme === 'dark' ? 'bg-emerald-500/10' : 'bg-emerald-400/15'
      }`} />

      {/* Top Desktop Navbar */}
      <header className={`px-6 md:px-12 py-3.5 border-b backdrop-blur-2xl sticky top-0 z-50 flex items-center justify-between transition-colors ${
        theme === 'dark' 
          ? 'bg-[#080C14]/90 border-white/10 text-slate-100' 
          : 'bg-white/90 border-slate-200 text-slate-900 shadow-sm'
      }`}>
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="RW-Milk Tracker"
            className="w-9 h-9 rounded-full border-2 border-cyan-400 object-contain shadow-md bg-white p-0.5"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-300">
                RW-Milk Tracker
              </span>
              <span className="text-[10px] bg-cyan-500/20 text-cyan-400 font-extrabold px-2 py-0.5 rounded-full uppercase border border-cyan-500/30">
                Pro
              </span>
            </div>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-400 bg-slate-900/60 dark:bg-slate-900/80 px-3 py-1 rounded-full border border-slate-800">
            <Shield size={13} className="text-emerald-400" />
            <span>Firebase Synced</span>
          </div>

          <button
            onClick={toggleTheme}
            className={`px-3.5 py-1.5 rounded-2xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
              theme === 'dark'
                ? 'bg-slate-900 border-slate-700 text-amber-400 hover:bg-slate-800'
                : 'bg-slate-100 border-slate-300 text-cyan-600 hover:bg-slate-200'
            }`}
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            <span>{theme === 'dark' ? 'Light Theme' : 'Dark Theme'}</span>
          </button>
        </div>
      </header>

      {/* Main Full-Width Application Body */}
      <div className="max-w-6xl mx-auto min-h-[calc(100vh-80px)] p-0 sm:p-6 relative z-10">
        {children}
      </div>
    </div>
  );
};
