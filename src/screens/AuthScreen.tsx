import React, { useState } from 'react';
import { SplashBottle3D } from '../components/3d/SplashBottle3D';
import { GlassButton } from '../components/common/GlassButton';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sparkles, Mail, Lock, User, LogIn, UserPlus, AlertCircle } from 'lucide-react';

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
      setError(err?.message || 'Authentication failed. Please check credentials.');
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
    <div className="min-h-[85vh] flex flex-col justify-center items-center p-4 sm:p-6 relative">
      <div className="w-full max-w-md space-y-6">
        {/* Top Header & 3D Glass Milk Bottle */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 px-4 py-1.5 rounded-full text-xs font-black text-cyan-400 shadow-lg backdrop-blur-md">
            <Sparkles size={14} className="text-cyan-400 animate-pulse" />
            MilkTrack Firebase Authentication
          </div>

          <h1 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-white">
            Daily Milk Tracking & Invoices
          </h1>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Log daily deliveries, handle date overrides, calculate monthly bills & send automated WhatsApp invoices.
          </p>

          {/* 3D Bottle Asset */}
          <div className="py-2">
            <SplashBottle3D height={180} />
          </div>
        </div>

        {/* Card Form */}
        <div className={`border backdrop-blur-2xl rounded-3xl p-6 shadow-2xl space-y-5 transition-colors ${
          theme === 'dark'
            ? 'bg-[#121A2B]/90 border-white/10 text-slate-100'
            : 'bg-white/95 border-slate-200 text-slate-900 shadow-slate-300/40'
        }`}>
          {/* Mode Switcher */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900/60 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
              }}
              className={`py-2 text-xs font-extrabold rounded-xl transition-all ${
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
              className={`py-2 text-xs font-extrabold rounded-xl transition-all ${
                mode === 'signup'
                  ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Google OAuth Button */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-2xl text-xs font-bold text-slate-100 flex items-center justify-center gap-2.5 transition-all active:scale-95 cursor-pointer shadow-md"
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
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-extrabold">Or Email</span>
            <div className="h-px bg-slate-800 flex-1" />
          </div>

          {error && (
            <div className="bg-rose-500/15 border border-rose-500/30 p-3 rounded-2xl text-xs text-rose-400 flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'signup' && (
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Full Name</label>
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
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Email Address</label>
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
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Password</label>
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
              className="w-full"
              loading={loading}
              icon={mode === 'login' ? <LogIn size={18} /> : <UserPlus size={18} />}
              type="submit"
            >
              {mode === 'login' ? 'Sign In' : 'Create Firebase Account'}
            </GlassButton>
          </form>
        </div>
      </div>
    </div>
  );
};
