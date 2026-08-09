import React, { useState } from 'react';
import { BottomModal } from '../common/BottomModal';
import { GlassButton } from '../common/GlassButton';
import { useMilk } from '../../context/MilkContext';
import { PaymentRecord } from '../../types';
import { ShieldCheck, IndianRupee, QrCode, Wallet, CheckCircle } from 'lucide-react';

interface PaymentLedgerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PaymentLedgerModal: React.FC<PaymentLedgerModalProps> = ({ isOpen, onClose }) => {
  const { invoice, markMonthAsPaid } = useMilk();

  const [paymentType, setPaymentType] = useState<'full' | 'partial'>('full');
  const [amount, setAmount] = useState<number>(invoice.pendingBalance || invoice.totalAmountDue);
  const [method, setMethod] = useState<PaymentRecord['paymentMethod']>('upi');
  const [note, setNote] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const remainingBalance = Math.max(0, invoice.totalAmountDue - (invoice.amountPaid + amount));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await markMonthAsPaid(amount, note || 'Monthly Bill Settlement', method);
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
      title="Record Payment Settlement"
      subtitle={`Total Outstanding Bill: ₹${invoice.totalAmountDue.toLocaleString('en-IN')}`}
    >
      {success ? (
        <div className="py-8 text-center space-y-3 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 mx-auto animate-bounce">
            <CheckCircle size={36} />
          </div>
          <h4 className="text-lg font-bold text-slate-100">Payment Recorded Successfully!</h4>
          <p className="text-xs text-slate-400">
            {remainingBalance > 0
              ? `Pending ₹${remainingBalance} carried forward to next month's due.`
              : 'Month bill fully settled! 🎉'}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Payment Type Switcher */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setPaymentType('full');
                setAmount(invoice.pendingBalance || invoice.totalAmountDue);
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                paymentType === 'full'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Full Settlement (₹{invoice.pendingBalance || invoice.totalAmountDue})
            </button>

            <button
              type="button"
              onClick={() => {
                setPaymentType('partial');
                setAmount(Math.round((invoice.pendingBalance || invoice.totalAmountDue) / 2));
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                paymentType === 'partial'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Partial Amount
            </button>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Payment Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400 font-bold">₹</span>
              <input
                type="number"
                min="1"
                max={invoice.totalAmountDue}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-base font-extrabold text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Payment Mode
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'upi', label: 'UPI / GPay', icon: <QrCode size={14} /> },
                { id: 'cash', label: 'Cash', icon: <Wallet size={14} /> },
                { id: 'netbanking', label: 'Net Banking', icon: <IndianRupee size={14} /> },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMethod(m.id as PaymentRecord['paymentMethod'])}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    method === m.id
                      ? 'bg-purple-500/20 border-purple-400 text-purple-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {m.icon}
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Note Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Payment Reference Note
            </label>
            <input
              type="text"
              placeholder="e.g. Paid via PhonePe, Cash handed to delivery agent..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Balance Carryover Hint */}
          <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-2xl text-xs flex justify-between text-slate-300">
            <span className="text-slate-400">Next Month Carryover Balance:</span>
            <strong className="text-amber-400 font-bold">₹{remainingBalance.toLocaleString('en-IN')}</strong>
          </div>

          {/* Submit Button */}
          <GlassButton
            variant="primary"
            size="lg"
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white border-purple-400/30"
            icon={<ShieldCheck size={18} />}
            loading={loading}
            type="submit"
          >
            Confirm & Save Payment
          </GlassButton>
        </form>
      )}
    </BottomModal>
  );
};
