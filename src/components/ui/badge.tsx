import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'active' | 'inactive' | 'manager' | 'staff' | 'maintenance' | 'readOnly' | 'companyOwner' | 'destructive';
}

/**
 * Badge component for displaying status and role indicators
 */
function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium transition-colors',
        {
          'bg-gray-100 text-gray-800': variant === 'default',
          'bg-emerald-100 text-emerald-700': variant === 'active',
          'bg-red-100 text-red-700': variant === 'inactive',
          'bg-purple-600 text-white': variant === 'manager',
          'bg-emerald-500 text-white': variant === 'staff',
          'bg-orange-500 text-white': variant === 'maintenance',
          'bg-gray-500 text-white': variant === 'readOnly',
          'bg-blue-600 text-white': variant === 'companyOwner',
          'bg-red-500 text-white': variant === 'destructive',
        },
        className
      )}
      {...props}
    />
  );
}

export { Badge };
