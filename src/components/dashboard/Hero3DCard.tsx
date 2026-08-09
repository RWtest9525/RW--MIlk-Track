import React from 'react';
import { MilkBottle3D } from '../3d/MilkBottle3D';
import { useMilk } from '../../context/MilkContext';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../common/Badge';
import { Sparkles, IndianRupee, Droplets, ArrowUpRight } from 'lucide-react';

export const Hero3DCard: React.FC<{ onNavigateToInvoice: () => void }> = ({ onNavigateToInvoice }) => {
  const { invoice } = useMilk();
  const { user } = useAuth();

  const defaultDaily = user?.vendor.defaultDailyQuantity ?? 1.5;
  const targetLitres = invoice.totalDays * defaultDaily;
  const fillPercentage = Math.min(100, Math.round((invoice.totalLitres / Math.max(1, targetLitres)) * 100));

  return (
    <div className="relative rounded-3xl p-6 bg-gradient-to-br from-slate-900/90 via-[#131C2E] to-slate-950 border border-white/10 shadow-2xl shadow-cyan-950/40 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header info */}
      <div className="flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-cyan-400 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
            Smart Milk Analytics
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
            <p className="text-xs text-slate-400 font-medium">Total Milk Consumed</p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-emerald-300 to-white tracking-tight">
                {invoice.totalLitres.toFixed(1)}
              </span>
              <span className="text-sm font-semibold text-slate-400">Litres</span>
            </div>
            <p className="text-[11px] text-slate-400/80 mt-0.5">
              {fillPercentage}% of monthly target ({targetLitres.toFixed(1)}L)
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800/80">
            <p className="text-xs text-slate-400 font-medium">Calculated Cost</p>
            <div className="flex items-center gap-1 mt-0.5 text-xl font-bold text-white">
              <span>₹{invoice.totalAmountDue.toLocaleString('en-IN')}</span>
              {invoice.previousPendingBalance > 0 && (
                <span className="text-[10px] text-amber-400 font-medium bg-amber-500/10 px-1.5 py-0.5 rounded-full border border-amber-500/20">
                  +₹{invoice.previousPendingBalance} carryover
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 3D Bottle Right */}
        <div className="col-span-5 relative flex items-center justify-center">
          <MilkBottle3D fillPercentage={fillPercentage} height={175} />

          {/* Floating % Pill */}
          <div className="absolute bottom-1 right-1 bg-slate-900/90 border border-cyan-500/30 px-2.5 py-1 rounded-xl text-[11px] font-extrabold text-cyan-300 shadow-lg backdrop-blur-md flex items-center gap-1">
            <Droplets size={12} className="text-cyan-400" />
            {fillPercentage}%
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div 
        onClick={onNavigateToInvoice}
        className="mt-4 pt-3 border-t border-slate-800/90 flex items-center justify-between text-xs text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer group"
      >
        <span className="font-medium">View Detailed Invoice & Ledger</span>
        <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-cyan-400" />
      </div>
    </div>
  );
};
