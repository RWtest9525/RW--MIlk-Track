import React, { useState } from 'react';
import { BottomModal } from '../common/BottomModal';
import { GlassButton } from '../components/common/GlassButton';
import { useMilk } from '../../context/MilkContext';
import { useAuth } from '../../context/AuthContext';
import { formatWhatsAppInvoice, openWhatsAppDirectChat } from '../../services/whatsappService';
import { Copy, Check, Send } from 'lucide-react';

interface WhatsAppPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WhatsAppPreviewModal: React.FC<WhatsAppPreviewModalProps> = ({ isOpen, onClose }) => {
  const { invoice, logs, selectedMonth } = useMilk();
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  if (!user) return null;

  const [yearStr, monthStr] = selectedMonth.split('-');
  const dateObj = new Date(parseInt(yearStr, 10), parseInt(monthStr, 10) - 1, 1);
  const monthName = dateObj.toLocaleDateString('en-US', { month: 'long' });
  const year = parseInt(yearStr, 10);

  const formattedMessage = formatWhatsAppInvoice(user, invoice, logs, monthName, year);

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendWhatsApp = () => {
    openWhatsAppDirectChat(user.vendor.phone, user.vendor.countryCode, formattedMessage);
    onClose();
  };

  return (
    <BottomModal
      isOpen={isOpen}
      onClose={onClose}
      title="WhatsApp Invoice Preview"
      subtitle={`Send to ${user.vendor.name} (${user.vendor.countryCode} ${user.vendor.phone})`}
    >
      <div className="space-y-4 text-slate-900">
        {/* Light Theme Message Container Box */}
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 font-mono text-xs leading-relaxed text-emerald-950 whitespace-pre-wrap max-h-60 overflow-y-auto shadow-inner relative">
          <div className="absolute top-2 right-2 bg-emerald-100 text-emerald-800 text-[10px] font-sans font-extrabold px-2 py-0.5 rounded-full border border-emerald-300">
            WhatsApp Text
          </div>
          {formattedMessage}
        </div>

        {/* Compact Single-Line Action Button Row */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="flex-1 py-3 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-extrabold rounded-2xl flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
          >
            {copied ? <Check size={15} className="text-emerald-600 shrink-0" /> : <Copy size={15} className="shrink-0" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          <button
            type="button"
            onClick={handleSendWhatsApp}
            className="flex-[2.5] py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 transition-all cursor-pointer whitespace-nowrap active:scale-95"
          >
            <Send size={15} className="shrink-0" />
            <span>Send to WhatsApp</span>
          </button>
        </div>
      </div>
    </BottomModal>
  );
};
