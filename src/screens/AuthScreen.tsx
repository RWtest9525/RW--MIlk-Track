import React, { useState } from 'react';
import { SplashBottle3D } from '../components/3d/SplashBottle3D';
import { GlassButton } from '../components/common/GlassButton';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Mail, Lock, LogIn, Play } from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const { loginWithDemo, loginWithEmail, loginWithGoogle } = useAuth();
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    await loginWithEmail(email, password);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] flex flex-col justify-between p-6 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header & 3D Glass Bottle Asset */}
      <div className="text-center pt-4 z-10">
        <div className="inline-flex items-center gap-2 bg-slate-900/80 border border-cyan-500/30 px-3.5 py-1.5 rounded-full text-xs font-extrabold text-cyan-300 shadow-lg backdrop-blur-md mb-2">
          <Sparkles size={14} className="text-cyan-400 animate-pulse" />
          MilkTrack 2026 Premium
        </div>

        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-emerald-300 to-white tracking-tight">
          Daily Milk Tracker & Invoicing
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
          Smart daily logs, date overrides, monthly dues & automated WhatsApp invoices
        </p>

        {/* 3D Bottle Render */}
        <div className="my-2">
          <SplashBottle3D height={210} />
        </div>
      </div>

      {/* Auth Card Form */}
      <div className="bg-[#131C2E]/90 border border-white/10 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl space-y-4 z-10 my-auto">
        {/* Fast Track Demo Button */}
        <GlassButton
          variant="primary"
          size="lg"
          className="w-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-400 text-slate-950 font-black shadow-lg shadow-cyan-500/30"
          icon={<Play size={18} fill="currentColor" />}
          onClick={loginWithDemo}
        >
          ⚡ Instant Demo Login
        </GlassButton>

        <div className="flex items-center gap-3 my-2">
          <div className="h-px bg-slate-800 flex-1" />
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Or Continue With</span>
          <div className="h-px bg-slate-800 flex-1" />
        </div>

        {/* Google OAuth Button */}
        <button
          onClick={loginWithGoogle}
          className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-2xl text-xs font-bold text-slate-200 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shadow-md"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Continue with Google
        </button>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-3 pt-2">
          <div>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <GlassButton
            variant="secondary"
            size="md"
            className="w-full"
            loading={loading}
            icon={<LogIn size={16} />}
            type="submit"
          >
            {tab === 'login' ? 'Email Login' : 'Create Account'}
          </GlassButton>
        </form>
      </div>

      <div className="text-center z-10 pt-2">
        <p className="text-[11px] text-slate-500">
          Powered by Firebase Cloud Firestore & React Native Expo
        </p>
      </div>
    </div>
  );
};
