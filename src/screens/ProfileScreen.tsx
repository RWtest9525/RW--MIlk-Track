import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { GlassButton } from '../components/common/GlassButton';
import { DeleteAccountScreen } from './DeleteAccountScreen';
import { formatDateDDMMYYYY } from '../utils/dateUtils';
import { User, Store, Phone, IndianRupee, Droplets, LogOut, CheckCircle, Save, ChevronRight, ShieldCheck, FileText, Info, ArrowLeft, Camera, Calendar, Building2, Trash2 } from 'lucide-react';

export const ProfileScreen: React.FC = () => {
  const { user, updateUserProfile, updateVendorProfile, logout } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Navigation sub-views: null (main menu) | 'profile_page' | 'vendor_page' | 'delete_page' | 'terms_page' | 'privacy_page' | 'about_page'
  const [subView, setSubView] = useState<'profile_page' | 'vendor_page' | 'delete_page' | 'terms_page' | 'privacy_page' | 'about_page' | null>(null);

  // Profile Form States
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');

  // Vendor Form States
  const [vendorName, setVendorName] = useState(user?.vendor?.name || '');
  const [vendorPhone, setVendorPhone] = useState(user?.vendor?.phone || '');
  const [pricePerLitre, setPricePerLitre] = useState(user?.vendor?.defaultPricePerLitre || 60);
  const [defaultQty, setDefaultQty] = useState(user?.vendor?.defaultDailyQuantity || 1.5);
  const [preferredSlot, setPreferredSlot] = useState<'morning' | 'evening' | 'both'>(user?.vendor?.preferredSlot || 'morning');

  const [savedUser, setSavedUser] = useState(false);
  const [savedVendor, setSavedVendor] = useState(false);

  // Gallery Photo Picker Trigger
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Photo = reader.result as string;
        await updateUserProfile(user?.name || '', user?.phone || '', base64Photo);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserProfile(name, phone);
    setSavedUser(true);
    setTimeout(() => setSavedUser(false), 2000);
  };

  const handleSaveVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    await updateVendorProfile({
      ...user.vendor,
      name: vendorName,
      phone: vendorPhone,
      defaultPricePerLitre: Number(pricePerLitre),
      defaultDailyQuantity: Number(defaultQty),
      preferredSlot,
    });
    setSavedVendor(true);
    setTimeout(() => setSavedVendor(false), 2000);
  };

  // 1. DEDICATED PAGE VIEW: Delete Account
  if (subView === 'delete_page') {
    return <DeleteAccountScreen onBack={() => setSubView(null)} />;
  }

  // 2. DEDICATED PAGE VIEW: Terms & Conditions
  if (subView === 'terms_page') {
    return (
      <div className="space-y-5 pb-28 animate-fade-in max-w-2xl mx-auto">
        <button
          onClick={() => setSubView(null)}
          className="inline-flex items-center gap-2 text-xs font-black text-slate-600 hover:text-[#0284C7] transition-colors cursor-pointer py-1"
        >
          <ArrowLeft size={16} />
          <span>Back to Settings</span>
        </button>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl space-y-4 text-slate-900">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-[#0284C7]">
              <FileText size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">Terms & Conditions</h2>
              <p className="text-xs font-semibold text-slate-500">Last updated: August 2026</p>
            </div>
          </div>

          <div className="space-y-3 text-xs leading-relaxed text-slate-700">
            <p>Welcome to <strong>RW-Milk Tracker</strong>. By logging in or using our service, you agree to comply with and be bound by the following terms.</p>
            <h4 className="font-extrabold text-slate-900 text-xs">1. Daily Milk Logging</h4>
            <p>Users are responsible for accurately recording daily milk deliveries, quantity overrides, and monthly settlements.</p>
            <h4 className="font-extrabold text-slate-900 text-xs">2. Account Responsibility</h4>
            <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
            <h4 className="font-extrabold text-slate-900 text-xs">3. Data Usage</h4>
            <p>Your delivery logs and rate settings are stored securely in Google Cloud Firestore to generate monthly statements and PDF invoices.</p>
          </div>
        </div>
      </div>
    );
  }

  // 3. DEDICATED PAGE VIEW: Privacy Policy
  if (subView === 'privacy_page') {
    return (
      <div className="space-y-5 pb-28 animate-fade-in max-w-2xl mx-auto">
        <button
          onClick={() => setSubView(null)}
          className="inline-flex items-center gap-2 text-xs font-black text-slate-600 hover:text-[#0284C7] transition-colors cursor-pointer py-1"
        >
          <ArrowLeft size={16} />
          <span>Back to Settings</span>
        </button>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl space-y-4 text-slate-900">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">Privacy Policy</h2>
              <p className="text-xs font-semibold text-slate-500">Google Play Compliant Privacy Standard</p>
            </div>
          </div>

          <div className="space-y-3 text-xs leading-relaxed text-slate-700">
            <p>Your privacy is important to us. RW-Milk Tracker collects only necessary data to manage milk delivery records and monthly statements.</p>
            <h4 className="font-extrabold text-slate-900 text-xs">Information We Collect</h4>
            <p>We collect your email, name, phone number, vendor contact details, and daily milk quantity logs.</p>
            <h4 className="font-extrabold text-slate-900 text-xs">Data Security & Account Deletion</h4>
            <p>All data is synchronized securely with Cloud Firestore. You can permanently request full account & data deletion at any time via the Delete Account option.</p>
          </div>
        </div>
      </div>
    );
  }

  // 4. DEDICATED PAGE VIEW: About RW-Milk Tracker
  if (subView === 'about_page') {
    return (
      <div className="space-y-5 pb-28 animate-fade-in max-w-2xl mx-auto">
        <button
          onClick={() => setSubView(null)}
          className="inline-flex items-center gap-2 text-xs font-black text-slate-600 hover:text-[#0284C7] transition-colors cursor-pointer py-1"
        >
          <ArrowLeft size={16} />
          <span>Back to Settings</span>
        </button>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl space-y-4 text-slate-900 text-center">
          <img
            src="/logo.png"
            alt="RW-Milk Tracker"
            className="w-20 h-20 rounded-full border-4 border-[#0284C7] object-cover shadow-md mx-auto"
          />
          <div>
            <h2 className="text-xl font-black text-slate-900">RW-Milk Tracker</h2>
            <p className="text-xs font-extrabold text-[#0284C7]">Version 1.0.0 (Production Build)</p>
          </div>

          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed font-semibold">
            RW-Milk Tracker is an intelligent, modern dairy logistics app designed for households and dairy vendors to track daily milk consumption, settle monthly dues, and generate PDF statements.
          </p>

          <div className="pt-4 border-t border-slate-100 text-[11px] font-bold text-slate-500">
            Powered by Firebase Cloud Firestore & React 18
          </div>
        </div>
      </div>
    );
  }

  // 5. DEDICATED PAGE VIEW: Profile Settings Page
  if (subView === 'profile_page') {
    return (
      <div className="space-y-5 pb-28 animate-fade-in max-w-xl mx-auto">
        <button
          onClick={() => setSubView(null)}
          className="inline-flex items-center gap-2 text-xs font-black text-slate-600 hover:text-[#0284C7] transition-colors cursor-pointer py-1"
        >
          <ArrowLeft size={16} />
          <span>Back to Settings</span>
        </button>

        <form onSubmit={handleSaveUser} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-[#0284C7]">
                <User size={20} />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">My Profile Settings</h2>
                <p className="text-xs font-semibold text-slate-500">Update full name & mobile number</p>
              </div>
            </div>
            {savedUser && (
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle size={15} /> Saved!
              </span>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-extrabold uppercase mb-1 text-slate-700">Full Name</label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#0284C7]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-extrabold uppercase mb-1 text-slate-700">Mobile Phone Number</label>
            <div className="relative">
              <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#0284C7]"
              />
            </div>
          </div>

          <GlassButton
            variant="primary"
            size="lg"
            className="w-full font-black py-3.5 shadow-md shadow-cyan-500/20"
            icon={<Save size={17} />}
            type="submit"
          >
            Save Profile Changes
          </GlassButton>
        </form>
      </div>
    );
  }

  // 6. DEDICATED PAGE VIEW: Vendor & Delivery Settings Page
  if (subView === 'vendor_page') {
    return (
      <div className="space-y-5 pb-28 animate-fade-in max-w-xl mx-auto">
        <button
          onClick={() => setSubView(null)}
          className="inline-flex items-center gap-2 text-xs font-black text-slate-600 hover:text-[#0284C7] transition-colors cursor-pointer py-1"
        >
          <ArrowLeft size={16} />
          <span>Back to Settings</span>
        </button>

        <form onSubmit={handleSaveVendor} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <Store size={20} />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">Vendor & Rates Settings</h2>
                <p className="text-xs font-semibold text-slate-500">Dairy vendor name, rate per litre & preferred slot</p>
              </div>
            </div>
            {savedVendor && (
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle size={15} /> Saved!
              </span>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-extrabold uppercase mb-1 text-slate-700">Vendor / Dairy Name</label>
            <div className="relative">
              <Store size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#0284C7]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-extrabold uppercase mb-1 text-slate-700">Vendor WhatsApp Phone Number</label>
            <div className="relative">
              <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={vendorPhone}
                onChange={(e) => setVendorPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#0284C7]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-extrabold uppercase mb-1 text-slate-700">Price / Litre (₹)</label>
              <div className="relative">
                <IndianRupee size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0284C7]" />
                <input
                  type="number"
                  value={pricePerLitre}
                  onChange={(e) => setPricePerLitre(Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-extrabold text-slate-900 focus:outline-none focus:border-[#0284C7]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-extrabold uppercase mb-1 text-slate-700">Default Daily Qty (L)</label>
              <div className="relative">
                <Droplets size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0284C7]" />
                <input
                  type="number"
                  step="0.5"
                  value={defaultQty}
                  onChange={(e) => setDefaultQty(Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-extrabold text-slate-900 focus:outline-none focus:border-[#0284C7]"
                />
              </div>
            </div>
          </div>

          <GlassButton
            variant="primary"
            size="lg"
            className="w-full font-black py-3.5 shadow-md shadow-cyan-500/20"
            icon={<Save size={17} />}
            type="submit"
          >
            Save Vendor & Rate Settings
          </GlassButton>
        </form>
      </div>
    );
  }

  // 7. MAIN SETTINGS MENU VIEW WITH COPYRIGHT NOTICE
  return (
    <div className="space-y-5 pb-28 animate-fade-in max-w-xl mx-auto">
      
      {/* Hidden Gallery Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
      />

      {/* User Header Profile Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center gap-3.5">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative group cursor-pointer shrink-0"
            title="Tap to choose profile photo from gallery"
          >
            <img
              src={user?.photoURL || '/logo.png'}
              alt="User Profile"
              className="w-16 h-16 rounded-full border-2 border-[#0284C7] object-cover shadow-sm bg-white p-0 group-hover:brightness-90 transition-all"
            />
            <div className="absolute inset-0 rounded-full bg-black/30 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera size={18} />
            </div>
            <span className="absolute bottom-0 right-0 w-5.5 h-5.5 bg-[#0284C7] text-white rounded-full flex items-center justify-center border-2 border-white shadow-sm">
              <Camera size={11} />
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-base sm:text-lg font-black text-slate-900 truncate">
              {user?.name || 'Customer Profile'}
            </h2>

            <p className="text-xs font-semibold text-slate-500 truncate mt-0.5">
              {user?.phone || 'Mobile not set'} • {user?.email || 'Email user'}
            </p>

            <div className="flex flex-wrap items-center gap-2 mt-2">
              <div className="inline-flex items-center gap-1 bg-cyan-50 border border-cyan-200 text-cyan-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full max-w-full">
                <Store size={12} className="text-[#0284C7] shrink-0" />
                <span className="truncate">{user?.vendor?.name || 'Dairy Vendor'}</span>
              </div>

              {/* Account Created Date DD/MM/YYYY */}
              <div className="inline-flex items-center gap-1 bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                <Calendar size={11} className="text-slate-500 shrink-0" />
                <span className="truncate">Created: {formatDateDDMMYYYY(user?.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Settings Line-by-Line Stacked Button Menu */}
      <div className="space-y-3">
        
        {/* Button 1: My Profile Settings */}
        <button
          type="button"
          onClick={() => setSubView('profile_page')}
          className="w-full bg-white hover:bg-slate-50 border border-slate-200 rounded-3xl p-4 flex items-center justify-between shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-[#0284C7] shrink-0 group-hover:scale-105 transition-transform">
              <User size={20} />
            </div>
            <div className="text-left min-w-0">
              <h3 className="text-sm font-black text-slate-900 group-hover:text-[#0284C7] transition-colors truncate">My Profile Settings</h3>
              <p className="text-[11px] font-semibold text-slate-500 truncate">Edit full name & mobile number</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-slate-400 group-hover:translate-x-1 transition-transform shrink-0 ml-2" />
        </button>

        {/* Button 2: Vendor & Delivery Settings */}
        <button
          type="button"
          onClick={() => setSubView('vendor_page')}
          className="w-full bg-white hover:bg-slate-50 border border-slate-200 rounded-3xl p-4 flex items-center justify-between shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0 group-hover:scale-105 transition-transform">
              <Store size={20} />
            </div>
            <div className="text-left min-w-0">
              <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-600 transition-colors truncate">Vendor & Milk Delivery Settings</h3>
              <p className="text-[11px] font-semibold text-slate-500 truncate">Dairy name, price per litre & default daily quantity</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-slate-400 group-hover:translate-x-1 transition-transform shrink-0 ml-2" />
        </button>

        {/* Line-by-Line Stacked Legal & App Options */}
        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-xs space-y-1">
          <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-wider mb-2 px-1">Legal & Data Privacy</h4>

          <button
            onClick={() => setSubView('terms_page')}
            className="w-full p-3 rounded-2xl hover:bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-800 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <FileText size={16} className="text-[#0284C7] shrink-0" />
              <span className="truncate">Terms & Conditions</span>
            </div>
            <ChevronRight size={16} className="text-slate-400 shrink-0 ml-2" />
          </button>

          <button
            onClick={() => setSubView('privacy_page')}
            className="w-full p-3 rounded-2xl hover:bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-800 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
              <span className="truncate">Privacy Policy</span>
            </div>
            <ChevronRight size={16} className="text-slate-400 shrink-0 ml-2" />
          </button>

          <button
            onClick={() => setSubView('about_page')}
            className="w-full p-3 rounded-2xl hover:bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-800 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Info size={16} className="text-purple-600 shrink-0" />
              <span className="truncate">About RW-Milk Tracker (v1.0)</span>
            </div>
            <ChevronRight size={16} className="text-slate-400 shrink-0 ml-2" />
          </button>

          <button
            onClick={() => setSubView('delete_page')}
            className="w-full p-3 rounded-2xl hover:bg-rose-50 flex items-center justify-between text-xs font-bold text-rose-600 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Trash2 size={16} className="text-rose-600 shrink-0" />
              <span className="truncate">Delete Account & Data (Play Store)</span>
            </div>
            <ChevronRight size={16} className="text-rose-400 shrink-0 ml-2" />
          </button>
        </div>

        {/* Sign Out Button */}
        <GlassButton
          variant="danger"
          size="lg"
          className="w-full font-black mt-3 py-3.5 shadow-md shadow-rose-500/20"
          icon={<LogOut size={17} />}
          onClick={logout}
        >
          Sign Out of Account
        </GlassButton>

        {/* Copyright Notice */}
        <div className="pt-4 text-center text-[11px] font-bold text-slate-400 space-y-1">
          <p>© 2026 RW-Milk Tracker Inc. All rights reserved.</p>
          <p className="text-[10px] text-slate-400 font-medium">Designed & Developed for Smart Dairy Logistics</p>
        </div>
      </div>
    </div>
  );
};
