/**
 * Date and Time Utility Functions
 * Based on GRATIS Part 1 specifications
 */

import { format, formatDistance, formatRelative, parseISO, isValid } from 'date-fns';
import { nl, de, fr, enUS } from 'date-fns/locale';
import { Timestamp } from 'firebase/firestore';

const locales = { nl, de, fr, en: enUS };

/**
 * Convert Firebase Timestamp to Date
 */
export function timestampToDate(timestamp: Timestamp | null | undefined): Date | null {
  if (!timestamp) return null;
  return timestamp.toDate();
}

/**
 * Convert Date to Firebase Timestamp
 */
export function dateToTimestamp(date: Date | null | undefined): Timestamp | null {
  if (!date) return null;
  return Timestamp.fromDate(date);
}

/**
 * Format date with locale support
 */
export function formatDate(
  date: Date | Timestamp | string | null | undefined,
  formatString: string = 'PPP',
  locale: string = 'en'
): string {
  if (!date) return '';

  let dateObj: Date;

  if (date instanceof Timestamp) {
    dateObj = date.toDate();
  } else if (typeof date === 'string') {
    dateObj = parseISO(date);
  } else {
    dateObj = date;
  }

  if (!isValid(dateObj)) return '';

  const localeObj = locales[locale as keyof typeof locales] || enUS;
  return format(dateObj, formatString, { locale: localeObj });
}

/**
 * Format date and time
 */
export function formatDateTime(
  date: Date | Timestamp | string | null | undefined,
  locale: string = 'en'
): string {
  return formatDate(date, 'PPP p', locale);
}

/**
 * Format date relative to now (e.g., "3 days ago")
 */
export function formatRelativeDate(
  date: Date | Timestamp | string | null | undefined,
  locale: string = 'en'
): string {
  if (!date) return '';

  let dateObj: Date;

  if (date instanceof Timestamp) {
    dateObj = date.toDate();
  } else if (typeof date === 'string') {
    dateObj = parseISO(date);
  } else {
    dateObj = date;
  }

  if (!isValid(dateObj)) return '';

  const localeObj = locales[locale as keyof typeof locales] || enUS;
  return formatDistance(dateObj, new Date(), { addSuffix: true, locale: localeObj });
}

/**
 * Format time only (e.g., "14:30")
 */
export function formatTime(
  date: Date | Timestamp | string | null | undefined,
  format24h: boolean = true
): string {
  return formatDate(date, format24h ? 'HH:mm' : 'h:mm a');
}

/**
 * Check if date is today
 */
export function isToday(date: Date | Timestamp): boolean {
  const dateObj = date instanceof Timestamp ? date.toDate() : date;
  const today = new Date();
  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if date is in the past
 */
export function isPast(date: Date | Timestamp): boolean {
  const dateObj = date instanceof Timestamp ? date.toDate() : date;
  return dateObj < new Date();
}

/**
 * Check if date is in the future
 */
export function isFuture(date: Date | Timestamp): boolean {
  const dateObj = date instanceof Timestamp ? date.toDate() : date;
  return dateObj > new Date();
}

/**
 * Get days until date
 */
export function daysUntil(date: Date | Timestamp): number {
  const dateObj = date instanceof Timestamp ? date.toDate() : date;
  const today = new Date();
  const diffTime = dateObj.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Get hours until date
 */
export function hoursUntil(date: Date | Timestamp): number {
  const dateObj = date instanceof Timestamp ? date.toDate() : date;
  const now = new Date();
  const diffTime = dateObj.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60));
}
