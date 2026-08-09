import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, VendorProfile } from '../types';
import { saveUserProfile, getUserProfile } from '../services/storageService';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  loginWithDemo: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateVendorProfile: (vendor: VendorProfile) => Promise<void>;
  updateUserProfile: (name: string, phone: string) => Promise<void>;
  completeOnboarding: (name: string, phone: string, vendor: VendorProfile) => Promise<void>;
}

const DEFAULT_DEMO_VENDOR: VendorProfile = {
  name: 'Amul Milk Express (Rajesh)',
  phone: '9876543210',
  countryCode: '+91',
  defaultPricePerLitre: 64,
  defaultDailyQuantity: 1.5,
  preferredSlot: 'morning',
  address: 'Sector 62, Dairy Plaza, Noida',
};

const DEFAULT_DEMO_USER: UserProfile = {
  uid: 'demo_user_2026',
  name: 'Yash Vishal',
  email: 'yash@milktrack.app',
  phone: '9973489973',
  photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  vendor: DEFAULT_DEMO_VENDOR,
  isOnboarded: true,
  createdAt: new Date().toISOString(),
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const stored = await getUserProfile();
      if (stored) {
        setUser(stored);
      } else {
        // Auto initialize with Demo User for instant seamless user experience
        setUser(DEFAULT_DEMO_USER);
        await saveUserProfile(DEFAULT_DEMO_USER);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const loginWithDemo = async () => {
    setUser(DEFAULT_DEMO_USER);
    await saveUserProfile(DEFAULT_DEMO_USER);
  };

  const loginWithEmail = async (email: string, _pass: string) => {
    const newUser: UserProfile = {
      uid: 'user_' + Date.now(),
      name: email.split('@')[0] || 'Dairy Customer',
      email,
      phone: '',
      vendor: DEFAULT_DEMO_VENDOR,
      isOnboarded: false,
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    await saveUserProfile(newUser);
  };

  const loginWithGoogle = async () => {
    const googleUser: UserProfile = {
      uid: 'google_' + Date.now(),
      name: 'Google User',
      email: 'user@gmail.com',
      phone: '9876543210',
      vendor: DEFAULT_DEMO_VENDOR,
      isOnboarded: false,
      createdAt: new Date().toISOString(),
    };
    setUser(googleUser);
    await saveUserProfile(googleUser);
  };

  const logout = async () => {
    setUser(null);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('@milktrack_user_profile');
    }
  };

  const updateVendorProfile = async (vendor: VendorProfile) => {
    if (!user) return;
    const updated = { ...user, vendor };
    setUser(updated);
    await saveUserProfile(updated);
  };

  const updateUserProfile = async (name: string, phone: string) => {
    if (!user) return;
    const updated = { ...user, name, phone };
    setUser(updated);
    await saveUserProfile(updated);
  };

  const completeOnboarding = async (name: string, phone: string, vendor: VendorProfile) => {
    if (!user) return;
    const updated: UserProfile = {
      ...user,
      name,
      phone,
      vendor,
      isOnboarded: true,
    };
    setUser(updated);
    await saveUserProfile(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginWithDemo,
        loginWithEmail,
        loginWithGoogle,
        logout,
        updateVendorProfile,
        updateUserProfile,
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
