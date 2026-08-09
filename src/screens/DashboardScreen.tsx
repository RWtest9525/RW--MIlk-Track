import React from 'react';
import { Hero3DCard } from '../components/dashboard/Hero3DCard';
import { QuickActions } from '../components/dashboard/QuickActions';
import { MonthlyProgress } from '../components/dashboard/MonthlyProgress';
import { useMilk } from '../context/MilkContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Calendar } from 'lucide-react';

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
  const { logs } = useMilk();
  const { user } = useAuth();
  const { theme } = useTheme();

  // Find recent overrides (custom or missed days)
  const overrideLogs = Object.values(logs)
    .filter((l) => l.status === 'missed' || l.status === 'custom')
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 4);

  const defaultQty = user?.vendor?.defaultDailyQuantity ?? 1.5;

  return (
    <div className="space-y-6 pb-28 animate-fade-in">
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
          <h3 className={`text-xs font-black uppercase tracking-wider ${
            theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
          }`}>
            Recent Overrides
          </h3>
          <button
            onClick={onNavigateToCalendar}
            className="text-xs text-cyan-600 dark:text-cyan-400 font-bold hover:underline flex items-center gap-1"
          >
            <Calendar size={13} /> View Full Calendar
          </button>
        </div>

        {overrideLogs.length === 0 ? (
          <div className={`border rounded-2xl p-4 text-center text-xs font-semibold ${
            theme === 'dark'
              ? 'bg-slate-900/60 border-slate-800 text-slate-400'
              : 'bg-white border-slate-200 text-slate-500 shadow-sm'
          }`}>
            No delivery interruptions recorded. Daily default rate: {defaultQty}L.
          </div>
        ) : (
          <div className="space-y-2">
            {overrideLogs.map((log) => {
              const parts = log.date.split('-');
              const dayStr = parts[2];

              return (
                <div
                  key={log.date}
                  className={`border rounded-2xl p-3.5 flex items-center justify-between text-xs transition-colors ${
                    theme === 'dark'
                      ? 'bg-slate-900/80 border-slate-800 text-slate-100'
                      : 'bg-white border-slate-200 text-slate-900 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs ${
                        log.status === 'missed'
                          ? 'bg-rose-500/15 border border-rose-500/30 text-rose-500'
                          : 'bg-amber-500/15 border border-amber-500/30 text-amber-500'
                      }`}
                    >
                      {dayStr}
                    </div>

                    <div>
                      <div className="font-bold">
                        {log.status === 'missed' ? 'Missed Delivery' : `Custom (${log.quantity}L)`}
                      </div>
                      {log.notes && (
                        <div className="text-[11px] opacity-75 mt-0.5">{log.notes}</div>
                      )}
                    </div>
                  </div>

                  <span
                    className={`font-black text-xs ${
                      log.status === 'missed' ? 'text-rose-500' : 'text-amber-500'
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
