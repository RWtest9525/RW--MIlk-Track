import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { DailyLog, MonthlyInvoice, PaymentRecord, DeliveryStatus } from '../types';
import { useAuth } from './AuthContext';

interface MilkContextType {
  selectedMonth: string; // YYYY-MM
  setSelectedMonth: (monthKey: string) => void;
  logs: Record<string, DailyLog>;
  invoice: MonthlyInvoice;
  updateDateLog: (date: string, status: DeliveryStatus, quantity: number, notes?: string) => Promise<void>;
  markMonthAsPaid: (amountPaid: number, note?: string, paymentMethod?: PaymentRecord['paymentMethod']) => Promise<void>;
  refreshMonthData: () => Promise<void>;
  clearMonthLogs: () => Promise<void>;
}

const getDaysInMonth = (year: number, monthIndex: number): number => {
  return new Date(year, monthIndex + 1, 0).getDate();
};

const MilkContext = createContext<MilkContextType | undefined>(undefined);

export const MilkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthKey);
  const [logs, setLogs] = useState<Record<string, DailyLog>>({});
  const [previousPendingBalance, setPreviousPendingBalance] = useState<number>(0);
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [paymentHistory, setPaymentHistory] = useState<PaymentRecord[]>([]);

  const pricePerLitre = user?.vendor?.defaultPricePerLitre ?? 60;

  // Parse year & month
  const [year, monthNum] = useMemo(() => {
    const parts = selectedMonth.split('-').map(Number);
    return [parts[0] || now.getFullYear(), parts[1] || (now.getMonth() + 1)];
  }, [selectedMonth]);

  const daysInMonth = useMemo(() => getDaysInMonth(year, monthNum - 1), [year, monthNum]);

  // Real-time Cloud Firestore synchronization for monthly logs & invoice
  useEffect(() => {
    if (!user?.uid) {
      setLogs({});
      return;
    }

    const monthDocRef = doc(db, 'users', user.uid, 'months', selectedMonth);

    // Subscribe to Firestore changes
    const unsubscribe = onSnapshot(
      monthDocRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          const storedLogs: Record<string, DailyLog> = data.logs || {};
          setLogs(storedLogs);
          setAmountPaid(data.amountPaid || 0);
          setPaymentHistory(data.paymentHistory || []);
          setPreviousPendingBalance(data.previousPendingBalance || 0);
        } else {
          setLogs({});
          setAmountPaid(0);
          setPaymentHistory([]);
          setPreviousPendingBalance(0);
        }
      },
      (err) => {
        console.error('Firestore snapshot listener error:', err);
      }
    );

    return () => unsubscribe();
  }, [user?.uid, selectedMonth]);

  // Calculate monthly stats based strictly on user's manual logs
  const invoice = useMemo((): MonthlyInvoice => {
    let deliveredDays = 0;
    let missedDays = 0;
    let totalLitres = 0;

    Object.values(logs).forEach((log) => {
      if (log.status === 'delivered' || log.status === 'custom') {
        deliveredDays++;
        totalLitres += log.quantity;
      } else if (log.status === 'missed') {
        missedDays++;
      }
    });

    const currentMonthCost = totalLitres * pricePerLitre;
    const totalAmountDue = currentMonthCost + previousPendingBalance;
    const pendingBalance = Math.max(0, totalAmountDue - amountPaid);

    let status: 'unpaid' | 'partial' | 'paid' = 'unpaid';
    if (amountPaid >= totalAmountDue && totalAmountDue > 0) {
      status = 'paid';
    } else if (amountPaid > 0) {
      status = 'partial';
    }

    return {
      monthKey: selectedMonth,
      totalDays: daysInMonth,
      deliveredDays,
      missedDays,
      totalLitres,
      pricePerLitre,
      currentMonthCost,
      previousPendingBalance,
      totalAmountDue,
      amountPaid,
      pendingBalance,
      status,
      paymentHistory,
    };
  }, [logs, selectedMonth, daysInMonth, pricePerLitre, previousPendingBalance, amountPaid, paymentHistory]);

  const updateDateLog = async (
    date: string,
    status: DeliveryStatus,
    quantity: number,
    notes?: string
  ) => {
    if (!user?.uid) return;

    const targetMonthKey = date.substring(0, 7);

    // Build log item without undefined fields (Firestore throws error on undefined)
    const newLogItem: DailyLog = {
      date,
      status,
      quantity: status === 'missed' ? 0 : quantity,
      updatedAt: new Date().toISOString(),
    };

    if (notes && notes.trim().length > 0) {
      newLogItem.notes = notes.trim();
    }

    const updatedLogs = {
      ...logs,
      [date]: newLogItem,
    };

    // Optimistically update local state immediately
    setLogs(updatedLogs);

    try {
      const monthDocRef = doc(db, 'users', user.uid, 'months', targetMonthKey);
      await setDoc(monthDocRef, { logs: updatedLogs }, { merge: true });
    } catch (error) {
      console.error('Error saving log to Firestore:', error);
    }
  };

  const clearMonthLogs = async () => {
    if (!user?.uid) return;
    setLogs({});
    try {
      const monthDocRef = doc(db, 'users', user.uid, 'months', selectedMonth);
      await setDoc(monthDocRef, { logs: {} }, { merge: true });
    } catch (e) {
      console.error('Clear logs error:', e);
    }
  };

  const markMonthAsPaid = async (
    paidAmount: number,
    note?: string,
    paymentMethod: PaymentRecord['paymentMethod'] = 'cash'
  ) => {
    if (!user?.uid) return;

    const newRecord: PaymentRecord = {
      id: `pay_${Date.now()}`,
      date: new Date().toISOString(),
      amount: paidAmount,
      paymentMethod,
    };

    if (note && note.trim().length > 0) {
      newRecord.note = note.trim();
    }

    const newPaymentHistory = [newRecord, ...paymentHistory];
    const newTotalPaid = amountPaid + paidAmount;

    setAmountPaid(newTotalPaid);
    setPaymentHistory(newPaymentHistory);

    try {
      const monthDocRef = doc(db, 'users', user.uid, 'months', selectedMonth);
      await setDoc(
        monthDocRef,
        {
          amountPaid: newTotalPaid,
          paymentHistory: newPaymentHistory,
        },
        { merge: true }
      );
    } catch (error) {
      console.error('Error saving payment record to Firestore:', error);
    }
  };

  const refreshMonthData = async () => {
    if (!user?.uid) return;
    try {
      const monthDocRef = doc(db, 'users', user.uid, 'months', selectedMonth);
      const snap = await getDoc(monthDocRef);
      if (snap.exists()) {
        setLogs(snap.data().logs || {});
      }
    } catch (e) {
      console.error('Refresh month data error:', e);
    }
  };

  return (
    <MilkContext.Provider
      value={{
        selectedMonth,
        setSelectedMonth,
        logs,
        invoice,
        updateDateLog,
        markMonthAsPaid,
        refreshMonthData,
        clearMonthLogs,
      }}
    >
      {children}
    </MilkContext.Provider>
  );
};

export const useMilk = () => {
  const context = useContext(MilkContext);
  if (!context) {
    throw new Error('useMilk must be used within a MilkProvider');
  }
  return context;
};
