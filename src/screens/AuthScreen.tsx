import React, { useState } from 'react';
import { GlassButton } from '../components/common/GlassButton';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Mail, Lock, User, LogIn, UserPlus, AlertCircle, Sun, Moon } from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const { loginWithEmail, signUpWithEmail, loginWithGoogle } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your email and password.');
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
      setError(err?.message || 'Authentication failed. Please check your credentials.');
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
      setError(err?.message || 'Google sign in failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen w-full flex items-center justify-center p-4 sm:p-6 transition-colors duration-300 relative ${
      theme === 'dark' ? 'bg-[#060911] text-slate-100' : 'bg-slate-100 text-slate-900'
    }`}>
      {/* Top Right Theme Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={toggleTheme}
          className={`p-3 rounded-2xl border transition-all cursor-pointer shadow-md ${
            theme === 'dark'
              ? 'bg-slate-900 border-slate-700 text-amber-400 hover:bg-slate-800'
              : 'bg-white border-slate-300 text-cyan-600 hover:bg-slate-50'
          }`}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      {/* Main Clean Centered Login Card */}
      <div className="w-full max-w-md space-y-6 relative z-10 animate-fade-in">
        
        {/* Circular Logo Header */}
        <div className="text-center space-y-3">
          <div className="relative inline-block">
            <img
              src="/logo.png"
              alt="RW-Milk Tracker Logo"
              className="w-24 h-24 rounded-full mx-auto shadow-2xl border-4 border-cyan-400/40 object-contain p-0.5 bg-white transition-transform hover:scale-105"
            />
            <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-400 border-2 border-white rounded-full" />
          </div>

          <div>
            <h1 className={`text-2xl font-black tracking-tight ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              RW-Milk Tracker
            </h1>
            <p className={`text-xs mt-1 font-medium ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Daily Milk Tracking & Automated Invoicing
            </p>
          </div>
        </div>

        {/* Clean Auth Form Container */}
        <div className={`border rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 transition-colors ${
          theme === 'dark'
            ? 'bg-[#121A2B]/95 border-white/10 text-slate-100 shadow-black/80'
            : 'bg-white/95 border-slate-200 text-slate-900 shadow-slate-300/60'
        }`}>
          
          {/* Mode Switcher Tabs */}
          <div className={`grid grid-cols-2 gap-1.5 p-1 rounded-2xl border transition-colors ${
            theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
              }}
              className={`py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow-md'
                  : theme === 'dark' ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'
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
                  : theme === 'dark' ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Google OAuth Button */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            className={`w-full py-3 px-4 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2.5 transition-all active:scale-95 cursor-pointer border shadow-sm ${
              theme === 'dark'
                ? 'bg-slate-900 hover:bg-slate-800 border-slate-700/80 text-slate-100'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-300 text-slate-800'
            }`}
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

          <div className="flex items-center gap-3 my-1">
            <div className={`h-px flex-1 ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`} />
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold">Or Email</span>
            <div className={`h-px flex-1 ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`} />
          </div>

          {error && (
            <div className="bg-rose-500/15 border border-rose-500/30 p-3 rounded-2xl text-xs text-rose-400 flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Clean Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'signup' && (
              <div>
                <label className={`block text-[11px] font-bold uppercase mb-1 ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  Full Name
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Yash Vishal"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-2xl text-xs font-semibold focus:outline-none focus:border-cyan-500 ${
                      theme === 'dark'
                        ? 'bg-slate-900/90 border-slate-800 text-slate-100 placeholder-slate-500'
                        : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                    }`}
                  />
                </div>
              </div>
            )}

            <div>
              <label className={`block text-[11px] font-bold uppercase mb-1 ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-2xl text-xs font-semibold focus:outline-none focus:border-cyan-500 ${
                    theme === 'dark'
                      ? 'bg-slate-900/90 border-slate-800 text-slate-100 placeholder-slate-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-[11px] font-bold uppercase mb-1 ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-2xl text-xs font-semibold focus:outline-none focus:border-cyan-500 ${
                    theme === 'dark'
                      ? 'bg-slate-900/90 border-slate-800 text-slate-100 placeholder-slate-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>
            </div>

            <GlassButton
              variant="primary"
              size="lg"
              className="w-full mt-1 font-black"
              loading={loading}
              icon={mode === 'login' ? <LogIn size={17} /> : <UserPlus size={17} />}
              type="submit"
            >
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </GlassButton>
          </form>
        </div>

        {/* Subtle Footer */}
        <div className="text-center">
          <p className="text-[11px] text-slate-400 font-medium">
            Firebase Cloud Auth & Firestore Synced
          </p>
        </div>
      </div>
    </div>
  );
};
