import React, { useState } from 'react';
import { useMilk } from '../context/MilkContext';
import { useAuth } from '../context/AuthContext';
import { WhatsAppPreviewModal } from '../components/invoice/WhatsAppPreviewModal';
import { PaymentLedgerModal } from '../components/invoice/PaymentLedgerModal';
import { GlassButton } from '../components/common/GlassButton';
import { Badge } from '../components/common/Badge';
import { getUserAvailableMonths, formatDateDDMMYYYY } from '../utils/dateUtils';
import { Download, ChevronRight, ArrowLeft, MessageSquare, CreditCard, Calendar, IndianRupee, Droplets, Store, History, Wallet, QrCode, FileText, Search, SlidersHorizontal, X, Check } from 'lucide-react';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const InvoiceScreen: React.FC = () => {
  const { invoice, setSelectedMonth, selectedMonth } = useMilk();
  const { user } = useAuth();

  // Dynamic Month List generated strictly from User Account Creation date onwards
  const userMonthList = getUserAvailableMonths(user?.createdAt);

  // Detail View State: null (shows month cards) | monthKey string (e.g. '2026-08')
  const [activeMonthCard, setActiveMonthCard] = useState<string | null>(null);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filterMonth, setFilterMonth] = useState<string>('all');
  const [filterYear, setFilterYear] = useState<string>('all');
  const [activeFilterLabel, setActiveFilterLabel] = useState<string | null>(null);

  // Modals
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleSelectMonthCard = (monthKey: string) => {
    setSelectedMonth(monthKey);
    setActiveMonthCard(monthKey);
  };

  const handleDownloadPDF = (label: string) => {
    const originalTitle = document.title;
    const cleanDateStr = formatDateDDMMYYYY().replace(/\//g, '-');
    const pdfFileName = `RW-Milk-Tracker-Invoice-${label.replace(/\s+/g, '-')}-${cleanDateStr}`;
    document.title = pdfFileName;
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

  const handleApplyFilter = () => {
    let labelParts = [];
    if (filterMonth !== 'all') labelParts.push(filterMonth);
    if (filterYear !== 'all') labelParts.push(filterYear);

    if (labelParts.length > 0) {
      setActiveFilterLabel(labelParts.join(' '));
    } else {
      setActiveFilterLabel(null);
    }

    setFilterModalOpen(false);
  };

  const handleClearFilter = () => {
    setFilterMonth('all');
    setFilterYear('all');
    setActiveFilterLabel(null);
    setSearchQuery('');
  };

  // Filtered month list
  const filteredMonthList = userMonthList.filter((m) => {
    const matchesSearch = searchQuery === '' || m.label.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMonth = filterMonth === 'all' || m.monthName.toLowerCase() === filterMonth.toLowerCase();
    const matchesYear = filterYear === 'all' || m.yearName === filterYear;
    return matchesSearch && matchesMonth && matchesYear;
  });

  const defaultPrice = user?.vendor?.defaultPricePerLitre ?? 60;
  const defaultDaily = user?.vendor?.defaultDailyQuantity ?? 1.5;

  // 1. FULL PREMIUM INVOICE & PDF VIEW (When a Month Card is clicked)
  if (activeMonthCard) {
    const selectedMonthLabel = userMonthList.find((m) => m.key === activeMonthCard)?.label || activeMonthCard;

    return (
      <div className="space-y-5 pb-28 animate-fade-in max-w-4xl mx-auto print:p-0 print:m-0 print:max-w-none">
        
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
            onClick={() => handleDownloadPDF(selectedMonthLabel)}
            className="px-4 py-2 bg-gradient-to-r from-[#0284C7] to-[#0EA5E9] text-white hover:brightness-110 rounded-2xl text-xs font-black shadow-md shadow-cyan-500/20 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <Download size={15} />
            <span>Download PDF</span>
          </button>
        </div>

        {/* Printable Detailed Invoice Document */}
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 text-slate-900 print:shadow-none print:border-none print:rounded-none print:p-2">
          
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
              <p className="text-[11px] font-bold text-slate-500 mt-2">Issued: {formatDateDDMMYYYY()}</p>
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
            <div className="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
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

  // 2. MAIN MONTHLY CARDS LIST VIEW WITH SEARCH & CENTERED POPUP FILTER MODAL
  return (
    <div className="space-y-5 pb-28 animate-fade-in max-w-4xl mx-auto">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-slate-900">Monthly Invoices & Statements</h2>
        <p className="text-xs font-semibold text-slate-500 mt-0.5">
          Select any month card below to view detailed statement & download PDF
        </p>
      </div>

      {/* Search Input Bar + Filter Button */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search month or year (e.g. August 2026)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-300 rounded-2xl text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0284C7] shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Interactive Filter Button */}
        <button
          onClick={() => setFilterModalOpen(true)}
          className={`p-2.5 rounded-2xl border flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer shadow-xs ${
            activeFilterLabel
              ? 'bg-cyan-50 border-[#0284C7] text-[#0284C7]'
              : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <SlidersHorizontal size={16} />
          <span className="hidden sm:inline">Filter</span>
        </button>
      </div>

      {/* Active Filter Pill Bar */}
      {(activeFilterLabel || searchQuery) && (
        <div className="flex items-center justify-between bg-cyan-50 border border-cyan-200 rounded-2xl px-3.5 py-2 text-xs font-bold text-[#0284C7]">
          <span>
            Active Filter: <strong>{activeFilterLabel || searchQuery}</strong>
          </span>
          <button
            onClick={handleClearFilter}
            className="text-cyan-800 hover:text-cyan-950 font-black text-xs underline flex items-center gap-1 cursor-pointer"
          >
            <X size={13} /> Clear
          </button>
        </div>
      )}

      {/* Monthly Cards List Grid */}
      {filteredMonthList.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center text-xs font-semibold text-slate-500 space-y-2">
          <p>No month invoices match your search or filter.</p>
          <button
            onClick={handleClearFilter}
            className="text-[#0284C7] font-bold hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredMonthList.map((m) => {
            return (
              <div
                key={m.key}
                onClick={() => handleSelectMonthCard(m.key)}
                className="bg-white hover:bg-slate-50 border-2 border-slate-200/90 hover:border-[#0284C7] rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group space-y-3 relative overflow-hidden"
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
                <div className="pt-2.5 border-t border-slate-200 flex items-center justify-between text-xs">
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
      )}

      {/* FILTER POPUP MODAL (FIXED INSET-0 Z-[100] SCREEN CENTERED) */}
      {filterModalOpen && (
        <div className="fixed inset-0 top-0 left-0 right-0 bottom-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 w-full max-w-sm space-y-4 my-auto relative z-[101]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
                <SlidersHorizontal size={18} className="text-[#0284C7]" />
                <span>Filter Month Invoices</span>
              </div>
              <button
                onClick={() => setFilterModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Select Month */}
            <div>
              <label className="block text-[11px] font-extrabold uppercase mb-1 text-slate-600">Select Month</label>
              <select
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#0284C7]"
              >
                <option value="all">All Months</option>
                {MONTH_NAMES.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* Select Year */}
            <div>
              <label className="block text-[11px] font-extrabold uppercase mb-1 text-slate-600">Select Year</label>
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#0284C7]"
              >
                <option value="all">All Years</option>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleClearFilter}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold cursor-pointer transition-colors"
              >
                Reset
              </button>
              <button
                onClick={handleApplyFilter}
                className="flex-1 py-2.5 bg-[#0284C7] hover:bg-[#0369A1] text-white rounded-2xl text-xs font-black shadow-md flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95"
              >
                <Check size={16} /> Apply Filter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
