import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { GlassButton } from '../components/common/GlassButton';
import { User, Store, Phone, IndianRupee, Droplets, LogOut, CheckCircle, Save, Shield } from 'lucide-react';

export const ProfileScreen: React.FC = () => {
  const { user, updateUserProfile, updateVendorProfile, logout } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');

  const [vendorName, setVendorName] = useState(user?.vendor.name || '');
  const [vendorPhone, setVendorPhone] = useState(user?.vendor.phone || '');
  const [pricePerLitre, setPricePerLitre] = useState(user?.vendor.defaultPricePerLitre || 64);
  const [defaultQty, setDefaultQty] = useState(user?.vendor.defaultDailyQuantity || 1.5);

  const [savedUser, setSavedUser] = useState(false);
  const [savedVendor, setSavedVendor] = useState(false);

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
    });
    setSavedVendor(true);
    setTimeout(() => setSavedVendor(false), 2000);
  };

  return (
    <div className="p-5 space-y-6 pb-28 animate-fade-in">
      {/* Top Title */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-100">Settings & Vendor Profile</h2>
        <p className="text-xs text-slate-400 mt-0.5">Manage customer profile, milk rates & preferences</p>
      </div>

      {/* User Details Section */}
      <form onSubmit={handleSaveUser} className="bg-[#131C2E]/80 border border-white/10 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <User size={16} className="text-cyan-400" />
            Customer Profile
          </h3>
          {savedUser && <span className="text-xs text-emerald-400 font-bold flex items-center gap-1"><CheckCircle size={13} /> Saved!</span>}
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-2xl text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-2xl text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <GlassButton variant="secondary" size="sm" className="w-full" icon={<Save size={14} />} type="submit">
          Save User Profile
        </GlassButton>
      </form>

      {/* Vendor Configuration Section */}
      <form onSubmit={handleSaveVendor} className="bg-[#131C2E]/80 border border-white/10 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Store size={16} className="text-emerald-400" />
            Vendor & Delivery Rates
          </h3>
          {savedVendor && <span className="text-xs text-emerald-400 font-bold flex items-center gap-1"><CheckCircle size={13} /> Saved!</span>}
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Vendor / Dairy Name</label>
            <input
              type="text"
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-2xl text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Vendor WhatsApp Phone</label>
            <input
              type="text"
              value={vendorPhone}
              onChange={(e) => setVendorPhone(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-2xl text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Base Price / Litre (₹)</label>
              <input
                type="number"
                value={pricePerLitre}
                onChange={(e) => setPricePerLitre(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-2xl text-slate-100 font-bold focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Default Daily Qty (L)</label>
              <input
                type="number"
                step="0.5"
                value={defaultQty}
                onChange={(e) => setDefaultQty(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-2xl text-slate-100 font-bold focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        <GlassButton variant="primary" size="sm" className="w-full" icon={<Save size={14} />} type="submit">
          Update Rates & Vendor Settings
        </GlassButton>
      </form>

      {/* Cloud & Security Info */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-xs space-y-2 text-slate-400">
        <div className="flex items-center gap-2 text-slate-200 font-bold">
          <Shield size={16} className="text-emerald-400" /> Firebase Cloud & Local Sync Active
        </div>
        <p className="text-[11px] leading-relaxed">
          Cloud Firestore offline persistence is enabled. All date logs, overrides, and payment records are cached locally and synchronized with the cloud automatically.
        </p>
      </div>

      {/* Logout */}
      <GlassButton
        variant="danger"
        size="md"
        className="w-full"
        icon={<LogOut size={16} />}
        onClick={logout}
      >
        Sign Out / Change Account
      </GlassButton>
    </div>
  );
};
