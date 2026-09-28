import { toIsoDate } from '../utils/date.js';

/**
 * Dashboard frequencies.
 *
 * To add a new frequency, add one entry here — the API and the React
 * dashboard tabs pick it up automatically. No other code changes needed.
 *
 *   months : length of the window in calendar months (window ends with the current month)
 *   bucket : granularity of the trend chart — 'day' | 'week' | 'month' | 'quarter' | 'year'
 */
export const PERIODS = {
  monthly:   { label: 'Monthly',  months: 1,  bucket: 'day' },
  quarterly: { label: 'Quarterly', months: 3, bucket: 'week' },
  '6months': { label: '6 Months', months: 6,  bucket: 'month' },
  yearly:    { label: 'Yearly',   months: 12, bucket: 'month' },
  // '2years': { label: '2 Years', months: 24, bucket: 'quarter' },
};

const BUCKETS = new Set(['day', 'week', 'month', 'quarter', 'year']);
for (const [key, p] of Object.entries(PERIODS)) {
  if (!BUCKETS.has(p.bucket)) throw new Error(`Invalid bucket "${p.bucket}" for period "${key}"`);
  if (!Number.isInteger(p.months) || p.months < 1) throw new Error(`Invalid months for period "${key}"`);
}


/**
 * Date range for a period. offset=0 is the current window, offset=1 the one
 * before it, etc. Returns inclusive start and exclusive end (YYYY-MM-DD).
 */
export function getRange(periodKey, offset = 0, today = new Date()) {
  const p = PERIODS[periodKey];
  if (!p) return null;
  const endMonth = today.getMonth() + 1 - offset * p.months; // exclusive
  const end = new Date(today.getFullYear(), endMonth, 1);
  const start = new Date(today.getFullYear(), endMonth - p.months, 1);
  const prevStart = new Date(today.getFullYear(), endMonth - 2 * p.months, 1);
  return { ...p, key: periodKey, start: toIsoDate(start), end: toIsoDate(end), prevStart: toIsoDate(prevStart) };
}
