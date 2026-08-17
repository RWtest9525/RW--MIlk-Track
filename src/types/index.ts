export type DeliveryStatus = 'delivered' | 'missed' | 'custom';

export interface DailyLog {
  date: string; // YYYY-MM-DD
  status: DeliveryStatus;
  quantity: number; // In litres
  notes?: string;
  updatedAt: string;
}

export interface VendorProfile {
  name: string;
  phone: string;
  countryCode: string;
  defaultPricePerLitre: number; // e.g. 60 (INR)
  defaultDailyQuantity: number; // e.g. 1.5 (L)
  preferredSlot: 'morning' | 'evening' | 'both';
  address?: string;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  photoURL?: string;
  vendor: VendorProfile;
  isOnboarded: boolean;
  isDeleted?: boolean;
  createdAt: string;
}

export interface MonthlyInvoice {
  monthKey: string; // YYYY-MM
  totalDays: number;
  deliveredDays: number;
  missedDays: number;
  totalLitres: number;
  pricePerLitre: number;
  currentMonthCost: number;
  previousPendingBalance: number;
  totalAmountDue: number;
  amountPaid: number;
  pendingBalance: number;
  status: 'unpaid' | 'partial' | 'paid';
  lastPaymentDate?: string;
  paymentHistory: PaymentRecord[];
}

export interface PaymentRecord {
  id: string;
  amount: number;
  date: string;
  note?: string;
  paymentMethod: 'upi' | 'cash' | 'netbanking' | 'other';
}

export type ActiveTab = 'dashboard' | 'calendar' | 'invoice' | 'profile';
