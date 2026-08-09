import React, { useState } from 'react';
import { useMilk } from '../context/MilkContext';
import { useAuth } from '../context/AuthContext';
import { WhatsAppPreviewModal } from '../components/invoice/WhatsAppPreviewModal';
import { PaymentLedgerModal } from '../components/invoice/PaymentLedgerModal';
import { GlassButton } from '../components/common/GlassButton';
import { Badge } from '../components/common/Badge';
import { Download, ChevronRight, ArrowLeft, MessageSquare, CreditCard, Calendar, IndianRupee, Droplets, Store, History, Wallet, QrCode, FileText, Printer } from 'lucide-react';

const MONTH_LIST = [
  { key: '2026-08', label: 'AUGUST 2026' },
  { key: '2026-07', label: 'JULY 2026' },
  { key: '2026-06', label: 'JUNE 2026' },
  { key: '2026-05', label: 'MAY 2026' },
  { key: '2026-04', label: 'APRIL 2026' },
  { key: '2026-03', label: 'MARCH 2026' },
  { key: '2026-02', label: 'FEBRUARY 2026' },
  { key: '2026-01', label: 'JANUARY 2026' },
];

export const InvoiceScreen: React.FC = () => {
  const { invoice, setSelectedMonth, selectedMonth, logs } = useMilk();
  const { user } = useAuth();

  // Selected Month Card Detail View: null (shows month cards) | monthKey string (e.g. '2026-01')
  const [activeMonthCard, setActiveMonthCard] = useState<string | null>(null);

  // Modals
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleSelectMonthCard = (monthKey: string) => {
    setSelectedMonth(monthKey);
    setActiveMonthCard(monthKey);
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const defaultPrice = user?.vendor?.defaultPricePerLitre ?? 60;
  const defaultDaily = user?.vendor?.defaultDailyQuantity ?? 1.5;

  // 1. FULL PREMIUM INVOICE & PDF VIEW (When a Month Card is clicked)
  if (activeMonthCard) {
    const selectedMonthLabel = MONTH_LIST.find((m) => m.key === activeMonthCard)?.label || activeMonthCard;

    return (
      <div className="space-y-5 pb-28 animate-fade-in max-w-4xl mx-auto print:p-0 print:m-0">
        
        {/* Top Action Bar: Back button + Top Right Download PDF Button */}
        <div className="flex items-center justify-between print:hidden">
          <button
            onClick={() => setActiveMonthCard(null)}
            className="inline-flex items-center gap-2 text-xs font-black text-slate-700 hover:text-[#0284C7] transition-colors cursor-pointer py-1"
          >
            <ArrowLeft size={16} />
            <span>Back to All Month Invoices</span>
          </button>

          {/* Top Right Download PDF Button */}
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 bg-gradient-to-r from-[#0284C7] to-[#0EA5E9] text-white hover:brightness-110 rounded-2xl text-xs font-black shadow-md shadow-cyan-500/20 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <Download size={15} />
            <span>Download PDF</span>
          </button>
        </div>

        {/* Printable Detailed Invoice Document */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 text-slate-900 print:shadow-none print:border-none">
          
          {/* Invoice Document Header */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-5">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="RW-Milk Tracker"
                className="w-14 h-14 rounded-full border-2 border-[#0284C7] object-cover shadow-sm bg-white p-0 shrink-0"
              />
              <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight">RW-Milk Tracker Invoice</h1>
                <p className="text-xs font-extrabold text-[#0284C7]">{selectedMonthLabel}</p>
                <p className="text-[11px] font-semibold text-slate-500 mt-0.5">Invoice ID: INV-{activeMonthCard.replace('-', '')}</p>
              </div>
            </div>

            <div className="text-right">
              <Badge variant={invoice.status === 'paid' ? 'paid' : invoice.status === 'partial' ? 'custom' : 'unpaid'}>
                {invoice.status === 'paid' ? 'Paid' : invoice.status === 'partial' ? 'Partial Settlement' : 'Unpaid Dues'}
              </Badge>
              <p className="text-[11px] font-bold text-slate-500 mt-2">Issued: {new Date().toLocaleDateString('en-IN')}</p>
            </div>
          </div>

          {/* Customer & Vendor Details */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Customer Details</span>
              <p className="font-extrabold text-slate-900 mt-1 text-sm">{user?.name || 'Customer'}</p>
              <p className="text-slate-600 font-semibold">{user?.phone || 'No phone set'}</p>
              <p className="text-slate-500 font-medium">{user?.email}</p>
            </div>

            <div>
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Dairy Vendor</span>
              <p className="font-extrabold text-slate-900 mt-1 text-sm">{user?.vendor?.name || 'Amul Milk Express'}</p>
              <p className="text-slate-600 font-semibold">Phone: {user?.vendor?.phone || 'Vendor Phone'}</p>
              <p className="text-slate-500 font-medium">Rate: ₹{user?.vendor?.defaultPricePerLitre} / Litre</p>
            </div>
          </div>

          {/* Cost Summary Breakdown */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">Billing Summary</h3>
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
              <div className="p-3.5 flex justify-between text-xs border-b border-slate-100">
                <span className="font-semibold text-slate-600">Total Days in Month</span>
                <span className="font-extrabold text-slate-900">{invoice.totalDays} Days</span>
              </div>

              <div className="p-3.5 flex justify-between text-xs border-b border-slate-100">
                <span className="font-semibold text-slate-600">Delivered Days</span>
                <span className="font-extrabold text-emerald-700">{invoice.deliveredDays} Days</span>
              </div>

              <div className="p-3.5 flex justify-between text-xs border-b border-slate-100">
                <span className="font-semibold text-slate-600">Missed Days (0L)</span>
                <span className="font-extrabold text-rose-600">{invoice.missedDays} Days</span>
              </div>

              <div className="p-3.5 flex justify-between text-xs border-b border-slate-100">
                <span className="font-semibold text-slate-600">Total Milk Consumed</span>
                <span className="font-extrabold text-[#0284C7]">{invoice.totalLitres.toFixed(1)} Litres</span>
              </div>

              <div className="p-3.5 flex justify-between text-xs border-b border-slate-100 bg-slate-50">
                <span className="font-semibold text-slate-600">Current Month Milk Bill ({invoice.totalLitres.toFixed(1)}L × ₹{user?.vendor?.defaultPricePerLitre})</span>
                <span className="font-extrabold text-slate-900">₹{invoice.currentMonthCost.toLocaleString('en-IN')}</span>
              </div>

              {invoice.previousPendingBalance > 0 && (
                <div className="p-3.5 flex justify-between text-xs border-b border-slate-100 bg-amber-50">
                  <span className="font-semibold text-amber-900">Carryover Previous Pending Dues</span>
                  <span className="font-extrabold text-amber-800">+₹{invoice.previousPendingBalance.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="p-4 flex justify-between items-center bg-cyan-50/80">
                <span className="font-black text-sm text-slate-900">Total Net Amount Payable</span>
                <span className="font-black text-xl text-[#0284C7]">₹{invoice.totalAmountDue.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions (Hidden during print) */}
          <div className="grid grid-cols-2 gap-3 pt-2 print:hidden">
            <GlassButton
              variant="primary"
              size="md"
              className="w-full font-black py-3 shadow-md shadow-emerald-500/20"
              icon={<MessageSquare size={16} />}
              onClick={() => setShowWhatsAppModal(true)}
            >
              Send WhatsApp Invoice
            </GlassButton>

            <GlassButton
              variant="secondary"
              size="md"
              className="w-full font-black py-3"
              icon={<CreditCard size={16} />}
              onClick={() => setShowPaymentModal(true)}
            >
              Record Payment
            </GlassButton>
          </div>
        </div>

        {/* Modals */}
        <WhatsAppPreviewModal
          isOpen={showWhatsAppModal}
          onClose={() => setShowWhatsAppModal(false)}
        />
        <PaymentLedgerModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
        />
      </div>
    );
  }

  // 2. MAIN MONTHLY CARDS LIST VIEW
  return (
    <div className="space-y-5 pb-28 animate-fade-in max-w-4xl mx-auto">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-slate-900">Monthly Invoices & Bills</h2>
        <p className="text-xs font-semibold text-slate-500 mt-0.5">
          Select any month card below to view detailed invoice & download PDF
        </p>
      </div>

      {/* Monthly Cards List Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {MONTH_LIST.map((m) => {
          return (
            <div
              key={m.key}
              onClick={() => handleSelectMonthCard(m.key)}
              className="bg-white hover:bg-slate-50 border border-slate-200 rounded-3xl p-5 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group space-y-3 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-[#0284C7] shrink-0 group-hover:scale-105 transition-transform">
                    <FileText size={19} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 group-hover:text-[#0284C7] transition-colors">
                      {m.label}
                    </h3>
                    <span className="text-[10px] font-bold text-slate-400">Monthly Statement</span>
                  </div>
                </div>

                <ChevronRight size={18} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
              </div>

              {/* Card Footer Info */}
              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Est. Rate</span>
                  <span className="font-extrabold text-slate-900">₹{defaultPrice}/L</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Default Qty</span>
                  <span className="font-extrabold text-slate-900">{defaultDaily} L/Day</span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">View Bill</span>
                  <span className="font-black text-[#0284C7] text-xs">View Invoice →</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
