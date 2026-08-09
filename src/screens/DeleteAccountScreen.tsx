import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { GlassButton } from '../components/common/GlassButton';
import { Trash2, ArrowLeft, CheckCircle2 } from 'lucide-react';

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
    <div className="space-y-4 pb-28 animate-fade-in max-w-md mx-auto">
      
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-black text-slate-600 hover:text-[#0284C7] transition-colors cursor-pointer py-1"
      >
        <ArrowLeft size={16} />
        <span>Back to Settings</span>
      </button>

      {/* Super Minimal Container */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl space-y-4 text-center">
        
        <div className="w-12 h-12 rounded-full bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 mx-auto">
          <Trash2 size={24} />
        </div>

        <div>
          <h2 className="text-lg font-black text-slate-900">Delete Account Data</h2>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            This will permanently erase all milk records and profile data for <strong>{user?.email || 'this account'}</strong>.
          </p>
        </div>

        {success ? (
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-center space-y-1 text-emerald-800">
            <CheckCircle2 size={28} className="mx-auto text-emerald-600" />
            <p className="text-xs font-black">Account Wiped & Signed Out</p>
          </div>
        ) : (
          <form onSubmit={handleDelete} className="space-y-3 pt-2 text-left">
            <div>
              <label className="block text-[11px] font-extrabold uppercase mb-1 text-slate-600">
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
              className="w-full font-black py-3"
              disabled={confirmText.trim().toUpperCase() !== 'DELETE'}
              loading={loading}
              type="submit"
            >
              Confirm Account Deletion
            </GlassButton>
          </form>
        )}
      </div>
    </div>
  );
};
