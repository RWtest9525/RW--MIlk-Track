const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export interface MonthOption {
  key: string; // YYYY-MM
  label: string; // e.g. JANUARY 2026
  monthName: string; // e.g. January
  yearName: string; // e.g. 2026
}

export const getUserAvailableMonths = (createdAt?: string): MonthOption[] => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonthIdx = now.getMonth();

  let startYear = currentYear;
  let startMonthIdx = currentMonthIdx;

  if (createdAt) {
    const createdDate = new Date(createdAt);
    if (!isNaN(createdDate.getTime())) {
      startYear = createdDate.getFullYear();
      startMonthIdx = createdDate.getMonth();
    }
  }

  const options: MonthOption[] = [];

  let y = currentYear;
  let m = currentMonthIdx;

  while (y > startYear || (y === startYear && m >= startMonthIdx)) {
    const monthKey = `${y}-${String(m + 1).padStart(2, '0')}`;
    const label = `${MONTH_NAMES[m].toUpperCase()} ${y}`;
    options.push({
      key: monthKey,
      label,
      monthName: MONTH_NAMES[m],
      yearName: String(y),
    });

    m--;
    if (m < 0) {
      m = 11;
      y--;
    }
  }

  // Safety fallback if empty
  if (options.length === 0) {
    const monthKey = `${currentYear}-${String(currentMonthIdx + 1).padStart(2, '0')}`;
    options.push({
      key: monthKey,
      label: `${MONTH_NAMES[currentMonthIdx].toUpperCase()} ${currentYear}`,
      monthName: MONTH_NAMES[currentMonthIdx],
      yearName: String(currentYear),
    });
  }

  return options;
};

export const formatDateDDMMYYYY = (isoString?: string): string => {
  if (!isoString) {
    const now = new Date();
    return `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
  }
  const d = new Date(isoString);
  if (isNaN(d.getTime())) {
    return isoString;
  }
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};
