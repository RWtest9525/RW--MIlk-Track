import React, { useState } from 'react';
import { InvoiceSummaryCard } from '../components/invoice/InvoiceSummaryCard';
import { WhatsAppPreviewModal } from '../components/invoice/WhatsAppPreviewModal';
import { PaymentLedgerModal } from '../components/invoice/PaymentLedgerModal';
import { useMilk } from '../context/MilkContext';
import { History, ShieldCheck, QrCode, Wallet, IndianRupee } from 'lucide-react';

export const InvoiceScreen: React.FC = () => {
  const { invoice } = useMilk();
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  return (
    <div className="p-5 space-y-6 pb-28 animate-fade-in">
      {/* Invoice Card */}
      <InvoiceSummaryCard
        onOpenWhatsApp={() => setShowWhatsAppModal(true)}
        onOpenPayment={() => setShowPaymentModal(true)}
      />

      {/* Payment History Log Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <History size={16} className="text-purple-400" />
            Payment History & Settlements
          </h3>
          <span className="text-xs text-slate-400 font-medium">
            {invoice.paymentHistory?.length || 0} Recorded
          </span>
        </div>

        {!invoice.paymentHistory || invoice.paymentHistory.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 text-center text-xs text-slate-400">
            ⏳ No payments recorded yet for this billing cycle. Tap "Record Payment" to settle dues.
          </div>
        ) : (
          <div className="space-y-2">
            {invoice.paymentHistory.map((pay) => {
              const payDate = new Date(pay.date).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={pay.id}
                  className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                      {pay.paymentMethod === 'cash' ? (
                        <Wallet size={18} />
                      ) : pay.paymentMethod === 'upi' ? (
                        <QrCode size={18} />
                      ) : (
                        <IndianRupee size={18} />
                      )}
                    </div>

                    <div>
                      <div className="font-bold text-slate-200">{pay.note || 'Bill Settlement'}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{payDate} • via {pay.paymentMethod.toUpperCase()}</div>
                    </div>
                  </div>

                  <span className="font-extrabold text-sm text-emerald-400">
                    +₹{pay.amount.toLocaleString('en-IN')}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* WhatsApp Modal */}
      <WhatsAppPreviewModal
        isOpen={showWhatsAppModal}
        onClose={() => setShowWhatsAppModal(false)}
      />

      {/* Payment Ledger Modal */}
      <PaymentLedgerModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
      />
    </div>
  );
};
