import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { VendorProfile } from '../types';
import { GlassButton } from '../components/common/GlassButton';
import { User, Phone, Store, IndianRupee, Droplets, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const OnboardingScreen: React.FC = () => {
  const { user, completeOnboarding } = useAuth();

  const [step, setStep] = useState<1 | 2>(1);

  // Form states
  const [fullName, setFullName] = useState(user?.name || '');
  const [userPhone, setUserPhone] = useState(user?.phone || '');

  const [vendorName, setVendorName] = useState(user?.vendor?.name || 'Amul Dairy Service');
  const [vendorPhone, setVendorPhone] = useState(user?.vendor?.phone || '9876543210');
  const [countryCode, setCountryCode] = useState(user?.vendor?.countryCode || '+91');
  const [pricePerLitre, setPricePerLitre] = useState(user?.vendor?.defaultPricePerLitre || 64);
  const [dailyQty, setDailyQty] = useState(user?.vendor?.defaultDailyQuantity || 1.5);
  const [slot, setSlot] = useState<'morning' | 'evening' | 'both'>('morning');
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    if (!fullName.trim() || !userPhone.trim()) return;
    setStep(2);
  };

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const vendorProfile: VendorProfile = {
      name: vendorName,
      phone: vendorPhone,
      countryCode,
      defaultPricePerLitre: Number(pricePerLitre),
      defaultDailyQuantity: Number(dailyQty),
      preferredSlot: slot,
    };

    await completeOnboarding(fullName, userPhone, vendorProfile);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] flex flex-col justify-between p-6 relative overflow-hidden">
      {/* Glow ambient background */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Step Indicator */}
      <div className="pt-4 z-10 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
            Setup Step {step} of 2
          </span>
          <span className="text-xs font-semibold text-slate-400">
            {step === 1 ? 'Customer Info' : 'Vendor & Milk Rates'}
          </span>
        </div>

        {/* Step Progress Bar */}
        <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden flex">
          <div
            className={`h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-500 ${
              step === 1 ? 'w-1/2' : 'w-full'
            }`}
          />
        </div>
      </div>

      {/* Main Card Container */}
      <div className="bg-[#131C2E]/90 border border-white/10 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl space-y-5 z-10 my-auto">
        {step === 1 ? (
          /* STEP 1: Customer Details */
          <div className="space-y-4 animate-fade-in">
            <div>
              <h2 className="text-xl font-extrabold text-slate-100">User Profile Details</h2>
              <p className="text-xs text-slate-400 mt-1">
                Enter your details to generate personalized monthly milk invoices.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="e.g. Yash Vishal"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                Mobile Phone Number
              </label>
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="tel"
                  placeholder="e.g. 9973489973"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <GlassButton
              variant="primary"
              size="lg"
              className="w-full mt-2"
              icon={<ArrowRight size={18} />}
              disabled={!fullName.trim() || !userPhone.trim()}
              onClick={handleNext}
            >
              Continue to Vendor Setup
            </GlassButton>
          </div>
        ) : (
          /* STEP 2: Vendor Details & Default Milk Rates */
          <form onSubmit={handleComplete} className="space-y-4 animate-fade-in">
            <div>
              <h2 className="text-xl font-extrabold text-slate-100">Vendor & Milk Configuration</h2>
              <p className="text-xs text-slate-400 mt-1">
                Configure default daily milk delivery quantity and price per litre.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                Vendor / Dairy Name
              </label>
              <div className="relative">
                <Store size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="e.g. Amul Milk Express (Rajesh)"
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Vendor Phone & Country Code */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Code</label>
                <input
                  type="text"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-full px-3 py-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-xs text-slate-100 text-center font-bold focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                  Vendor WhatsApp Phone
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={vendorPhone}
                  onChange={(e) => setVendorPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Milk Price & Default Quantity */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                  Price / Litre (₹)
                </label>
                <div className="relative">
                  <IndianRupee size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400" />
                  <input
                    type="number"
                    value={pricePerLitre}
                    onChange={(e) => setPricePerLitre(Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-xs font-bold text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                  Daily Default (L)
                </label>
                <div className="relative">
                  <Droplets size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400" />
                  <input
                    type="number"
                    step="0.5"
                    value={dailyQty}
                    onChange={(e) => setDailyQty(Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-xs font-bold text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <GlassButton
                variant="outline"
                size="lg"
                type="button"
                icon={<ArrowLeft size={16} />}
                onClick={() => setStep(1)}
              >
                Back
              </GlassButton>

              <GlassButton
                variant="primary"
                size="lg"
                className="flex-1"
                icon={<CheckCircle2 size={18} />}
                loading={loading}
                type="submit"
              >
                Launch Dashboard
              </GlassButton>
            </div>
          </form>
        )}
      </div>

      <div className="text-center z-10 pt-2">
        <p className="text-[11px] text-slate-500">You can edit vendor details anytime from settings</p>
      </div>
    </div>
  );
};
