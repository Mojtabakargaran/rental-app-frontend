'use client';

import { forwardRef } from 'react';
import { useParams } from 'next/navigation';
import { generateYearOptions, getCurrentYear } from '@/utils/date.util';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface LocaleYearPickerProps {
  value?: number | null; // Gregorian year
  onChange?: (value: number | undefined) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  min?: number; // Minimum Gregorian year (default: 1900)
  max?: number; // Maximum Gregorian year (default: current year)
  id?: string;
  error?: boolean;
}

/**
 * Locale-aware year picker component
 * - Shows Jalali years for 'fa' locale
 * - Shows Gregorian years for 'en' locale
 * - Always stores/returns years in Gregorian format
 */
export const LocaleYearPicker = forwardRef<HTMLButtonElement, LocaleYearPickerProps>(
  ({ value, onChange, disabled, placeholder, className, min = 1900, max, id, error }, ref) => {
    const params = useParams();
    const locale = params.locale as string;
    
    const maxYear = max || getCurrentYear();
    const yearOptions = generateYearOptions(locale, min, maxYear);

    const handleChange = (yearString: string) => {
      if (yearString === 'undefined') {
        onChange?.(undefined);
      } else {
        const selectedYear = parseInt(yearString, 10);
        onChange?.(selectedYear);
      }
    };

    return (
      <Select
        value={value?.toString()}
        onValueChange={handleChange}
        disabled={disabled}
      >
        <SelectTrigger
          ref={ref}
          id={id}
          className={cn(
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {yearOptions.map((option) => (
            <SelectItem key={option.value} value={option.value.toString()}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }
);

LocaleYearPicker.displayName = 'LocaleYearPicker';
