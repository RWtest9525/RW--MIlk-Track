import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { AuthScreen } from './screens/AuthScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { CalendarScreen } from './screens/CalendarScreen';
import { InvoiceScreen } from './screens/InvoiceScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { EditDateModal } from './components/calendar/EditDateModal';
import { WhatsAppPreviewModal } from './components/invoice/WhatsAppPreviewModal';
import { PaymentLedgerModal } from './components/invoice/PaymentLedgerModal';
import { ActiveTab } from './types';

export const AppContainer: React.FC = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Modals state
  const [todayModalOpen, setTodayModalOpen] = useState<boolean>(false);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState<boolean>(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState<boolean>(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center text-slate-900 space-y-3">
        <div className="w-10 h-10 border-3 border-[#0284C7] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-extrabold text-slate-500 animate-pulse">
          Loading RW-Milk Tracker...
        </p>
      </div>
    );
  }

  // 1. If not logged in -> ALWAYS show Auth Screen (Sign In / Register)
  if (!user) {
    return (
      <div className="min-h-screen w-full bg-[#F8FAFC] text-slate-900">
        <AuthScreen />
      </div>
    );
  }

  // 2. If logged in but not onboarded -> Setup Screen
  if (!user.isOnboarded) {
    return (
      <div className="min-h-screen w-full bg-[#F8FAFC] text-slate-900">
        <OnboardingScreen />
      </div>
    );
  }

  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  return (
    <div className="min-h-screen w-full flex flex-col relative bg-[#F8FAFC] text-slate-900">
      {/* Top Navbar */}
      <Header />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8">
        {activeTab === 'dashboard' && (
          <DashboardScreen
            onOpenTodayModal={() => setTodayModalOpen(true)}
            onOpenInvoiceModal={() => setInvoiceModalOpen(true)}
            onOpenPaymentModal={() => setPaymentModalOpen(true)}
            onNavigateToInvoice={() => setActiveTab('invoice')}
            onNavigateToCalendar={() => setActiveTab('calendar')}
          />
        )}

        {activeTab === 'calendar' && <CalendarScreen />}

        {activeTab === 'invoice' && <InvoiceScreen />}

        {activeTab === 'profile' && <ProfileScreen />}
      </main>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Modals */}
      <EditDateModal
        isOpen={todayModalOpen}
        dateStr={todayStr}
        onClose={() => setTodayModalOpen(false)}
      />

      <WhatsAppPreviewModal
        isOpen={invoiceModalOpen}
        onClose={() => setInvoiceModalOpen(false)}
      />

      <PaymentLedgerModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
      />
    </div>
  );
};
