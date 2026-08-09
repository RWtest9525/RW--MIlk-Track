import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Smartphone, Monitor, Sun, Moon, Sparkles, Shield, Zap, Heart } from 'lucide-react';

export const DeviceWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  const [deviceFrame, setDeviceFrame] = useState<boolean>(true);

  return (
    <div className={`min-h-screen w-full transition-colors duration-300 relative overflow-hidden ${
      theme === 'dark' ? 'bg-[#060911] text-slate-100' : 'bg-slate-100 text-slate-900'
    }`}>
      {/* Dynamic Background Mesh Gradients */}
      <div className={`fixed top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none transition-opacity duration-500 ${
        theme === 'dark' ? 'bg-cyan-500/10' : 'bg-cyan-400/20'
      }`} />
      <div className={`fixed bottom-0 right-1/4 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none transition-opacity duration-500 ${
        theme === 'dark' ? 'bg-emerald-500/10' : 'bg-emerald-400/20'
      }`} />

      {/* Desktop Web Outer Header Bar */}
      <header className="hidden md:flex items-center justify-between px-8 py-4 border-b border-white/10 backdrop-blur-xl bg-slate-950/20 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-cyan-500/30">
            🥛
          </div>
          <div>
            <span className="text-base font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
              MilkTrack 2026
            </span>
            <span className="text-[10px] text-slate-400 block font-medium">Daily Milk & WhatsApp Invoicing</span>
          </div>
        </div>

        {/* Desktop Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDeviceFrame(!deviceFrame)}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 border transition-all ${
              deviceFrame
                ? 'bg-cyan-500/15 border-cyan-400/40 text-cyan-300'
                : 'bg-slate-800/60 border-slate-700 text-slate-300'
            }`}
          >
            {deviceFrame ? <Smartphone size={15} /> : <Monitor size={15} />}
            {deviceFrame ? 'Mobile Phone Preview' : 'Full Desktop View'}
          </button>

          <button
            onClick={toggleTheme}
            className={`p-2.5 rounded-2xl border transition-all ${
              theme === 'dark'
                ? 'bg-slate-900 border-slate-700 text-amber-400'
                : 'bg-white border-slate-300 text-cyan-600'
            }`}
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </header>

      {/* Main Responsive Grid Container */}
      <div className="min-h-screen flex items-center justify-center p-0 md:p-6">
        {deviceFrame ? (
          /* Mobile Device Frame Mockup for Desktop */
          <div className="w-full max-w-[440px] min-h-screen md:min-h-[860px] md:h-[860px] bg-slate-950 rounded-none md:rounded-[48px] shadow-2xl shadow-cyan-950/50 border-0 md:border-[10px] md:border-slate-800/90 relative overflow-hidden flex flex-col transition-all duration-300">
            {/* Phone Notch / Speaker Island */}
            <div className="hidden md:flex items-center justify-between px-7 pt-3 pb-1 bg-[#060911] text-[11px] font-bold text-slate-400 z-50">
              <span>9:41</span>
              <div className="w-24 h-4 bg-slate-900 rounded-full mx-auto" />
              <div className="flex items-center gap-1">
                <Zap size={11} className="text-cyan-400" />
                <span>100%</span>
              </div>
            </div>

            {/* App Scrollable Viewport */}
            <div className="flex-1 overflow-y-auto relative custom-scrollbar flex flex-col">
              {children}
            </div>
          </div>
        ) : (
          /* Full Viewport Container */
          <div className="w-full max-w-xl min-h-screen bg-[#080C14] shadow-2xl rounded-3xl border border-white/10 overflow-hidden relative">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};
