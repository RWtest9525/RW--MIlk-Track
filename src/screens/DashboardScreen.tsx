import React from 'react';
import { Hero3DCard } from '../components/dashboard/Hero3DCard';
import { QuickActions } from '../components/dashboard/QuickActions';
import { MonthlyProgress } from '../components/dashboard/MonthlyProgress';
import { useMilk } from '../context/MilkContext';
import { useAuth } from '../context/AuthContext';
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
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
            Recent Overrides
          </h3>
          <button
            onClick={onNavigateToCalendar}
            className="text-xs text-[#0284C7] font-bold hover:underline flex items-center gap-1"
          >
            <Calendar size={13} /> View Full Calendar
          </button>
        </div>

        {overrideLogs.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center text-xs font-bold text-slate-600 shadow-xs">
            ✨ All days in this month defaulted to {defaultQty}L. No delivery interruptions recorded.
          </div>
        ) : (
          <div className="space-y-2">
            {overrideLogs.map((log) => {
              const parts = log.date.split('-');
              const dayStr = parts[2];

              return (
                <div
                  key={log.date}
                  className="bg-white border border-slate-200 rounded-2xl p-3.5 flex items-center justify-between text-xs text-slate-900 shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs ${
                        log.status === 'missed'
                          ? 'bg-rose-100 border border-rose-300 text-rose-700'
                          : 'bg-amber-100 border border-amber-300 text-amber-800'
                      }`}
                    >
                      {dayStr}
                    </div>

                    <div>
                      <div className="font-bold text-slate-900">
                        {log.status === 'missed' ? 'Missed Delivery' : `Custom (${log.quantity}L)`}
                      </div>
                      {log.notes ? (
                        <div className="text-[11px] text-slate-500 font-medium mt-0.5">{log.notes}</div>
                      ) : (
                        <div className="text-[11px] text-slate-400 font-medium mt-0.5">{log.date}</div>
                      )}
                    </div>
                  </div>

                  <span
                    className={`font-black text-xs ${
                      log.status === 'missed' ? 'text-rose-600' : 'text-amber-600'
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
