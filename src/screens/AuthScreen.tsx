import React, { useState } from 'react';
import { SplashBottle3D } from '../components/3d/SplashBottle3D';
import { GlassButton } from '../components/common/GlassButton';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sparkles, Mail, Lock, User, LogIn, UserPlus, AlertCircle, ShieldCheck, Zap, MessageSquare } from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const { loginWithEmail, signUpWithEmail, loginWithGoogle } = useAuth();
  const { theme } = useTheme();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await loginWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password, name);
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setError(err?.message || 'Google sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8 md:p-12 relative overflow-hidden">
      {/* Background Lighting Orbs */}
      <div className={`fixed top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[150px] pointer-events-none ${
        theme === 'dark' ? 'bg-cyan-500/10' : 'bg-cyan-400/20'
      }`} />
      <div className={`fixed bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[150px] pointer-events-none ${
        theme === 'dark' ? 'bg-emerald-500/10' : 'bg-emerald-400/20'
      }`} />

      {/* Main Container Grid: 2-Column Desktop, 1-Column Mobile */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Left Hero Column */}
        <div className="md:col-span-7 space-y-6 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 px-4 py-1.5 rounded-full text-xs font-black text-cyan-400 shadow-lg backdrop-blur-md">
            <Sparkles size={14} className="text-cyan-400 animate-pulse" />
            MilkTrack 2026 Firebase Portal
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-white">
            Daily Milk Tracking & Auto Invoicing
          </h1>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-xl mx-auto md:mx-0">
            Log default daily deliveries automatically, handle date overrides, calculate monthly dues, and send formatted WhatsApp invoices to your vendor in 1-click.
          </p>

          {/* 3D Bottle Showcase */}
          <div className="py-2 flex justify-center md:justify-start">
            <div className="w-full max-w-xs">
              <SplashBottle3D height={220} />
            </div>
          </div>

          {/* Feature Badges */}
          <div className="grid grid-cols-3 gap-3 pt-2 max-w-lg mx-auto md:mx-0">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3 text-center">
              <ShieldCheck size={18} className="text-emerald-400 mx-auto mb-1" />
              <span className="text-[11px] font-bold text-slate-300 block">Cloud Firestore</span>
              <span className="text-[9px] text-slate-500">Real-time sync</span>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3 text-center">
              <MessageSquare size={18} className="text-cyan-400 mx-auto mb-1" />
              <span className="text-[11px] font-bold text-slate-300 block">WhatsApp Invoice</span>
              <span className="text-[9px] text-slate-500">1-click direct link</span>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3 text-center">
              <Zap size={18} className="text-amber-400 mx-auto mb-1" />
              <span className="text-[11px] font-bold text-slate-300 block">Date Overrides</span>
              <span className="text-[9px] text-slate-500">Custom quantity</span>
            </div>
          </div>
        </div>

        {/* Right Authentication Card */}
        <div className="md:col-span-5 w-full">
          <div className={`border backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 transition-colors ${
            theme === 'dark'
              ? 'bg-[#121A2B]/90 border-white/10 text-slate-100'
              : 'bg-white/95 border-slate-200 text-slate-900 shadow-slate-300/40'
          }`}>
            {/* Mode Switcher */}
            <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-900/80 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
                className={`py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Sign In
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setError(null);
                }}
                className={`py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Register
              </button>
            </div>

            {/* Google Login */}
            <button
              onClick={handleGoogle}
              disabled={loading}
              className="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-2xl text-xs font-extrabold text-slate-100 flex items-center justify-center gap-2.5 transition-all active:scale-95 cursor-pointer shadow-md"
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
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Continue with Google
            </button>

            <div className="flex items-center gap-3 my-2">
              <div className="h-px bg-slate-800 flex-1" />
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Or Email Login</span>
              <div className="h-px bg-slate-800 flex-1" />
            </div>

            {error && (
              <div className="bg-rose-500/15 border border-rose-500/30 p-3 rounded-2xl text-xs text-rose-400 flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Email / Password Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {mode === 'signup' && (
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-400 uppercase mb-1">Full Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      placeholder="e.g. Yash Vishal"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-900/90 border border-slate-800 rounded-2xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-extrabold text-slate-400 uppercase mb-1">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-900/90 border border-slate-800 rounded-2xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-slate-400 uppercase mb-1">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-900/90 border border-slate-800 rounded-2xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <GlassButton
                variant="primary"
                size="lg"
                className="w-full mt-2"
                loading={loading}
                icon={mode === 'login' ? <LogIn size={18} /> : <UserPlus size={18} />}
                type="submit"
              >
                {mode === 'login' ? 'Sign In to MilkTrack' : 'Create Firebase Account'}
              </GlassButton>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};
