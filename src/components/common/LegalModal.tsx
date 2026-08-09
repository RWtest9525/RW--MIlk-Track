import React from 'react';
import { X, ShieldCheck, FileText, Info, ExternalLink } from 'lucide-react';

export type LegalType = 'terms' | 'privacy' | 'about';

interface LegalModalProps {
  type: LegalType | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  const content = {
    terms: {
      title: 'Terms & Conditions',
      subtitle: 'RW-Milk Tracker Service Terms',
      icon: <FileText className="text-cyan-500" size={20} />,
      body: (
        <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
          <p><strong>Last Updated: August 2026</strong></p>
          <p>
            Welcome to <strong>RW-Milk Tracker</strong>. By using our application, you agree to comply with and be bound by the following terms and conditions.
          </p>
          <h4 className="font-bold text-slate-800 text-sm">1. Service Usage</h4>
          <p>
            RW-Milk Tracker provides automated daily milk delivery logging, custom date overrides, monthly dues calculation, and formatted WhatsApp invoice generation. The app is intended for personal customer and vendor tracking.
          </p>
          <h4 className="font-bold text-slate-800 text-sm">2. Account Responsibility</h4>
          <p>
            Users are responsible for maintaining the confidentiality of their Firebase Auth credentials and ensuring the accuracy of daily milk logs and rate entries.
          </p>
          <h4 className="font-bold text-slate-800 text-sm">3. Data & Privacy</h4>
          <p>
            Your milk delivery logs are securely stored in Cloud Firestore with offline local storage cache. We do not sell or monetize your personal tracking records.
          </p>
          <h4 className="font-bold text-slate-800 text-sm">4. Modifications</h4>
          <p>
            We reserve the right to update these terms at any time. Continued use of the application constitutes acceptance of updated terms.
          </p>
        </div>
      ),
    },
    privacy: {
      title: 'Privacy Policy',
      subtitle: 'Play Store Compliant Data Protection',
      icon: <ShieldCheck className="text-emerald-500" size={20} />,
      body: (
        <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
          <p><strong>Last Updated: August 2026</strong></p>
          <p>
            <strong>RW-Milk Tracker</strong> is committed to protecting your privacy. This policy details how we collect, use, and safeguard your data.
          </p>
          <h4 className="font-bold text-slate-800 text-sm">1. Data Collection</h4>
          <p>
            We collect basic authentication information (Name, Email, Phone Number via Firebase Auth) and user-entered milk delivery logs (Vendor details, daily litres, rate per litre).
          </p>
          <h4 className="font-bold text-slate-800 text-sm">2. Third-Party Services</h4>
          <p>
            We utilize Google Firebase Authentication & Cloud Firestore for secure data storage. For direct messaging, we link to native WhatsApp APIs (`whatsapp://send`).
          </p>
          <h4 className="font-bold text-slate-800 text-sm">3. Data Security & Storage</h4>
          <p>
            All user data is encrypted in transit and stored in Firebase Firestore with local offline persistence. Users may clear or delete their account data upon request.
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
              <li>Firebase Auth & Cloud Firestore sync with offline persistence</li>
            </ul>
          </div>
          <p className="text-[11px] text-slate-500 text-center pt-2">
            Version 1.0.0 • Developed with React Native Expo, Firebase & Tailwind
          </p>
        </div>
      ),
    },
  };

  const current = content[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            {current.icon}
            <div>
              <h3 className="text-base font-black text-slate-900">{current.title}</h3>
              <p className="text-[11px] text-slate-500 font-medium">{current.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          {current.body}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[10px] text-slate-400 font-medium">RW-Milk Tracker Legal</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
