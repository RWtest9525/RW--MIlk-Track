import React from 'react';
import { Hero3DCard } from '../components/dashboard/Hero3DCard';
import { QuickActions } from '../components/dashboard/QuickActions';
import { MonthlyProgress } from '../components/dashboard/MonthlyProgress';

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
}) => {
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
    </div>
  );
};
