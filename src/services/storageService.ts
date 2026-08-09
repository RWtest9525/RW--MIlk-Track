import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, DailyLog, MonthlyInvoice } from '../types';

const STORAGE_KEYS = {
  USER_PROFILE: '@milktrack_user_profile',
  DAILY_LOGS: '@milktrack_daily_logs_', // suffix with monthKey (YYYY-MM)
  INVOICES: '@milktrack_invoices_',      // suffix with monthKey (YYYY-MM)
  CURRENT_MONTH: '@milktrack_current_month',
};

// Helper for cross-platform local storage
const getItem = async (key: string): Promise<string | null> => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(key);
    }
    return await AsyncStorage.getItem(key);
  } catch {
    return null;
  }
};

const setItem = async (key: string, value: string): Promise<void> => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, value);
    } else {
      await AsyncStorage.setItem(key, value);
    }
  } catch (err) {
    console.error('Error saving to storage', err);
  }
};

export const saveUserProfile = async (profile: UserProfile): Promise<void> => {
  await setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
};

export const getUserProfile = async (): Promise<UserProfile | null> => {
  const json = await getItem(STORAGE_KEYS.USER_PROFILE);
  if (!json) return null;
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
};

export const saveMonthLogs = async (monthKey: string, logs: Record<string, DailyLog>): Promise<void> => {
  await setItem(`${STORAGE_KEYS.DAILY_LOGS}${monthKey}`, JSON.stringify(logs));
};

export const getMonthLogs = async (monthKey: string): Promise<Record<string, DailyLog>> => {
  const json = await getItem(`${STORAGE_KEYS.DAILY_LOGS}${monthKey}`);
  if (!json) return {};
  try {
    return JSON.parse(json);
  } catch {
    return {};
  }
};

export const saveMonthlyInvoice = async (monthKey: string, invoice: MonthlyInvoice): Promise<void> => {
  await setItem(`${STORAGE_KEYS.INVOICES}${monthKey}`, JSON.stringify(invoice));
};

export const getMonthlyInvoice = async (monthKey: string): Promise<MonthlyInvoice | null> => {
  const json = await getItem(`${STORAGE_KEYS.INVOICES}${monthKey}`);
  if (!json) return null;
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
};
