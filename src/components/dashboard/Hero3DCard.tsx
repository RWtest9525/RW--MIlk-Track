import React from 'react';
import { MilkBottle3D } from '../3d/MilkBottle3D';
import { useMilk } from '../../context/MilkContext';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../common/Badge';
import { Sparkles, Droplets, ArrowUpRight, IndianRupee, Clock } from 'lucide-react';

export const Hero3DCard: React.FC<{ onNavigateToInvoice: () => void }> = ({ onNavigateToInvoice }) => {
  const { invoice } = useMilk();
  const { user } = useAuth();

  const defaultDaily = user?.vendor?.defaultDailyQuantity ?? 1.5;
  const targetLitres = invoice.totalDays * defaultDaily;
  const fillPercentage = Math.min(100, Math.round((invoice.totalLitres / Math.max(1, targetLitres)) * 100));

  return (
    <div className="relative rounded-3xl p-6 bg-gradient-to-br from-white via-cyan-50/50 to-emerald-50/40 border border-slate-200 shadow-xl shadow-cyan-100/60 overflow-hidden text-slate-900">
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header info */}
      <div className="flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-[#0284C7] animate-pulse" />
          <span className="text-xs font-black uppercase tracking-wider text-[#0284C7]">
            Milk Analytics
          </span>
        </div>

        <Badge variant={invoice.status === 'paid' ? 'paid' : invoice.status === 'partial' ? 'custom' : 'unpaid'}>
          {invoice.status === 'paid' ? 'Paid' : invoice.status === 'partial' ? 'Partial Due' : 'Active Due'}
        </Badge>
      </div>

      {/* Hero Body: Left Metrics & Right 3D Render */}
      <div className="grid grid-cols-12 items-center mt-3 gap-2 z-10 relative">
        {/* Metrics Left */}
        <div className="col-span-7 space-y-3">
          <div>
            <p className="text-xs text-slate-600 font-bold uppercase tracking-wide">Total Milk Consumed</p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {invoice.totalLitres.toFixed(1)}
              </span>
              <span className="text-sm font-bold text-slate-600">Litres</span>
            </div>
            
            {/* Integrated Rate & Preferred Slot Info */}
            <div className="flex items-center gap-2 text-[11px] font-extrabold text-slate-700 mt-1">
              <span className="inline-flex items-center gap-0.5 text-[#0284C7]">
                <IndianRupee size={12} /> ₹{user?.vendor?.defaultPricePerLitre}/L
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 text-slate-600 capitalize">
                <Clock size={12} className="text-amber-600" /> {user?.vendor?.preferredSlot || 'morning'} Slot
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200">
            <p className="text-xs text-slate-600 font-bold uppercase tracking-wide">Calculated Amount</p>
            <div className="flex items-center gap-1.5 mt-0.5 text-2xl font-black text-slate-900">
              <span className="text-[#0284C7]">₹{invoice.totalAmountDue.toLocaleString('en-IN')}</span>
              {invoice.previousPendingBalance > 0 && (
                <span className="text-[10px] text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                  +₹{invoice.previousPendingBalance} pending
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 3D Bottle Right */}
        <div className="col-span-5 relative flex items-center justify-center">
          <MilkBottle3D fillPercentage={fillPercentage} height={175} />

          {/* Floating % Pill */}
          <div className="absolute bottom-1 right-1 bg-white border border-slate-200 px-2.5 py-1 rounded-xl text-[11px] font-black text-[#0284C7] shadow-md flex items-center gap-1">
            <Droplets size={12} className="text-[#0284C7]" />
            {fillPercentage}%
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div 
        onClick={onNavigateToInvoice}
        className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700 hover:text-[#0284C7] transition-colors cursor-pointer group"
      >
        <span>View Detailed Invoice & Ledger</span>
        <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-[#0284C7]" />
      </div>
    </div>
  );
};
