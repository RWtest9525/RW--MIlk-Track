import React, { useState, useEffect } from 'react';
import { BottomModal } from '../common/BottomModal';
import { GlassButton } from '../common/GlassButton';
import { useMilk } from '../../context/MilkContext';
import { IndianRupee, CheckCircle, ShieldCheck, CreditCard, Info } from 'lucide-react';

interface PaymentLedgerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PaymentLedgerModal: React.FC<PaymentLedgerModalProps> = ({ isOpen, onClose }) => {
  const { invoice, markMonthAsPaid } = useMilk();

  const [amount, setAmount] = useState<number>(0);
  const [note, setNote] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setAmount(invoice.pendingBalance > 0 ? invoice.pendingBalance : invoice.totalAmountDue);
      setNote('');
      setSuccess(false);
    }
  }, [isOpen, invoice.pendingBalance, invoice.totalAmountDue]);

  const remainingDuesAfterPay = Math.max(0, invoice.pendingBalance - amount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;
    setLoading(true);
    await markMonthAsPaid(amount, note || 'Bill Payment Settlement', 'upi');
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
      title="Record Milk Payment"
      subtitle={`Total Bill Dues: ₹${invoice.totalAmountDue.toLocaleString('en-IN')}`}
    >
      {success ? (
        <div className="py-8 text-center space-y-3 animate-fade-in text-slate-900">
          <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center text-emerald-600 mx-auto animate-bounce">
            <CheckCircle size={36} />
          </div>
          <h4 className="text-lg font-black text-slate-900">Payment Recorded Successfully!</h4>
          <p className="text-xs font-semibold text-slate-600">
            {remainingDuesAfterPay > 0
              ? `Remaining ₹${remainingDuesAfterPay} will carry forward to next month's due.`
              : 'Monthly dues fully settled! 🎉'}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-slate-900">
          
          {/* Overall Month & Carryover Dues Summary Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs">
            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Statement Dues Breakdown</h4>
            
            <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
              <span className="font-semibold text-slate-600">Current Month Bill</span>
              <span className="font-bold text-slate-900">₹{invoice.currentMonthCost.toLocaleString('en-IN')}</span>
            </div>

            {invoice.previousPendingBalance > 0 && (
              <div className="flex justify-between border-b border-slate-200/60 pb-1.5 text-amber-800">
                <span className="font-semibold">Previous Carryover Pending</span>
                <span className="font-extrabold">+₹{invoice.previousPendingBalance.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
              <span className="font-semibold text-slate-600">Total Combined Amount</span>
              <span className="font-extrabold text-slate-900">₹{invoice.totalAmountDue.toLocaleString('en-IN')}</span>
            </div>

            {invoice.amountPaid > 0 && (
              <div className="flex justify-between border-b border-slate-200/60 pb-1.5 text-emerald-700">
                <span className="font-semibold">Already Recorded Paid</span>
                <span className="font-extrabold">-₹{invoice.amountPaid.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="flex justify-between pt-1 font-black text-sm">
              <span className="text-slate-900">Active Remaining Dues</span>
              <span className="text-[#0284C7]">₹{invoice.pendingBalance.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Direct Amount Input */}
          <div>
            <label className="block text-[11px] font-extrabold uppercase mb-1.5 text-slate-700">
              Payment Amount to Record (₹)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0284C7] font-black text-base">₹</span>
              <input
                type="number"
                min="1"
                max={invoice.totalAmountDue * 2}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-base font-black text-slate-900 focus:outline-none focus:border-[#0284C7]"
              />
            </div>
          </div>

          {/* Quick Note Input */}
          <div>
            <label className="block text-[11px] font-extrabold uppercase mb-1.5 text-slate-700">
              Payment Reference / Note (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Cash handed to vendor, Online UPI..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0284C7]"
            />
          </div>

          {/* Next Month Balance Carryover Hint */}
          <div className="bg-cyan-50/80 border border-cyan-200 p-3 rounded-2xl text-xs flex items-center justify-between text-cyan-950 font-bold">
            <span className="flex items-center gap-1.5">
              <Info size={15} className="text-[#0284C7]" /> Remaining Pending Dues:
            </span>
            <span className="text-[#0284C7] font-black">₹{remainingDuesAfterPay.toLocaleString('en-IN')}</span>
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
            Record Dues Payment (₹{amount.toLocaleString('en-IN')})
          </GlassButton>
        </form>
      )}
    </BottomModal>
  );
};
