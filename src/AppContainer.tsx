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
import { ArrowLeft } from 'lucide-react';

export const AppContainer: React.FC = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Modals state
  const [todayModalOpen, setTodayModalOpen] = useState<boolean>(false);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState<boolean>(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState<boolean>(false);

  // Check URL pathname or search query for Public Unauthenticated Routes
  const pathname = window.location.pathname.toLowerCase();
  const search = window.location.search.toLowerCase();
  const isPrivacyRoute = pathname.includes('privacy') || search.includes('privacy');
  const isDeleteRoute = pathname.includes('delete-account') || search.includes('delete');

  // 1. PUBLIC ROUTE: Privacy Policy (No Login Required)
  if (isPrivacyRoute) {
    return (
      <div className="min-h-screen w-full bg-[#F8FAFC] text-slate-900 p-4 sm:p-8 animate-fade-in">
        <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <img src="/logo.png" alt="RW-Milk Tracker" className="w-12 h-12 rounded-full border-2 border-[#0284C7] object-cover" />
            <div>
              <h1 className="text-xl font-black text-slate-900">Privacy Policy</h1>
              <p className="text-xs font-extrabold text-[#0284C7]">RW-Milk Tracker • Google Play Policy Compliant</p>
            </div>
          </div>

          <div className="space-y-4 text-xs leading-relaxed text-slate-700">
            <p>Welcome to <strong>RW-Milk Tracker</strong>. Your privacy is paramount. This Privacy Policy explains how our application collects, uses, and safeguards your personal information.</p>
            <h3 className="font-extrabold text-slate-900 text-sm">1. Information We Collect</h3>
            <p>We collect Account Credentials (Name, Email, Phone), Vendor & Rate settings, and Daily Milk Delivery status logs (Delivered, Missed, Custom Quantity).</p>
            <h3 className="font-extrabold text-slate-900 text-sm">2. How We Use Data</h3>
            <p>Data is used strictly to sync milk records across your devices and calculate monthly statements & PDF invoices.</p>
            <h3 className="font-extrabold text-slate-900 text-sm">3. Account & Data Erasure</h3>
            <p>You can request permanent account deletion inside Profile Settings or via our Delete Account page.</p>
          </div>

          <div className="pt-4 border-t border-slate-100 text-center">
            <a href="/" className="inline-flex items-center gap-2 text-xs font-black text-[#0284C7] hover:underline">
              <ArrowLeft size={16} /> Return to App Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  // 2. PUBLIC ROUTE: Account Deletion Page (No Login Required)
  if (isDeleteRoute) {
    return (
      <div className="min-h-screen w-full bg-[#F8FAFC] text-slate-900 p-4 sm:p-8 animate-fade-in">
        <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <img src="/logo.png" alt="RW-Milk Tracker" className="w-12 h-12 rounded-full border-2 border-rose-600 object-cover" />
            <div>
              <h1 className="text-xl font-black text-slate-900">Account & Data Deletion</h1>
              <p className="text-xs font-extrabold text-rose-600">Google Play Data Safety Compliant</p>
            </div>
          </div>

          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-xs text-rose-950 font-medium">
            ⚠️ Deleting your account is permanent. All your delivery logs, vendor profiles, price settings, and payment ledger history will be permanently deleted from Cloud Firestore.
          </div>

          <div className="space-y-3 text-xs leading-relaxed text-slate-700">
            <h3 className="font-extrabold text-slate-900 text-sm">How to Delete Your Account</h3>
            <p>1. Open RW-Milk Tracker App → Profile Settings → Tap <strong>Delete Account & Data</strong>.</p>
            <p>2. Or email <strong>support@rw-milk-tracker.com</strong> with subject "ACCOUNT DELETION REQUEST".</p>
          </div>

          <div className="pt-4 border-t border-slate-100 text-center">
            <a href="/" className="inline-flex items-center gap-2 text-xs font-black text-[#0284C7] hover:underline">
              <ArrowLeft size={16} /> Return to App Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  // 3. While Auth is checking initial token state -> Show minimal blank background (No Flash of Dashboard!)
  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#F8FAFC] flex items-center justify-center">
        <img src="/logo.png" alt="Logo" className="w-12 h-12 rounded-full animate-pulse border-2 border-[#0284C7]" />
      </div>
    );
  }

  // 4. If not logged in -> Auth Screen (Sign In / Register)
  if (!user) {
    return (
      <div className="min-h-screen w-full bg-[#F8FAFC] text-slate-900">
        <AuthScreen />
      </div>
    );
  }

  // 5. If logged in but not onboarded -> Setup Screen
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
    <div className="min-h-screen w-full flex flex-col relative bg-[#F8FAFC] text-slate-900 pt-2">
      {/* Top Navbar: ONLY ON DASHBOARD */}
      {activeTab === 'dashboard' && <Header activeTab={activeTab} />}

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8 pt-4">
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
