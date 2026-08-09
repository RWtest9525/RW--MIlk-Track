import React from 'react';
import { Hero3DCard } from '../components/dashboard/Hero3DCard';
import { QuickActions } from '../components/dashboard/QuickActions';
import { MonthlyProgress } from '../components/dashboard/MonthlyProgress';
import { useMilk } from '../context/MilkContext';
import { useAuth } from '../context/AuthContext';
import { Calendar, AlertCircle } from 'lucide-react';

interface DashboardScreenProps {
  onOpenTodayModal: () => void;
  onOpenInvoiceModal: () => void;
  onOpenPaymentModal: () => void;
  onNavigateToInvoice: () => void;
  onNavigateToCalendar: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onOpenTodayModal,
  onOpenInvoiceModal,
  onOpenPaymentModal,
  onNavigateToInvoice,
  onNavigateToCalendar,
}) => {
  const { logs, selectedMonth } = useMilk();
  const { user } = useAuth();

  // Find recent overrides (custom or missed days)
  const overrideLogs = Object.values(logs)
    .filter((l) => l.status === 'missed' || l.status === 'custom')
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);

  const defaultQty = user?.vendor.defaultDailyQuantity ?? 1.5;

  return (
    <div className="p-5 space-y-6 pb-28 animate-fade-in">
      {/* 1. 3D Interactive Hero Card */}
      <Hero3DCard onNavigateToInvoice={onNavigateToInvoice} />

      {/* 2. Quick Actions Bar */}
      <QuickActions
        onOpenTodayOverride={onOpenTodayModal}
        onOpenInvoiceModal={onOpenInvoiceModal}
        onOpenPaymentModal={onOpenPaymentModal}
      />

      {/* 3. Monthly Statistics & Delivery Overview */}
      <MonthlyProgress />

      {/* 4. Recent Overrides Feed */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
            Recent Delivery Overrides
          </h3>
          <button
            onClick={onNavigateToCalendar}
            className="text-xs text-cyan-400 font-semibold hover:underline flex items-center gap-1"
          >
            <Calendar size={13} /> View Calendar
          </button>
        </div>

        {overrideLogs.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-center text-xs text-slate-400">
            ✨ No delivery interruptions recorded yet this month! All days defaulted to {defaultQty}L.
          </div>
        ) : (
          <div className="space-y-2">
            {overrideLogs.map((log) => {
              const parts = log.date.split('-');
              const dayStr = parts[2];

              return (
                <div
                  key={log.date}
                  className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                        log.status === 'missed'
                          ? 'bg-rose-500/15 border border-rose-500/30 text-rose-400'
                          : 'bg-amber-500/15 border border-amber-500/30 text-amber-400'
                      }`}
                    >
                      {dayStr}
                    </div>

                    <div>
                      <div className="font-bold text-slate-200">
                        {log.status === 'missed' ? '❌ Missed Delivery' : `🥛 Custom (${log.quantity}L)`}
                      </div>
                      {log.notes ? (
                        <div className="text-[10px] text-slate-400 mt-0.5">{log.notes}</div>
                      ) : (
                        <div className="text-[10px] text-slate-500 mt-0.5">{log.date}</div>
                      )}
                    </div>
                  </div>

                  <span
                    className={`font-extrabold text-xs ${
                      log.status === 'missed' ? 'text-rose-400' : 'text-amber-400'
                    }`}
                  >
                    {log.status === 'missed' ? '0 L' : `${log.quantity} Litres`}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
