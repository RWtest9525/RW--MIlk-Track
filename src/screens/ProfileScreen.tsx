import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { GlassButton } from '../components/common/GlassButton';
import { LegalModal, LegalType } from '../components/common/LegalModal';
import { User, Store, Phone, IndianRupee, Droplets, LogOut, CheckCircle, Save, ChevronRight, ShieldCheck, FileText, Info, ChevronDown } from 'lucide-react';

export const ProfileScreen: React.FC = () => {
  const { user, updateUserProfile, updateVendorProfile, logout } = useAuth();

  // Active accordion section: 'profile' | 'vendor' | null
  const [activeSection, setActiveSection] = useState<'profile' | 'vendor' | null>('profile');

  // Form states
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');

  const [vendorName, setVendorName] = useState(user?.vendor?.name || '');
  const [vendorPhone, setVendorPhone] = useState(user?.vendor?.phone || '');
  const [pricePerLitre, setPricePerLitre] = useState(user?.vendor?.defaultPricePerLitre || 60);
  const [defaultQty, setDefaultQty] = useState(user?.vendor?.defaultDailyQuantity || 1.5);
  const [preferredSlot, setPreferredSlot] = useState<'morning' | 'evening' | 'both'>(user?.vendor?.preferredSlot || 'morning');

  const [savedUser, setSavedUser] = useState(false);
  const [savedVendor, setSavedVendor] = useState(false);

  // Legal Modal
  const [legalModalType, setLegalModalType] = useState<LegalType | null>(null);

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

  return (
    <div className="space-y-5 pb-28 animate-fade-in max-w-2xl mx-auto">
      
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex items-center gap-4">
        <img
          src="/logo.png"
          alt="RW-Milk Tracker Logo"
          className="w-16 h-16 rounded-full border-2 border-[#0284C7] object-cover shadow-sm bg-white p-0 shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-black text-slate-900 truncate">
            {user?.name || 'Customer Profile'}
          </h2>
          <p className="text-xs font-semibold text-slate-500 truncate">
            {user?.phone || 'Mobile not set'} • {user?.email || 'Email user'}
          </p>
          <div className="inline-flex items-center gap-1 bg-cyan-50 border border-cyan-200 text-cyan-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full mt-1.5">
            <Store size={12} className="text-[#0284C7]" />
            <span className="truncate">{user?.vendor?.name || 'Dairy Vendor'}</span>
          </div>
        </div>
      </div>

      {/* Settings Menu Cards */}
      <div className="space-y-3">
        
        {/* 1. Customer Profile Button & Form */}
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs transition-all">
          <button
            type="button"
            onClick={() => setActiveSection(activeSection === 'profile' ? null : 'profile')}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-[#0284C7] shrink-0">
                <User size={19} />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">My Profile Settings</h3>
                <p className="text-[11px] text-slate-500 font-semibold">Update full name & mobile number</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {savedUser && (
                <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle size={14} /> Saved
                </span>
              )}
              {activeSection === 'profile' ? (
                <ChevronDown size={18} className="text-slate-400" />
              ) : (
                <ChevronRight size={18} className="text-slate-400" />
              )}
            </div>
          </button>

          {/* Form Content */}
          {activeSection === 'profile' && (
            <form onSubmit={handleSaveUser} className="p-4 pt-2 border-t border-slate-100 bg-slate-50/50 space-y-3.5">
              <div>
                <label className="block text-[11px] font-extrabold uppercase mb-1 text-slate-600">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#0284C7]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase mb-1 text-slate-600">Phone Number</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#0284C7]"
                  />
                </div>
              </div>

              <GlassButton
                variant="primary"
                size="md"
                className="w-full font-black py-3 shadow-md shadow-cyan-500/20"
                icon={<Save size={16} />}
                type="submit"
              >
                Save Profile Changes
              </GlassButton>
            </form>
          )}
        </div>

        {/* 2. Vendor & Delivery Rates Button & Form */}
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs transition-all">
          <button
            type="button"
            onClick={() => setActiveSection(activeSection === 'vendor' ? null : 'vendor')}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                <Store size={19} />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">Vendor & Milk Delivery Settings</h3>
                <p className="text-[11px] text-slate-500 font-semibold">Dairy name, price per litre & daily quantity</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {savedVendor && (
                <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle size={14} /> Saved
                </span>
              )}
              {activeSection === 'vendor' ? (
                <ChevronDown size={18} className="text-slate-400" />
              ) : (
                <ChevronRight size={18} className="text-slate-400" />
              )}
            </div>
          </button>

          {/* Form Content */}
          {activeSection === 'vendor' && (
            <form onSubmit={handleSaveVendor} className="p-4 pt-2 border-t border-slate-100 bg-slate-50/50 space-y-3.5">
              <div>
                <label className="block text-[11px] font-extrabold uppercase mb-1 text-slate-600">Vendor / Dairy Name</label>
                <div className="relative">
                  <Store size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={vendorName}
                    onChange={(e) => setVendorName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#0284C7]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase mb-1 text-slate-600">Vendor WhatsApp Number</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={vendorPhone}
                    onChange={(e) => setVendorPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#0284C7]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-extrabold uppercase mb-1 text-slate-600">Price / Litre (₹)</label>
                  <div className="relative">
                    <IndianRupee size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0284C7]" />
                    <input
                      type="number"
                      value={pricePerLitre}
                      onChange={(e) => setPricePerLitre(Number(e.target.value))}
                      className="w-full pl-8 pr-3 py-2.5 bg-white border border-slate-300 rounded-2xl text-xs font-extrabold text-slate-900 focus:outline-none focus:border-[#0284C7]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold uppercase mb-1 text-slate-600">Daily Default (L)</label>
                  <div className="relative">
                    <Droplets size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0284C7]" />
                    <input
                      type="number"
                      step="0.5"
                      value={defaultQty}
                      onChange={(e) => setDefaultQty(Number(e.target.value))}
                      className="w-full pl-8 pr-3 py-2.5 bg-white border border-slate-300 rounded-2xl text-xs font-extrabold text-slate-900 focus:outline-none focus:border-[#0284C7]"
                    />
                  </div>
                </div>
              </div>

              <GlassButton
                variant="primary"
                size="md"
                className="w-full font-black py-3 shadow-md shadow-cyan-500/20"
                icon={<Save size={16} />}
                type="submit"
              >
                Save Vendor & Rate Settings
              </GlassButton>
            </form>
          )}
        </div>

        {/* 3. Legal Documents & Play Store Compliance */}
        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-xs space-y-2">
          <h3 className="text-xs font-black uppercase text-slate-700 tracking-wider mb-2">Legal & App Information</h3>
          
          <div className="grid grid-cols-3 gap-2 text-xs font-bold">
            <button
              onClick={() => setLegalModalType('terms')}
              className="p-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileText size={14} className="text-[#0284C7]" />
              <span>Terms</span>
            </button>

            <button
              onClick={() => setLegalModalType('privacy')}
              className="p-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>Privacy</span>
            </button>

            <button
              onClick={() => setLegalModalType('about')}
              className="p-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Info size={14} className="text-purple-600" />
              <span>About</span>
            </button>
          </div>
        </div>

        {/* 4. Sign Out Button */}
        <GlassButton
          variant="danger"
          size="lg"
          className="w-full font-black mt-4 py-3.5 shadow-md shadow-rose-500/20"
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
