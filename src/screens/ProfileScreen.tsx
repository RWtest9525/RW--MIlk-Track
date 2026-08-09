import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { GlassButton } from '../components/common/GlassButton';
import { LegalModal, LegalType } from '../components/common/LegalModal';
import { DeleteAccountScreen } from './DeleteAccountScreen';
import { User, Store, Phone, IndianRupee, Droplets, LogOut, CheckCircle, Save, ChevronRight, ShieldCheck, FileText, Info, ArrowLeft, Trash2, Camera } from 'lucide-react';

export const ProfileScreen: React.FC = () => {
  const { user, updateUserProfile, updateVendorProfile, logout } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Navigation sub-views: null (main menu) | 'profile_page' | 'vendor_page' | 'delete_page'
  const [subView, setSubView] = useState<'profile_page' | 'vendor_page' | 'delete_page' | null>(null);

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

  // Legal Modal
  const [legalModalType, setLegalModalType] = useState<LegalType | null>(null);

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

  // 2. DEDICATED PAGE VIEW: Profile Settings Page
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

  // 3. DEDICATED PAGE VIEW: Vendor & Delivery Settings Page
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

  // 4. MAIN SETTINGS MENU VIEW WITH DIRECT AVATAR GALLERY PICKER ON TOP CARD
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

      {/* User Header Profile Card with Direct Gallery Photo Chooser */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex items-center gap-4">
        <div
          onClick={() => fileInputRef.current?.click()}
          className="relative group cursor-pointer shrink-0"
          title="Click to choose profile photo from gallery"
        >
          <img
            src={user?.photoURL || '/logo.png'}
            alt="User Profile"
            className="w-16 h-16 rounded-full border-2 border-[#0284C7] object-cover shadow-sm bg-white p-0 group-hover:brightness-90 transition-all"
          />
          <div className="absolute inset-0 rounded-full bg-black/30 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera size={18} />
          </div>
          <span className="absolute bottom-0 right-0 w-5 h-5 bg-[#0284C7] text-white rounded-full flex items-center justify-center border border-white shadow-sm">
            <Camera size={10} />
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900 truncate">
              {user?.name || 'Customer Profile'}
            </h2>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-[10px] font-black text-[#0284C7] hover:underline cursor-pointer"
            >
              Change Photo
            </button>
          </div>
          <p className="text-xs font-semibold text-slate-500 truncate">
            {user?.phone || 'Mobile not set'} • {user?.email || 'Email user'}
          </p>
          <div className="inline-flex items-center gap-1 bg-cyan-50 border border-cyan-200 text-cyan-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full mt-1.5">
            <Store size={12} className="text-[#0284C7]" />
            <span className="truncate">{user?.vendor?.name || 'Dairy Vendor'}</span>
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
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-[#0284C7] shrink-0 group-hover:scale-105 transition-transform">
              <User size={20} />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-black text-slate-900 group-hover:text-[#0284C7] transition-colors">My Profile Settings</h3>
              <p className="text-[11px] font-semibold text-slate-500">Edit full name & mobile number</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Button 2: Vendor & Delivery Settings */}
        <button
          type="button"
          onClick={() => setSubView('vendor_page')}
          className="w-full bg-white hover:bg-slate-50 border border-slate-200 rounded-3xl p-4 flex items-center justify-between shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0 group-hover:scale-105 transition-transform">
              <Store size={20} />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-600 transition-colors">Vendor & Milk Delivery Settings</h3>
              <p className="text-[11px] font-semibold text-slate-500">Dairy name, price per litre & default daily quantity</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Line-by-Line Stacked Legal & App Options */}
        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-xs space-y-1">
          <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-wider mb-2 px-1">Legal & Data Privacy</h4>

          <button
            onClick={() => setLegalModalType('terms')}
            className="w-full p-3 rounded-2xl hover:bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-800 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <FileText size={16} className="text-[#0284C7]" />
              <span>Terms & Conditions</span>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </button>

          <button
            onClick={() => setLegalModalType('privacy')}
            className="w-full p-3 rounded-2xl hover:bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-800 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck size={16} className="text-emerald-600" />
              <span>Privacy Policy</span>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </button>

          <button
            onClick={() => setLegalModalType('about')}
            className="w-full p-3 rounded-2xl hover:bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-800 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Info size={16} className="text-purple-600" />
              <span>About RW-Milk Tracker (v1.0)</span>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </button>

          <button
            onClick={() => setSubView('delete_page')}
            className="w-full p-3 rounded-2xl hover:bg-rose-50 flex items-center justify-between text-xs font-bold text-rose-600 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Trash2 size={16} className="text-rose-600" />
              <span>Delete Account & Data (Play Store)</span>
            </div>
            <ChevronRight size={16} className="text-rose-400" />
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
      </div>

      {/* Legal Modal */}
      <LegalModal
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />
    </div>
  );
};
