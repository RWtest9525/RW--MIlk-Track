import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { DailyLog, MonthlyInvoice, PaymentRecord, DeliveryStatus } from '../types';
import { useAuth } from './AuthContext';
import { getMonthLogs, saveMonthLogs, getMonthlyInvoice, saveMonthlyInvoice } from '../services/storageService';

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
  
  // Default to current month: e.g. "2026-08"
  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthKey);
  const [logs, setLogs] = useState<Record<string, DailyLog>>({});
  const [previousPendingBalance, setPreviousPendingBalance] = useState<number>(150); // Sample carryover balance
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [paymentHistory, setPaymentHistory] = useState<PaymentRecord[]>([]);

  const defaultQty = user?.vendor.defaultDailyQuantity ?? 1.5;
  const pricePerLitre = user?.vendor.defaultPricePerLitre ?? 64;

  // Parse year & month
  const [year, monthNum] = useMemo(() => {
    const parts = selectedMonth.split('-').map(Number);
    return [parts[0] || now.getFullYear(), parts[1] || (now.getMonth() + 1)];
  }, [selectedMonth]);

  const daysInMonth = useMemo(() => getDaysInMonth(year, monthNum - 1), [year, monthNum]);

  // Load / Initialize month logs
  useEffect(() => {
    const loadLogs = async () => {
      const storedLogs = await getMonthLogs(selectedMonth);
      const storedInvoice = await getMonthlyInvoice(selectedMonth);

      const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

      // Auto-populate past and current days if log doesn't exist
      const initialLogs: Record<string, DailyLog> = { ...storedLogs };

      for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(monthNum).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        if (!initialLogs[dateStr]) {
          // If past or present day
          if (dateStr <= todayStr) {
            // Default sample overrides for demo realism (e.g. day 5 missed, day 12 extra)
            if (day === 5) {
              initialLogs[dateStr] = {
                date: dateStr,
                status: 'missed',
                quantity: 0,
                notes: 'Out of town',
                updatedAt: new Date().toISOString(),
              };
            } else if (day === 12) {
              initialLogs[dateStr] = {
                date: dateStr,
                status: 'custom',
                quantity: defaultQty + 1.0,
                notes: 'Guests at home (+1L extra)',
                updatedAt: new Date().toISOString(),
              };
            } else {
              initialLogs[dateStr] = {
                date: dateStr,
                status: 'delivered',
                quantity: defaultQty,
                updatedAt: new Date().toISOString(),
              };
            }
          }
        }
      }

      setLogs(initialLogs);
      await saveMonthLogs(selectedMonth, initialLogs);

      if (storedInvoice) {
        setAmountPaid(storedInvoice.amountPaid || 0);
        setPaymentHistory(storedInvoice.paymentHistory || []);
        setPreviousPendingBalance(storedInvoice.previousPendingBalance || 0);
      }
    };

    loadLogs();
  }, [selectedMonth, daysInMonth, defaultQty]);

  // Calculate monthly stats
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
    await saveMonthLogs(selectedMonth, updatedLogs);
  };

  const markMonthAsPaid = async (
    paymentAmount: number,
    note?: string,
    paymentMethod: PaymentRecord['paymentMethod'] = 'upi'
  ) => {
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

    const updatedInvoice: MonthlyInvoice = {
      ...invoice,
      amountPaid: newAmountPaid,
      pendingBalance: Math.max(0, invoice.totalAmountDue - newAmountPaid),
      status: newAmountPaid >= invoice.totalAmountDue ? 'paid' : 'partial',
      paymentHistory: newHistory,
      lastPaymentDate: new Date().toISOString(),
    };

    await saveMonthlyInvoice(selectedMonth, updatedInvoice);
  };

  const refreshMonthData = async () => {
    const storedLogs = await getMonthLogs(selectedMonth);
    setLogs(storedLogs);
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
