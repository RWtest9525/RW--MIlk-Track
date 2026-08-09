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

  const defaultQty = user?.vendor?.defaultDailyQuantity ?? 1.5;
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
    const unsubscribe = onSnapshot(monthDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        const storedLogs: Record<string, DailyLog> = data.logs || {};
        
        // Auto-fill past/present default logs without adding fake overrides
        const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        const mergedLogs: Record<string, DailyLog> = { ...storedLogs };

        for (let day = 1; day <= daysInMonth; day++) {
          const dateStr = `${year}-${String(monthNum).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          if (!mergedLogs[dateStr] && dateStr <= todayStr) {
            mergedLogs[dateStr] = {
              date: dateStr,
              status: 'delivered',
              quantity: defaultQty,
              updatedAt: new Date().toISOString(),
            };
          }
        }

        setLogs(mergedLogs);
        setAmountPaid(data.amountPaid || 0);
        setPaymentHistory(data.paymentHistory || []);
        setPreviousPendingBalance(data.previousPendingBalance || 0);
      } else {
        // Initialize clean default month in Firestore
        const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        const cleanLogs: Record<string, DailyLog> = {};

        for (let day = 1; day <= daysInMonth; day++) {
          const dateStr = `${year}-${String(monthNum).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          if (dateStr <= todayStr) {
            cleanLogs[dateStr] = {
              date: dateStr,
              status: 'delivered',
              quantity: defaultQty,
              updatedAt: new Date().toISOString(),
            };
          }
        }

        setLogs(cleanLogs);
        setAmountPaid(0);
        setPaymentHistory([]);
        setPreviousPendingBalance(0);

        setDoc(monthDocRef, {
          logs: cleanLogs,
          amountPaid: 0,
          paymentHistory: [],
          previousPendingBalance: 0,
          updatedAt: new Date().toISOString(),
        });
      }
    });

    return () => unsubscribe();
  }, [user?.uid, selectedMonth, daysInMonth, defaultQty, year, monthNum]);

  // Calculate monthly stats based on real logs
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

    const updatedLogs = {
      ...logs,
      [date]: {
        date,
        status,
        quantity: status === 'missed' ? 0 : quantity,
        notes,
        updatedAt: new Date().toISOString(),
      },
    };
    setLogs(updatedLogs);

    const monthDocRef = doc(db, 'users', user.uid, 'months', selectedMonth);
    await setDoc(monthDocRef, { logs: updatedLogs }, { merge: true });
  };

  const markMonthAsPaid = async (
    paymentAmount: number,
    note?: string,
    paymentMethod: PaymentRecord['paymentMethod'] = 'upi'
  ) => {
    if (!user?.uid) return;

    const newRecord: PaymentRecord = {
      id: 'pay_' + Date.now(),
      amount: paymentAmount,
      date: new Date().toISOString(),
      note: note || 'Monthly milk settlement',
      paymentMethod,
    };

    const newAmountPaid = amountPaid + paymentAmount;
    const newHistory = [newRecord, ...paymentHistory];

    setAmountPaid(newAmountPaid);
    setPaymentHistory(newHistory);

    const monthDocRef = doc(db, 'users', user.uid, 'months', selectedMonth);
    await setDoc(
      monthDocRef,
      {
        amountPaid: newAmountPaid,
        paymentHistory: newHistory,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  };

  const refreshMonthData = async () => {
    if (!user?.uid) return;
    const monthDocRef = doc(db, 'users', user.uid, 'months', selectedMonth);
    const snap = await getDoc(monthDocRef);
    if (snap.exists()) {
      setLogs(snap.data().logs || {});
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
