import React from 'react';
import { X, ShieldCheck, FileText, Info } from 'lucide-react';

export type LegalType = 'terms' | 'privacy' | 'about';

interface LegalModalProps {
  isOpen: boolean;
  type: LegalType | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, type, onClose }) => {
  if (!isOpen || !type) return null;

  const content = {
    terms: {
      title: 'Terms & Conditions',
      subtitle: 'RW-Milk Tracker Terms of Service',
      icon: <FileText className="text-cyan-600" size={20} />,
      body: (
        <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
          <p>
            Welcome to <strong>RW-Milk Tracker</strong>. By creating an account or accessing our services, you agree to comply with and be bound by the following terms and conditions.
          </p>
          <h5 className="font-bold text-slate-900 text-xs">1. Daily Record Accuracy</h5>
          <p>
            Users are responsible for maintaining the confidentiality of their credentials and ensuring the accuracy of daily milk logs and rate entries.
          </p>
          <h5 className="font-bold text-slate-900 text-xs">2. Data Privacy & Use</h5>
          <p>
            Your milk delivery logs are securely stored in Cloud Firestore with offline local storage cache. We do not sell or monetize your personal tracking records.
          </p>
          <h5 className="font-bold text-slate-900 text-xs">3. Service Modifications</h5>
          <p>
            We reserve the right to update features, rates, or application services to improve user experience and dairy logistics management.
          </p>
        </div>
      ),
    },
    privacy: {
      title: 'Privacy Policy',
      subtitle: 'Google Play Compliant Privacy Standard',
      icon: <ShieldCheck className="text-emerald-600" size={20} />,
      body: (
        <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
          <p>
            Your privacy is our utmost priority. <strong>RW-Milk Tracker</strong> is committed to protecting your personal information and daily consumption records.
          </p>
          <h5 className="font-bold text-slate-900 text-xs">Information We Collect</h5>
          <p>
            We collect basic authentication information (Name, Email, Phone Number via Firebase Auth) and user-entered milk delivery logs (Vendor details, daily litres, rate per litre).
          </p>
          <h5 className="font-bold text-slate-900 text-xs">Data Deletion & Account Erasure</h5>
          <p>
            Users have the full right to request total account and data deletion directly from the Profile Settings screen or by contacting support.
          </p>
        </div>
      ),
    },
    about: {
      title: 'About RW-Milk Tracker',
      subtitle: 'Customer & Vendor Daily Milk App',
      icon: <Info className="text-cyan-600" size={20} />,
      body: (
        <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
          <p>
            <strong>RW-Milk Tracker</strong> is a modern, customer-centric application designed to simplify daily household milk delivery logs, manage monthly dues, and instantly share itemized WhatsApp invoices with dairy vendors.
          </p>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <h5 className="font-bold text-slate-900 text-xs">✨ Key Highlights:</h5>
            <ul className="list-disc pl-4 space-y-1 text-slate-700">
              <li>Auto-logs default daily milk quantity with instant date overrides</li>
              <li>Calculates monthly bill amount and carryover pending balances</li>
              <li>Generates formatted WhatsApp direct chat invoices</li>
              <li>Cloud Firestore sync with offline persistence</li>
            </ul>
          </div>
          <p className="text-[11px] text-slate-500 text-center pt-2">
            Version 1.0.0 (Production Build)
          </p>
        </div>
      ),
    },
  };

  const current = content[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center">
              {current.icon}
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">{current.title}</h3>
              <p className="text-xs font-semibold text-slate-500">{current.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto py-4 pr-1 scrollbar-thin">
          {current.body}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
