import React, { useState } from 'react';
import { BottomModal } from '../common/BottomModal';
import { GlassButton } from '../common/GlassButton';
import { useMilk } from '../../context/MilkContext';
import { useAuth } from '../../context/AuthContext';
import { formatWhatsAppInvoice, openWhatsAppDirectChat } from '../../services/whatsappService';
import { MessageSquare, Copy, Check, ExternalLink } from 'lucide-react';

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
      subtitle={`Send statement to ${user.vendor.name} (${user.vendor.countryCode} ${user.vendor.phone})`}
    >
      <div className="space-y-4">
        {/* Live Message Container Box */}
        <div className="bg-[#0B141A] border border-emerald-500/30 rounded-2xl p-4 font-mono text-[11px] leading-relaxed text-slate-200 whitespace-pre-wrap max-h-60 overflow-y-auto shadow-inner relative">
          <div className="absolute top-2 right-2 bg-emerald-500/20 text-emerald-300 text-[9px] font-sans font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
            WhatsApp Format
          </div>
          {formattedMessage}
        </div>

        {/* Action Controls */}
        <div className="flex gap-2">
          <GlassButton
            variant="secondary"
            size="md"
            className="flex-1"
            icon={copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
            onClick={handleCopy}
          >
            {copied ? 'Copied!' : 'Copy Text'}
          </GlassButton>

          <GlassButton
            variant="success"
            size="md"
            className="flex-[2]"
            icon={<ExternalLink size={16} />}
            onClick={handleSendWhatsApp}
          >
            Open WhatsApp Direct Chat
          </GlassButton>
        </div>
      </div>
    </BottomModal>
  );
};
