/**
 * Date formatting utilities for locale-aware date display
 * Supports both English (en) and Farsi (fa) locales
 */

/**
 * Format a date string to a localized date (without time)
 * @param dateString - ISO date string or null
 * @param locale - Current locale (en or fa)
 * @param fallback - Fallback text when date is null/undefined
 * @returns Formatted date string
 */
export function formatDate(
  dateString: string | null | undefined,
  locale: string,
  fallback = '-'
): string {
  if (!dateString) return fallback;
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return fallback;
  }
}

/**
 * Format a date string to a localized date with short month
 * @param dateString - ISO date string or null
 * @param locale - Current locale (en or fa)
 * @param fallback - Fallback text when date is null/undefined
 * @returns Formatted date string
 */
export function formatDateShort(
  dateString: string | null | undefined,
  locale: string,
  fallback = '-'
): string {
  if (!dateString) return fallback;
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return fallback;
  }
}

/**
 * Format a date string to a localized datetime (with time)
 * @param dateString - ISO date string or null
 * @param locale - Current locale (en or fa)
 * @param fallback - Fallback text when date is null/undefined
 * @returns Formatted datetime string
 */
export function formatDateTime(
  dateString: string | null | undefined,
  locale: string,
  fallback = '-'
): string {
  if (!dateString) return fallback;
  
  try {
    const date = new Date(dateString);
    return date.toLocaleString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    console.error('Error formatting datetime:', error);
    return fallback;
  }
}

/**
 * Format a date string to a localized datetime with seconds
 * @param dateString - ISO date string or null
 * @param locale - Current locale (en or fa)
 * @param fallback - Fallback text when date is null/undefined
 * @returns Formatted datetime string with seconds
 */
export function formatDateTimeWithSeconds(
  dateString: string | null | undefined,
  locale: string,
  fallback = '-'
): string {
  if (!dateString) return fallback;
  
  try {
    const date = new Date(dateString);
    return date.toLocaleString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch (error) {
    console.error('Error formatting datetime:', error);
    return fallback;
  }
}

/**
 * Format a date string to a relative time string (e.g., "2 days ago")
 * @param dateString - ISO date string
 * @param locale - Current locale (en or fa)
 * @returns Relative time string
 */
export function formatRelativeTime(
  dateString: string,
  locale: string
): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

    if (diffInSeconds < 60) {
      return rtf.format(-diffInSeconds, 'second');
    } else if (diffInSeconds < 3600) {
      return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
    } else if (diffInSeconds < 86400) {
      return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
    } else if (diffInSeconds < 604800) {
      return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
    } else if (diffInSeconds < 2592000) {
      return rtf.format(-Math.floor(diffInSeconds / 604800), 'week');
    } else if (diffInSeconds < 31536000) {
      return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month');
    } else {
      return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year');
    }
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return dateString;
  }
}

/**
 * Format a date for use in date input fields (YYYY-MM-DD)
 * @param date - Date object or null
 * @returns ISO date string (YYYY-MM-DD) or empty string
 */
export function formatDateForInput(date: Date | null): string {
  if (!date) return '';
  
  try {
    return date.toISOString().split('T')[0];
  } catch (error) {
    console.error('Error formatting date for input:', error);
    return '';
  }
}

/**
 * Get current date formatted for input fields
 * @returns Current date in YYYY-MM-DD format
 */
export function getTodayForInput(): string {
  return formatDateForInput(new Date());
}

/**
 * Get current year
 * @returns Current year as number
 */
export function getCurrentYear(): number {
  return new Date().getFullYear();
}

/**
 * Convert Gregorian year to Jalali (Persian) year
 * Approximate conversion: Jalali year = Gregorian year - 621 or 622 depending on the month
 * For year-only conversion, we use the average: Gregorian - 621
 * @param gregorianYear - Gregorian year
 * @returns Jalali year
 */
export function gregorianToJalali(gregorianYear: number): number {
  // Simple approximation for year-only conversion
  // In practice: 2024 (Gregorian) ≈ 1403 (Jalali)
  return gregorianYear - 621;
}

/**
 * Convert Jalali (Persian) year to Gregorian year
 * Approximate conversion: Gregorian year = Jalali year + 621 or 622
 * For year-only conversion, we use the average: Jalali + 621
 * @param jalaliYear - Jalali year
 * @returns Gregorian year
 */
export function jalaliToGregorian(jalaliYear: number): number {
  // Simple approximation for year-only conversion
  // In practice: 1403 (Jalali) ≈ 2024 (Gregorian)
  return jalaliYear + 621;
}

/**
 * Get current year in Jalali (Persian) calendar
 * @returns Current Jalali year as number
 */
export function getCurrentJalaliYear(): number {
  return gregorianToJalali(getCurrentYear());
}

/**
 * Generate year options for a year picker based on locale
 * @param locale - Current locale (en or fa)
 * @param startYear - Starting year in Gregorian
 * @param endYear - Ending year in Gregorian (defaults to current year)
 * @returns Array of { value: gregorianYear, label: displayYear }
 */
export function generateYearOptions(
  locale: string,
  startYear = 1900,
  endYear = getCurrentYear()
): Array<{ value: number; label: string }> {
  const years: Array<{ value: number; label: string }> = [];
  const isFarsi = locale === 'fa';
  
  for (let gregorianYear = endYear; gregorianYear >= startYear; gregorianYear--) {
    const displayYear = isFarsi ? gregorianToJalali(gregorianYear) : gregorianYear;
    years.push({
      value: gregorianYear, // Always store Gregorian
      label: displayYear.toString(), // Display based on locale
    });
  }
  
  return years;
}
