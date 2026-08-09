import React from 'react';
import { useMilk } from '../../context/MilkContext';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../common/Badge';
import { IndianRupee, FileText, CheckCircle2, XCircle, Clock, ShieldCheck } from 'lucide-react';

export const InvoiceSummaryCard: React.FC<{ onOpenWhatsApp: () => void; onOpenPayment: () => void }> = ({
  onOpenWhatsApp,
  onOpenPayment,
}) => {
  const { invoice, selectedMonth } = useMilk();
  const { user } = useAuth();

  const [yearStr, monthStr] = selectedMonth.split('-');
  const dateObj = new Date(parseInt(yearStr, 10), parseInt(monthStr, 10) - 1, 1);
  const monthName = dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="bg-gradient-to-br from-slate-900/95 via-[#131C2E] to-slate-950 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-5 relative overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
            Monthly Khata Statement
          </span>
          <h2 className="text-xl font-extrabold text-slate-100 mt-0.5">{monthName}</h2>
        </div>

        <Badge variant={invoice.status === 'paid' ? 'paid' : invoice.status === 'partial' ? 'custom' : 'unpaid'}>
          {invoice.status === 'paid' ? 'Settled (Paid)' : invoice.status === 'partial' ? 'Partial Paid' : 'Unpaid Due'}
        </Badge>
      </div>

      {/* Detailed Breakdown Rows */}
      <div className="space-y-2.5 text-xs">
        <div className="flex justify-between text-slate-300 py-1 border-b border-slate-800/40">
          <span className="text-slate-400">Total Billing Days</span>
          <span className="font-semibold text-slate-200">{invoice.totalDays} Days</span>
        </div>

        <div className="flex justify-between text-slate-300 py-1 border-b border-slate-800/40">
          <span className="text-slate-400 flex items-center gap-1">
            <CheckCircle2 size={13} className="text-emerald-400" /> Delivered Days
          </span>
          <span className="font-bold text-emerald-400">{invoice.deliveredDays} Days</span>
        </div>

        <div className="flex justify-between text-slate-300 py-1 border-b border-slate-800/40">
          <span className="text-slate-400 flex items-center gap-1">
            <XCircle size={13} className="text-rose-400" /> Missed / Skipped Days
          </span>
          <span className="font-bold text-rose-400">{invoice.missedDays} Days</span>
        </div>

        <div className="flex justify-between text-slate-300 py-1 border-b border-slate-800/40">
          <span className="text-slate-400">Total Milk Quantity</span>
          <span className="font-bold text-cyan-300">{invoice.totalLitres.toFixed(1)} Litres</span>
        </div>

        <div className="flex justify-between text-slate-300 py-1 border-b border-slate-800/40">
          <span className="text-slate-400">Base Price per Litre</span>
          <span className="font-semibold text-slate-200">₹{invoice.pricePerLitre} / L</span>
        </div>

        <div className="flex justify-between text-slate-300 py-1 border-b border-slate-800/40">
          <span className="text-slate-400">Current Month Bill</span>
          <span className="font-bold text-slate-100">₹{invoice.currentMonthCost.toLocaleString('en-IN')}</span>
        </div>

        {invoice.previousPendingBalance > 0 && (
          <div className="flex justify-between text-amber-300 py-1 border-b border-slate-800/40">
            <span className="text-amber-400/90 font-medium">Previous Carryover Pending</span>
            <span className="font-bold">+₹{invoice.previousPendingBalance.toLocaleString('en-IN')}</span>
          </div>
        )}
      </div>

      {/* Grand Total Highlights Box */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Grand Total Due
          </span>
          <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-cyan-300 to-white mt-0.5">
            ₹{invoice.totalAmountDue.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-400 font-medium block">Amount Paid: ₹{invoice.amountPaid}</span>
          <span className="text-xs font-extrabold text-cyan-400">
            Balance: ₹{invoice.pendingBalance.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          onClick={onOpenWhatsApp}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all active:scale-95 cursor-pointer"
        >
          <FileText size={16} />
          WhatsApp Invoice
        </button>

        <button
          onClick={onOpenPayment}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-500 hover:to-indigo-400 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all active:scale-95 cursor-pointer"
        >
          <ShieldCheck size={16} />
          Record Payment
        </button>
      </div>
    </div>
  );
};
