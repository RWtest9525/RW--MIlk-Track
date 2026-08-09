import React, { useState, useEffect } from 'react';
import { BottomModal } from '../common/BottomModal';
import { GlassButton } from '../common/GlassButton';
import { useMilk } from '../../context/MilkContext';
import { CheckCircle, CreditCard, Info } from 'lucide-react';

interface PaymentLedgerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PaymentLedgerModal: React.FC<PaymentLedgerModalProps> = ({ isOpen, onClose }) => {
  const { invoice, markMonthAsPaid } = useMilk();

  const [amountStr, setAmountStr] = useState<string>('0');
  const [note, setNote] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      const initialAmount = invoice.pendingBalance > 0 ? invoice.pendingBalance : invoice.totalAmountDue;
      setAmountStr(String(initialAmount));
      setNote('');
      setSuccess(false);
    }
  }, [isOpen, invoice.pendingBalance, invoice.totalAmountDue]);

  const numericAmount = Number(amountStr) || 0;
  const remainingDuesAfterPay = Math.max(0, invoice.pendingBalance - numericAmount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (numericAmount <= 0) return;
    setLoading(true);
    await markMonthAsPaid(numericAmount, note || 'Bill Payment Entry', 'upi');
    setLoading(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <BottomModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Payment Paid Entry"
      subtitle={`Record Cash / UPI bill payment sent to vendor`}
    >
      {success ? (
        <div className="py-8 text-center space-y-3 animate-fade-in text-slate-900">
          <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center text-emerald-600 mx-auto animate-bounce">
            <CheckCircle size={36} />
          </div>
          <h4 className="text-lg font-black text-slate-900">Payment Entry Saved!</h4>
          <p className="text-xs font-semibold text-slate-600">
            {remainingDuesAfterPay > 0
              ? `Remaining ₹${remainingDuesAfterPay} will carry forward as pending balance.`
              : 'Bill fully paid! 🎉'}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-slate-900 pb-2">
          
          {/* Overall Month & Carryover Dues Summary Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-1.5 text-xs">
            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Bill Dues Summary</h4>
            
            <div className="flex justify-between border-b border-slate-200/60 pb-1">
              <span className="font-semibold text-slate-600">Current Month Bill</span>
              <span className="font-bold text-slate-900">₹{invoice.currentMonthCost.toLocaleString('en-IN')}</span>
            </div>

            {invoice.previousPendingBalance > 0 && (
              <div className="flex justify-between border-b border-slate-200/60 pb-1 text-amber-800">
                <span className="font-semibold">Previous Carryover Dues</span>
                <span className="font-extrabold">+₹{invoice.previousPendingBalance.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="flex justify-between border-b border-slate-200/60 pb-1">
              <span className="font-semibold text-slate-600">Total Net Bill</span>
              <span className="font-extrabold text-slate-900">₹{invoice.totalAmountDue.toLocaleString('en-IN')}</span>
            </div>

            {invoice.amountPaid > 0 && (
              <div className="flex justify-between border-b border-slate-200/60 pb-1 text-emerald-700">
                <span className="font-semibold">Already Recorded Paid</span>
                <span className="font-extrabold">-₹{invoice.amountPaid.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="flex justify-between pt-1 font-black text-sm">
              <span className="text-slate-900">Active Remaining Dues</span>
              <span className="text-[#0284C7]">₹{invoice.pendingBalance.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Amount Paid Input */}
          <div>
            <label className="block text-[11px] font-extrabold uppercase mb-1 text-slate-700">
              Amount Paid to Vendor (₹)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0284C7] font-black text-base">₹</span>
              <input
                type="number"
                placeholder="0"
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-base font-black text-slate-900 focus:outline-none focus:border-[#0284C7]"
              />
            </div>
          </div>

          {/* Quick Note Input */}
          <div>
            <label className="block text-[11px] font-extrabold uppercase mb-1 text-slate-700">
              Payment Method / Note (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Paid via Google Pay UPI / Cash"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0284C7]"
            />
          </div>

          {/* Balance Carryover Hint */}
          <div className="bg-cyan-50/80 border border-cyan-200 p-2.5 rounded-2xl text-xs flex items-center justify-between text-cyan-950 font-bold">
            <span className="flex items-center gap-1.5 text-[11px]">
              <Info size={14} className="text-[#0284C7]" /> Remaining Unpaid Balance:
            </span>
            <span className="text-[#0284C7] font-black text-xs">₹{remainingDuesAfterPay.toLocaleString('en-IN')}</span>
          </div>

          {/* Submit Button */}
          <GlassButton
            variant="primary"
            size="lg"
            className="w-full font-black py-3.5 shadow-md shadow-cyan-500/20"
            icon={<CreditCard size={18} />}
            loading={loading}
            type="submit"
          >
            Save Payment Paid Entry (₹{numericAmount.toLocaleString('en-IN')})
          </GlassButton>
        </form>
      )}
    </BottomModal>
  );
};
