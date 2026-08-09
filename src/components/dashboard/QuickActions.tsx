import React from 'react';
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
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
          Quick Actions
        </h3>
        <span className="text-xs text-[#0284C7] font-bold flex items-center gap-1">
          <Sparkles size={13} /> Instant Operations
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {/* Today's Override */}
        <div
          onClick={onOpenTodayOverride}
          className="bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 active:scale-95 group shadow-sm hover:shadow-md"
        >
          <div className="w-10 h-10 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-[#0284C7] mb-2 group-hover:scale-110 transition-transform">
            <Calendar size={18} />
          </div>
          <span className="text-xs font-extrabold text-slate-900 group-hover:text-[#0284C7] leading-snug">
            Mark Today
          </span>
          <span className="text-[10px] text-slate-500 font-semibold mt-0.5">Override Qty</span>
        </div>

        {/* Generate WhatsApp Invoice */}
        <div
          onClick={onOpenInvoiceModal}
          className="bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 active:scale-95 group shadow-sm hover:shadow-md"
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-2 group-hover:scale-110 transition-transform">
            <MessageSquare size={18} />
          </div>
          <span className="text-xs font-extrabold text-slate-900 group-hover:text-emerald-600 leading-snug">
            WhatsApp
          </span>
          <span className="text-[10px] text-slate-500 font-semibold mt-0.5">Send Invoice</span>
        </div>

        {/* Mark Bill as Paid */}
        <div
          onClick={onOpenPaymentModal}
          className="bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 active:scale-95 group shadow-sm hover:shadow-md"
        >
          <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 mb-2 group-hover:scale-110 transition-transform">
            <CreditCard size={18} />
          </div>
          <span className="text-xs font-extrabold text-slate-900 group-hover:text-purple-600 leading-snug">
            Mark Paid
          </span>
          <span className="text-[10px] text-slate-500 font-semibold mt-0.5">Record Bill</span>
        </div>
      </div>
    </div>
  );
};
