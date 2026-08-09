import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  deleteUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { UserProfile, VendorProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateVendorProfile: (vendor: VendorProfile) => Promise<void>;
  updateUserProfile: (name: string, phone: string, photoURL?: string) => Promise<void>;
  completeOnboarding: (name: string, phone: string, vendor: VendorProfile) => Promise<void>;
  deleteAccountData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Listen to Firebase Auth Changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data() as UserProfile;
          if (data.isDeleted) {
            // User was soft-deleted earlier -> Purge account
            if (auth.currentUser) {
              try {
                await deleteUser(auth.currentUser);
              } catch (e) {
                await firebaseSignOut(auth);
              }
            }
            setUser(null);
          } else {
            setUser(data);
          }
        } else {
          // New User setup
          const newProfile: UserProfile = {
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || 'Customer',
            email: firebaseUser.email || '',
            phone: firebaseUser.phoneNumber || '',
            photoURL: firebaseUser.photoURL || '',
            vendor: {
              name: 'Amul Milk Express',
              phone: '',
              countryCode: '+91',
              defaultPricePerLitre: 60,
              defaultDailyQuantity: 1.5,
              preferredSlot: 'morning',
            },
            isOnboarded: false,
            createdAt: new Date().toISOString(),
          };
          await setDoc(userDocRef, newProfile);
          setUser(newProfile);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    const newProfile: UserProfile = {
      uid: res.user.uid,
      name,
      email,
      phone: '',
      photoURL: '',
      vendor: {
        name: 'Amul Milk Express',
        phone: '',
        countryCode: '+91',
        defaultPricePerLitre: 60,
        defaultDailyQuantity: 1.5,
        preferredSlot: 'morning',
      },
      isOnboarded: false,
      createdAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'users', res.user.uid), newProfile);
    setUser(newProfile);
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await firebaseSignOut(auth);
    setUser(null);
  };

  const updateVendorProfile = async (vendor: VendorProfile) => {
    if (!user) return;
    const updated = { ...user, vendor };
    setUser(updated);
    await setDoc(doc(db, 'users', user.uid), updated, { merge: true });
  };

  const updateUserProfile = async (name: string, phone: string, photoURL?: string) => {
    if (!user) return;
    const updated = { ...user, name, phone, photoURL: photoURL ?? user.photoURL };
    setUser(updated);
    await setDoc(doc(db, 'users', user.uid), updated, { merge: true });
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
    await setDoc(doc(db, 'users', user.uid), updated, { merge: true });
  };

  const deleteAccountData = async () => {
    if (!user) return;
    const currentUser = auth.currentUser;
    const uid = user.uid;

    setUser(null);

    // 1. Delete Firestore User Document
    try {
      await deleteDoc(doc(db, 'users', uid));
    } catch (e) {
      console.error('Firestore delete doc error:', e);
    }

    // 2. Delete Firebase Auth User Account permanently
    if (currentUser) {
      try {
        await deleteUser(currentUser);
      } catch (e) {
        console.error('Firebase Auth deleteUser error:', e);
        await firebaseSignOut(auth);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginWithEmail,
        signUpWithEmail,
        loginWithGoogle,
        logout,
        updateVendorProfile,
        updateUserProfile,
        completeOnboarding,
        deleteAccountData,
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
