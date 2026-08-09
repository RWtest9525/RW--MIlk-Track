import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { Calendar, MessageSquare, CreditCard, Sparkles } from 'lucide-react';

interface QuickActionsProps {
  onOpenTodayOverride: () => void;
  onOpenInvoiceModal: () => void;
  onOpenPaymentModal: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onOpenTodayOverride,
  onOpenInvoiceModal,
  onOpenPaymentModal,
}) => {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
          Quick Actions
        </h3>
        <span className="text-xs text-cyan-400 font-medium flex items-center gap-1">
          <Sparkles size={12} /> Instant Operations
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {/* Today's Override */}
        <div
          onClick={onOpenTodayOverride}
          className="bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/60 hover:border-cyan-500/40 rounded-2xl p-3.5 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 active:scale-95 group shadow-lg shadow-black/30"
        >
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-2 group-hover:scale-110 transition-transform">
            <Calendar size={18} />
          </div>
          <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 leading-snug">
            Mark Today
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5">Override Qty</span>
        </div>

        {/* Generate WhatsApp Invoice */}
        <div
          onClick={onOpenInvoiceModal}
          className="bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/60 hover:border-emerald-500/40 rounded-2xl p-3.5 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 active:scale-95 group shadow-lg shadow-black/30"
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-2 group-hover:scale-110 transition-transform">
            <MessageSquare size={18} />
          </div>
          <span className="text-xs font-bold text-slate-200 group-hover:text-emerald-300 leading-snug">
            WhatsApp
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5">Send Invoice</span>
        </div>

        {/* Mark Bill as Paid */}
        <div
          onClick={onOpenPaymentModal}
          className="bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/60 hover:border-purple-500/40 rounded-2xl p-3.5 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 active:scale-95 group shadow-lg shadow-black/30"
        >
          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-2 group-hover:scale-110 transition-transform">
            <CreditCard size={18} />
          </div>
          <span className="text-xs font-bold text-slate-200 group-hover:text-purple-300 leading-snug">
            Mark Paid
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5">Record Bill</span>
        </div>
      </div>
    </div>
  );
};
