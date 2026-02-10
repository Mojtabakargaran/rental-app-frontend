import { Skeleton } from '@/components/ui/skeleton';

/**
 * Loading skeleton for equipment details page (P6UC03)
 */
export function EquipmentDetailsSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Page header */}
      <div className="mb-8">
        <Skeleton className="h-4 w-48 mb-2" />
        <Skeleton className="h-9 w-96" />
      </div>

      {/* Basic Information Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="border-b border-gray-200 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-5 w-full" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-full" />
          </div>
          <div className="md:col-span-2 space-y-1">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />
          </div>
        </div>
      </div>

      {/* Specifications Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="border-b border-gray-200 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-5 w-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Financial Details Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <Skeleton className="h-6 w-44 mb-4" />
        <div className="border-b border-gray-200 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-5 w-full" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-5 w-full" />
          </div>
        </div>
      </div>

      {/* Status Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <Skeleton className="h-6 w-24 mb-4" />
        <div className="border-b border-gray-200 mb-4" />
        <Skeleton className="h-8 w-32" />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}
