import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager 
} from 'firebase/firestore';

// Get current domain for Same-Origin Firebase Auth Proxy to fix Chrome Storage Partitioning in APK/Mobile
const getDynamicAuthDomain = () => {
  if (typeof window !== 'undefined' && window.location.host) {
    return window.location.host;
  }
  return "rw-milk-track.vercel.app";
};

// Actual Firebase Web App Configuration
export const firebaseConfig = {
  apiKey: "AIzaSyC6L6rrsK4QHTM7FaR5qmnzcCS4nI3ohLY",
  authDomain: getDynamicAuthDomain(),
  projectId: "rw-milk-track",
  storageBucket: "rw-milk-track.firebasestorage.app",
  messagingSenderId: "953538760940",
  appId: "1:953538760940:web:056e23c8a3f86ac8e555c9",
  measurementId: "G-J2V0HCDR1F"
};

// Initialize Firebase App safely
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Auth instance
export const auth = getAuth(app);

// Firestore instance with Offline Persistence enabled
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});

export default app;
