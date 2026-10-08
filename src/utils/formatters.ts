/**
 * Formats a number as Sri Lankan Rupees (LKR)
 */
export function formatLKR(amount: number, options?: { showCents?: boolean; prefix?: string }): string {
  const { showCents = false, prefix = 'LKR ' } = options || {};
  const formatted = new Intl.NumberFormat('en-LK', {
    minimumFractionDigits: showCents ? 2 : 0,
    maximumFractionDigits: showCents ? 2 : 0,
  }).format(amount || 0);

  return `${prefix}${formatted}`;
}

/**
 * Formats data size in GB
 */
export function formatGB(gb: number): string {
  if (gb >= 1000) {
    return `${(gb / 1000).toFixed(2)} TB (${gb.toLocaleString()} GB)`;
  }
  return `${gb.toLocaleString()} GB`;
}

/**
 * Formats month YYYY-MM into readable string e.g. "October 2026"
 */
export function formatMonthName(monthStr: string): string {
  if (!monthStr || !monthStr.includes('-')) return monthStr;
  const [year, month] = monthStr.split('-');
  const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

/**
 * Gets current month string YYYY-MM
 */
export function getCurrentMonthStr(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * Gets formatted date for display
 */
export function formatDateDisplay(dateStr?: string): string {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}
