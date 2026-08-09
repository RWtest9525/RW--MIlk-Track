import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
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
  updateUserProfile: (name: string, phone: string) => Promise<void>;
  completeOnboarding: (name: string, phone: string, vendor: VendorProfile) => Promise<void>;
}

const DEFAULT_VENDOR: VendorProfile = {
  name: 'My Milk Dairy',
  phone: '',
  countryCode: '+91',
  defaultPricePerLitre: 60,
  defaultDailyQuantity: 1.5,
  preferredSlot: 'morning',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        // Fetch User profile from Firestore
        const userRef = doc(db, 'users', fbUser.uid);
        const snapshot = await getDoc(userRef);

        if (snapshot.exists()) {
          setUser(snapshot.data() as UserProfile);
        } else {
          // Create initial user profile document in Firestore
          const initialProfile: UserProfile = {
            uid: fbUser.uid,
            name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
            email: fbUser.email || '',
            phone: fbUser.phoneNumber || '',
            photoURL: fbUser.photoURL || undefined,
            vendor: DEFAULT_VENDOR,
            isOnboarded: false,
            createdAt: new Date().toISOString(),
          };
          await setDoc(userRef, initialProfile);
          setUser(initialProfile);
        }

        // Setup real-time listener for profile updates
        onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            setUser(docSnap.data() as UserProfile);
          }
        });
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
    const userRef = doc(db, 'users', res.user.uid);
    const initialProfile: UserProfile = {
      uid: res.user.uid,
      name: name || email.split('@')[0],
      email: email,
      phone: '',
      vendor: DEFAULT_VENDOR,
      isOnboarded: false,
      createdAt: new Date().toISOString(),
    };
    await setDoc(userRef, initialProfile);
    setUser(initialProfile);
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

  const updateUserProfile = async (name: string, phone: string) => {
    if (!user) return;
    const updated = { ...user, name, phone };
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
