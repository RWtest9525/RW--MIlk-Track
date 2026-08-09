import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { GlassButton } from '../components/common/GlassButton';
import { Trash2, AlertTriangle, ShieldCheck, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const DeleteAccountScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { user, deleteAccountData } = useAuth();
  const [confirmText, setConfirmText] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmText.trim().toUpperCase() !== 'DELETE') return;
    setLoading(true);
    try {
      await deleteAccountData();
      setSuccess(true);
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5 pb-28 animate-fade-in max-w-xl mx-auto">
      
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-black text-slate-600 hover:text-[#0284C7] transition-colors cursor-pointer py-1"
      >
        <ArrowLeft size={16} />
        <span>Back to Settings</span>
      </button>

      {/* Main Container */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl space-y-5">
        
        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
            <Trash2 size={24} />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900">Delete Account & Data</h2>
            <p className="text-xs font-semibold text-slate-500">Google Play Store Data Safety & Deletion Policy</p>
          </div>
        </div>

        {/* Warning Info */}
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-xs text-rose-800 space-y-2">
          <div className="flex items-center gap-2 font-black text-rose-900">
            <AlertTriangle size={18} className="text-rose-600 shrink-0" />
            <span>Permanent Action Warning</span>
          </div>
          <p className="leading-relaxed">
            Deleting your account will permanently remove all your daily milk delivery logs, vendor rates, override history, and monthly invoices associated with account <strong>{user?.email || user?.uid}</strong> from Cloud Firestore.
          </p>
        </div>

        {/* Play Store Info Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-700 space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <ShieldCheck size={16} className="text-[#0284C7]" />
            <span>Play Store Compliance Information</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-600">
            Pursuant to Google Play Data Deletion Policy, users can request full deletion of their account records at any time. Once confirmed, cached records are deleted and authentication tokens revoked.
          </p>
        </div>

        {/* Confirmation Form */}
        {success ? (
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-center space-y-2 text-emerald-800">
            <CheckCircle2 size={32} className="mx-auto text-emerald-600" />
            <h4 className="font-black text-sm">Account Deletion Complete</h4>
            <p className="text-xs">Your account and data have been wiped. You are logged out.</p>
          </div>
        ) : (
          <form onSubmit={handleDelete} className="space-y-4 pt-2">
            <div>
              <label className="block text-[11px] font-extrabold uppercase mb-1 text-slate-700">
                Type <span className="text-rose-600">DELETE</span> to confirm
              </label>
              <input
                type="text"
                placeholder="DELETE"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-black text-slate-900 focus:outline-none focus:border-rose-500"
              />
            </div>

            <GlassButton
              variant="danger"
              size="lg"
              className="w-full font-black py-3.5"
              disabled={confirmText.trim().toUpperCase() !== 'DELETE'}
              loading={loading}
              type="submit"
            >
              Permanently Delete My Account
            </GlassButton>
          </form>
        )}
      </div>
    </div>
  );
};
