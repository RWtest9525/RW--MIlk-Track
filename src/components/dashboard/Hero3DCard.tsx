import React from 'react';
import { MilkBottle3D } from '../3d/MilkBottle3D';
import { useMilk } from '../../context/MilkContext';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Droplets, ArrowUpRight, IndianRupee, Clock } from 'lucide-react';

export const Hero3DCard: React.FC<{ onNavigateToInvoice: () => void }> = ({ onNavigateToInvoice }) => {
  const { invoice } = useMilk();
  const { user } = useAuth();

  const defaultDaily = user?.vendor?.defaultDailyQuantity ?? 1.5;
  const targetLitres = invoice.totalDays * defaultDaily;
  const fillPercentage = Math.min(100, Math.round((invoice.totalLitres / Math.max(1, targetLitres)) * 100));

  return (
    <div className="relative rounded-3xl p-5 bg-gradient-to-br from-white via-cyan-50/40 to-emerald-50/30 border border-slate-200 shadow-lg overflow-hidden text-slate-900">
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Compact Top Header: Milk Analytics & Amount Inline */}
      <div className="flex items-center justify-between z-10 relative pb-2 border-b border-slate-100">
        <div className="flex items-center gap-1.5">
          <Sparkles size={15} className="text-[#0284C7] animate-pulse" />
          <span className="text-xs font-black uppercase tracking-wider text-[#0284C7]">
            Milk Analytics
          </span>
        </div>

        {/* Compact Net Amount directly in header to save space */}
        <div className="flex items-center gap-1">
          <span className="text-xs font-bold text-slate-500">Net Due:</span>
          <span className="text-base font-black text-slate-900 tracking-tight">
            ₹{invoice.totalAmountDue.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Hero Body: Left Metrics & Right 3D Render */}
      <div className="grid grid-cols-12 items-center mt-3 gap-2 z-10 relative">
        {/* Metrics Left */}
        <div className="col-span-7 space-y-2.5">
          <div>
            <p className="text-[11px] text-slate-500 font-extrabold uppercase tracking-wide">Total Milk Consumed</p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                {invoice.totalLitres.toFixed(1)}
              </span>
              <span className="text-xs font-extrabold text-slate-600">Litres</span>
            </div>
            
            {/* Integrated Rate & Preferred Slot Info */}
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 mt-1">
              <span className="inline-flex items-center gap-0.5 text-[#0284C7] font-extrabold">
                <IndianRupee size={12} /> ₹{user?.vendor?.defaultPricePerLitre}/L
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 text-slate-600 capitalize">
                <Clock size={12} className="text-amber-600" /> {user?.vendor?.preferredSlot || 'morning'} Slot
              </span>
            </div>
          </div>
        </div>

        {/* 3D Bottle Right */}
        <div className="col-span-5 relative flex items-center justify-center">
          <MilkBottle3D fillPercentage={fillPercentage} height={145} />

          {/* Floating % Pill */}
          <div className="absolute bottom-0 right-0 bg-white border border-slate-200 px-2 py-0.5 rounded-xl text-[10px] font-black text-[#0284C7] shadow-xs flex items-center gap-1">
            <Droplets size={11} className="text-[#0284C7]" />
            {fillPercentage}%
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div 
        onClick={onNavigateToInvoice}
        className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-slate-700 hover:text-[#0284C7] transition-colors cursor-pointer group"
      >
        <span>View Detailed Invoice & Payment Dues</span>
        <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-[#0284C7]" />
      </div>
    </div>
  );
};
