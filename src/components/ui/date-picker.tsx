'use client';

import { forwardRef, useMemo, useCallback } from 'react';
import { useParams } from 'next/navigation';
import DatePicker from 'react-multi-date-picker';
import type { Value } from 'react-multi-date-picker';
import DateObject from 'react-date-object';
import persian from 'react-date-object/calendars/persian';
import gregorian from 'react-date-object/calendars/gregorian';
import persian_fa from 'react-date-object/locales/persian_fa';
import gregorian_en from 'react-date-object/locales/gregorian_en';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LocaleDatePickerProps {
  value?: string | null; // ISO date string (YYYY-MM-DD)
  onChange?: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  max?: string; // ISO date string (YYYY-MM-DD)
  min?: string; // ISO date string (YYYY-MM-DD)
  id?: string;
  error?: boolean;
}

/**
 * Locale-aware date picker component
 * - Shows Jalali calendar for 'fa' locale
 * - Shows Gregorian calendar for 'en' locale
 * - Always stores/returns dates in Gregorian format (YYYY-MM-DD)
 */
export const LocaleDatePicker = forwardRef<HTMLInputElement, LocaleDatePickerProps>(
  ({ value, onChange, disabled, placeholder, className, max, min, id, error }, ref) => {
    const params = useParams();
    const locale = params.locale as string;
    const isFarsi = locale === 'fa';

    // Convert Gregorian date string to DateObject with proper calendar
    const convertToDateObject = useCallback((dateStr: string | null | undefined): DateObject | null => {
      if (!dateStr) return null;
      
      // Parse the Gregorian date string
      const gregorianDate = new DateObject({
        date: dateStr,
        calendar: gregorian,
        locale: gregorian_en,
        format: 'YYYY-MM-DD',
      });
      
      // If Farsi locale, convert to Persian/Jalali calendar for display
      if (isFarsi) {
        return gregorianDate.convert(persian, persian_fa);
      }
      
      return gregorianDate;
    }, [isFarsi]);

    // Memoize the converted date object
    const dateValue = useMemo(() => convertToDateObject(value), [value, convertToDateObject]);

    const handleChange = (date: Value) => {
      if (!date) {
        onChange?.('');
        return;
      }

      // Convert to ISO string (YYYY-MM-DD) in Gregorian calendar
      const dateObj = Array.isArray(date) ? date[0] : date;
      if (dateObj && typeof dateObj === 'object' && 'format' in dateObj) {
        // Format as YYYY-MM-DD in Gregorian
        const gregorianDate = dateObj.convert(gregorian, gregorian_en).format('YYYY-MM-DD');
        onChange?.(gregorianDate);
      }
    };

    // Convert max/min to DateObject with proper calendar for comparison
    const maxDate = useMemo(() => {
      if (!max) return undefined;
      const gregorianDate = new DateObject({
        date: max,
        calendar: gregorian,
        locale: gregorian_en,
        format: 'YYYY-MM-DD',
      });
      return isFarsi ? gregorianDate.convert(persian, persian_fa) : gregorianDate;
    }, [max, isFarsi]);

    const minDate = useMemo(() => {
      if (!min) return undefined;
      const gregorianDate = new DateObject({
        date: min,
        calendar: gregorian,
        locale: gregorian_en,
        format: 'YYYY-MM-DD',
      });
      return isFarsi ? gregorianDate.convert(persian, persian_fa) : gregorianDate;
    }, [min, isFarsi]);

    return (
      <div className="relative">
        <DatePicker
          value={dateValue}
          onChange={handleChange}
          calendar={isFarsi ? persian : gregorian}
          locale={isFarsi ? persian_fa : gregorian_en}
          format={isFarsi ? 'YYYY/MM/DD' : 'YYYY-MM-DD'}
          disabled={disabled}
          placeholder={placeholder}
          maxDate={maxDate}
          minDate={minDate}
          id={id}
          containerClassName="w-full"
          inputClass={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
            'file:border-0 file:bg-transparent file:text-sm file:font-medium',
            'placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-500 focus-visible:ring-red-500',
            className
          )}
          style={{
            width: '100%',
          }}
        />
        <Calendar className="absolute end-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        <input
          type="hidden"
          ref={ref}
          value={value || ''}
          readOnly
        />
      </div>
    );
  }
);

LocaleDatePicker.displayName = 'LocaleDatePicker';
