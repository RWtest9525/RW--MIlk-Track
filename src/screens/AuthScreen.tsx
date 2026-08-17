import React, { useState } from 'react';
import { GlassButton } from '../components/common/GlassButton';
import { LegalModal, LegalType } from '../components/common/LegalModal';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, LogIn, UserPlus, AlertCircle, Eye, EyeOff } from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const { loginWithEmail, signUpWithEmail, loginWithGoogle } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Legal Modal State
  const [legalModalType, setLegalModalType] = useState<LegalType | null>(null);

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
    <div className="min-h-screen w-full flex flex-col justify-between items-center p-4 sm:p-6 bg-[#F8FAFC] text-slate-900 relative">
      
      <div />

      {/* Clean Centered Login Card */}
      <div className="w-full max-w-md space-y-6 relative z-10 animate-fade-in my-auto">
        
        {/* Flush Circular Logo Header */}
        <div className="text-center space-y-3">
          <div className="inline-block relative">
            <div className="w-36 h-36 rounded-full mx-auto shadow-2xl border-4 border-[#0284C7] overflow-hidden p-0 bg-white transition-transform hover:scale-105">
              <img
                src="/logo.png"
                alt="RW-Milk Tracker Logo"
                loading="eager"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              RW-Milk Tracker
            </h1>
            <p className="text-xs mt-1 font-semibold text-slate-500">
              Daily Milk Tracking & Automated Invoicing
            </p>
          </div>
        </div>

        {/* Clean Light Theme Form Container */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/60 space-y-5">
          
          {/* Segmented Mode Switcher Tabs */}
          <div className="grid grid-cols-2 gap-1.5 p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
              }}
              className={`py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-gradient-to-r from-[#0284C7] to-[#0EA5E9] text-white shadow-md shadow-cyan-500/20'
                  : 'text-slate-500 hover:text-slate-900'
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
                  ? 'bg-gradient-to-r from-[#0284C7] to-[#0EA5E9] text-white shadow-md shadow-cyan-500/20'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Premium Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-3 transition-all active:scale-98 cursor-pointer bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 shadow-sm hover:shadow-md"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.37 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.45.38-2.27V6.58H1.29C.47 8.2.01 10.04.01 12c0 1.96.46 3.8 1.28 5.42l3.99-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="flex items-center gap-3 my-1">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold">Or Email</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 p-3 rounded-2xl text-xs text-rose-600 flex items-center gap-2 font-semibold">
              <AlertCircle size={15} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'signup' && (
              <div>
                <label className="block text-[11px] font-extrabold uppercase mb-1 text-slate-600">
                  Full Name
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Yash Vishal"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0284C7]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-extrabold uppercase mb-1 text-slate-600">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0284C7]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-extrabold uppercase mb-1 text-slate-600">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0284C7]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1 transition-colors"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <GlassButton
              variant="primary"
              size="lg"
              className="w-full mt-2 font-black py-3.5 shadow-lg shadow-cyan-500/25"
              loading={loading}
              icon={mode === 'login' ? <LogIn size={17} /> : <UserPlus size={17} />}
              type="submit"
            >
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </GlassButton>
          </form>
        </div>
      </div>

      {/* Play Store Compliant Legal Footer Links */}
      <footer className="py-4 text-center z-10">
        <div className="flex items-center justify-center gap-3 text-[11px] font-bold text-slate-500">
          <button
            onClick={() => setLegalModalType('terms')}
            className="hover:text-[#0284C7] hover:underline transition-colors"
          >
            Terms & Conditions
          </button>
          <span>•</span>
          <button
            onClick={() => setLegalModalType('privacy')}
            className="hover:text-[#0284C7] hover:underline transition-colors"
          >
            Privacy Policy
          </button>
          <span>•</span>
          <button
            onClick={() => setLegalModalType('about')}
            className="hover:text-[#0284C7] hover:underline transition-colors"
          >
            About Us
          </button>
        </div>
      </footer>

      {/* Play Store Legal Document Modal */}
      <LegalModal
        isOpen={Boolean(legalModalType)}
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />
    </div>
  );
};
