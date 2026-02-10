'use client';

import { Skeleton } from '@/components/ui/skeleton';

export function CategorySkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="hidden lg:grid grid-cols-5 gap-4 px-4 py-3 bg-gray-50 border-b border-gray-200">
        <Skeleton className="h-5 w-24 col-span-2" />
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-24" />
      </div>

      {/* Rows */}
      <div className="divide-y divide-gray-100">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-center gap-2 px-4 py-3">
            <Skeleton className="size-4 shrink-0" />
            <Skeleton className="size-5 shrink-0" />
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 lg:gap-4">
              <div className="lg:col-span-2 space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
