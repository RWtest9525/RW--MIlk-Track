import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';
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
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Modals state
  const [todayModalOpen, setTodayModalOpen] = useState<boolean>(false);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState<boolean>(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState<boolean>(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060911] flex flex-col items-center justify-center text-slate-100 space-y-4">
        <div className="w-14 h-14 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin shadow-2xl shadow-cyan-500/50" />
        <p className="text-xs font-black uppercase tracking-widest text-cyan-400 animate-pulse">
          Connecting Firebase Auth...
        </p>
      </div>
    );
  }

  // 1. If not logged in -> ALWAYS show Auth Screen (Sign In / Register)
  if (!user) {
    return (
      <div className={`min-h-screen w-full transition-colors duration-300 ${
        theme === 'dark' ? 'bg-[#060911] text-slate-100' : 'bg-slate-100 text-slate-900'
      }`}>
        <AuthScreen />
      </div>
    );
  }

  // 2. If logged in but not onboarded -> Setup Screen
  if (!user.isOnboarded) {
    return (
      <div className={`min-h-screen w-full transition-colors duration-300 ${
        theme === 'dark' ? 'bg-[#060911] text-slate-100' : 'bg-slate-100 text-slate-900'
      }`}>
        <OnboardingScreen />
      </div>
    );
  }

  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  return (
    <div className={`min-h-screen w-full flex flex-col relative transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#060911] text-slate-100' : 'bg-slate-100 text-slate-900'
    }`}>
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
