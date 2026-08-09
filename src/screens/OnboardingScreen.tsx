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
  const [vendorPhone, setVendorPhone] = useState(user?.vendor?.phone || '');
  const [countryCode, setCountryCode] = useState(user?.vendor?.countryCode || '+91');
  const [pricePerLitre, setPricePerLitre] = useState(user?.vendor?.defaultPricePerLitre || 60);
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
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-[#F8FAFC] text-slate-900 relative">
      <div className="w-full max-w-md space-y-5 relative z-10 animate-fade-in my-auto">
        
        {/* Compact Logo Header */}
        <div className="text-center space-y-2">
          <div className="w-20 h-20 rounded-full mx-auto shadow-lg border-2 border-[#0284C7] overflow-hidden p-0 bg-white">
            <img
              src="/logo.png"
              alt="RW-Milk Tracker Logo"
              loading="eager"
              className="w-full h-full object-cover rounded-full"
            />
          </div>

          <div>
            <h2 className="text-xl font-black tracking-tight text-slate-900">
              {step === 1 ? 'Customer Setup' : 'Vendor & Rates'}
            </h2>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              Step {step} of 2 • Setup your daily milk preferences
            </p>
          </div>

          {/* Progress Bar */}
          <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden flex">
            <div
              className={`h-full bg-gradient-to-r from-[#0284C7] to-[#06B6D4] transition-all duration-300 ${
                step === 1 ? 'w-1/2' : 'w-full'
              }`}
            />
          </div>
        </div>

        {/* Compact Setup Card */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xl shadow-slate-200/60 space-y-4">
          {step === 1 ? (
            /* STEP 1: Customer Details */
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-[11px] font-extrabold text-slate-600 uppercase mb-1">
                  Your Full Name
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Yash Vishal"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0284C7]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-slate-600 uppercase mb-1">
                  Mobile Phone Number
                </label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    placeholder="9973489973"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0284C7]"
                  />
                </div>
              </div>

              <GlassButton
                variant="primary"
                size="lg"
                className="w-full mt-2 font-black py-3 shadow-lg shadow-cyan-500/25"
                icon={<ArrowRight size={17} />}
                disabled={!fullName.trim() || !userPhone.trim()}
                onClick={handleNext}
              >
                Continue to Vendor Setup
              </GlassButton>
            </div>
          ) : (
            /* STEP 2: Vendor Details & Default Rates */
            <form onSubmit={handleComplete} className="space-y-3.5 animate-fade-in">
              <div>
                <label className="block text-[11px] font-extrabold text-slate-600 uppercase mb-1">
                  Vendor / Dairy Name
                </label>
                <div className="relative">
                  <Store size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="e.g. Amul Milk Express"
                    value={vendorName}
                    onChange={(e) => setVendorName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0284C7]"
                  />
                </div>
              </div>

              {/* Vendor Phone & Code */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-600 uppercase mb-1">Code</label>
                  <input
                    type="text"
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-full px-2 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-bold text-slate-900 text-center focus:outline-none focus:border-[#0284C7]"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-[11px] font-extrabold text-slate-600 uppercase mb-1">
                    Vendor WhatsApp
                  </label>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    value={vendorPhone}
                    onChange={(e) => setVendorPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0284C7]"
                  />
                </div>
              </div>

              {/* Price & Daily Qty */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-600 uppercase mb-1">
                    Price / Litre (₹)
                  </label>
                  <div className="relative">
                    <IndianRupee size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-600 font-bold" />
                    <input
                      type="number"
                      value={pricePerLitre}
                      onChange={(e) => setPricePerLitre(Number(e.target.value))}
                      className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-extrabold text-slate-900 focus:outline-none focus:border-[#0284C7]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-slate-600 uppercase mb-1">
                    Daily Default (L)
                  </label>
                  <div className="relative">
                    <Droplets size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-600 font-bold" />
                    <input
                      type="number"
                      step="0.5"
                      value={dailyQty}
                      onChange={(e) => setDailyQty(Number(e.target.value))}
                      className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-extrabold text-slate-900 focus:outline-none focus:border-[#0284C7]"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <GlassButton
                  variant="outline"
                  size="md"
                  type="button"
                  icon={<ArrowLeft size={16} />}
                  onClick={() => setStep(1)}
                >
                  Back
                </GlassButton>

                <GlassButton
                  variant="primary"
                  size="md"
                  className="flex-1 font-black py-3 shadow-lg shadow-cyan-500/25"
                  icon={<CheckCircle2 size={17} />}
                  loading={loading}
                  type="submit"
                >
                  Save & Open App
                </GlassButton>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
