import { Linking } from 'react-native';
import { UserProfile, DailyLog, MonthlyInvoice } from '../types';

export const formatWhatsAppInvoice = (
  user: UserProfile,
  invoice: MonthlyInvoice,
  logs: Record<string, DailyLog>,
  monthName: string,
  year: number
): string => {
  const vendor = user.vendor;
  
  // Collect non-standard days (missed days or custom extra/reduced quantity)
  const dateWiseOverrides: string[] = [];
  const logEntries = Object.values(logs).sort((a, b) => a.date.localeCompare(b.date));

  logEntries.forEach((log) => {
    const dayNumber = parseInt(log.date.split('-')[2], 10);
    if (log.status === 'missed') {
      dateWiseOverrides.push(`  • ${dayNumber} ${monthName.slice(0, 3)}: ❌ Missed (0L) ${log.notes ? `[${log.notes}]` : ''}`);
    } else if (log.status === 'custom') {
      const diff = log.quantity - vendor.defaultDailyQuantity;
      const sign = diff >= 0 ? `+${diff.toFixed(1)}L` : `${diff.toFixed(1)}L`;
      dateWiseOverrides.push(`  • ${dayNumber} ${monthName.slice(0, 3)}: 🥛 Custom ${log.quantity}L (${sign}) ${log.notes ? `[${log.notes}]` : ''}`);
    }
  });

  const overrideSection = dateWiseOverrides.length > 0 
    ? `\n\n📌 *DATE-WISE OVERRIDES & NOTES:*\n${dateWiseOverrides.join('\n')}`
    : '\n\n✨ *No delivery interruptions this month!*';

  const message = 
`🥛 *DAILY MILK INVOICE - ${monthName.toUpperCase()} ${year}* 🥛
------------------------------------------------
👤 *Customer:* ${user.name || 'Valued Customer'} (${user.phone || 'N/A'})
🏪 *Vendor:* ${vendor.name}
📅 *Billing Period:* ${monthName} 1 - ${invoice.totalDays}, ${year}

📊 *MONTHLY SUMMARY:*
  • Total Days in Month: ${invoice.totalDays}
  • Delivered Days: ✅ ${invoice.deliveredDays} days
  • Missed Days: ❌ ${invoice.missedDays} days
  • Base Milk Rate: ₹${vendor.defaultPricePerLitre} / Litre
  • Default Daily Quantity: ${vendor.defaultDailyQuantity} Litres
  • Total Milk Delivered: 🥛 *${invoice.totalLitres.toFixed(1)} Litres*

💰 *BILL BREAKDOWN:*
  • Current Month Amount: ₹${invoice.currentMonthCost.toLocaleString('en-IN')}
  • Previous Pending Balance: ₹${invoice.previousPendingBalance.toLocaleString('en-IN')}
  💳 *GRAND TOTAL DUE: ₹${invoice.totalAmountDue.toLocaleString('en-IN')}*
  • Payment Status: ${invoice.status === 'paid' ? '✅ PAID' : invoice.status === 'partial' ? `⚠️ PARTIAL (Paid ₹${invoice.amountPaid})` : '⏳ UNPAID'}
${overrideSection}

------------------------------------------------
Generated via *MilkTrack App* 🚀
Thank you for your timely service!`;

  return message;
};

export const openWhatsAppDirectChat = (
  phone: string,
  countryCode: string,
  text: string
): void => {
  // Clean phone number
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const cleanCode = countryCode.replace(/[^0-9+]/g, '').replace('+', '');
  const fullPhone = `${cleanCode}${cleanPhone}`;
  
  const encodedText = encodeURIComponent(text);
  
  // Try WhatsApp app protocol first, fallback to web API link
  const appUrl = `whatsapp://send?phone=${fullPhone}&text=${encodedText}`;
  const webUrl = `https://api.whatsapp.com/send?phone=${fullPhone}&text=${encodedText}`;

  Linking.canOpenURL(appUrl)
    .then((supported) => {
      if (supported) {
        return Linking.openURL(appUrl);
      } else {
        return Linking.openURL(webUrl);
      }
    })
    .catch(() => {
      window.open(webUrl, '_blank');
    });
};
