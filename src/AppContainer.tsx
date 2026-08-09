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
import { DeviceWrapper } from './components/common/DeviceWrapper';
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
      <div className="min-h-screen bg-[#080C14] flex flex-col items-center justify-center text-slate-100 space-y-4">
        <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin shadow-lg shadow-cyan-500/50" />
        <p className="text-xs font-black uppercase tracking-widest text-cyan-400 animate-pulse">
          Initializing MilkTrack 2026...
        </p>
      </div>
    );
  }

  // 1. If not logged in -> Auth Screen
  if (!user) {
    return (
      <DeviceWrapper>
        <AuthScreen />
      </DeviceWrapper>
    );
  }

  // 2. If not onboarded -> Profile & Vendor Setup Screen
  if (!user.isOnboarded) {
    return (
      <DeviceWrapper>
        <OnboardingScreen />
      </DeviceWrapper>
    );
  }

  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  return (
    <DeviceWrapper>
      <div className={`min-h-full flex flex-col relative transition-colors duration-300 ${
        theme === 'dark' ? 'bg-[#080C14] text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}>
        {/* Sticky Top Header */}
        <Header />

        {/* Main Content Area */}
        <main className="flex-1">
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

        {/* Glassmorphic Bottom Navigation */}
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Quick Today Override Modal */}
        <EditDateModal
          isOpen={todayModalOpen}
          dateStr={todayStr}
          onClose={() => setTodayModalOpen(false)}
        />

        {/* Quick WhatsApp Invoice Modal */}
        <WhatsAppPreviewModal
          isOpen={invoiceModalOpen}
          onClose={() => setInvoiceModalOpen(false)}
        />

        {/* Quick Payment Settlement Modal */}
        <PaymentLedgerModal
          isOpen={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
        />
      </div>
    </DeviceWrapper>
  );
};
