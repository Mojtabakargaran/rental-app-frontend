'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useListEquipment } from '@/hooks/use-list-equipment';
import type { EquipmentStatus } from '@/types/equipment.types';
import { EquipmentFilters } from './equipment-filters';
import { EquipmentTable } from './equipment-table';
import { EquipmentPagination } from './equipment-pagination';
import { EquipmentEmptyState } from './equipment-empty-state';
import { EquipmentSkeleton } from './equipment-skeleton';

export function EquipmentList() {
  const t = useTranslations('equipment-inventory.list');
  const router = useRouter();

  // State for filters and pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<EquipmentStatus[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [manufacturerFilter, setManufacturerFilter] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'status' | 'createdAt' | 'purchaseDate'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Fetch equipment data
  const { data, isLoading, isError } = useListEquipment({
    page,
    limit,
    searchQuery: search || undefined,
    status: statusFilter.length > 0 ? statusFilter : undefined,
    categoryId: categoryFilter.length > 0 ? categoryFilter : undefined,
    manufacturer: manufacturerFilter || undefined,
    sortBy,
    sortOrder,
  });

  // Handlers
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1); // Reset to first page on search
  };

  const handleStatusFilterChange = (statuses: EquipmentStatus[]) => {
    setStatusFilter(statuses);
    setPage(1);
  };

  const handleCategoryFilterChange = (categories: string[]) => {
    setCategoryFilter(categories);
    setPage(1);
  };

  const handleManufacturerFilterChange = (manufacturer: string) => {
    setManufacturerFilter(manufacturer);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearch('');
    setStatusFilter([]);
    setCategoryFilter([]);
    setManufacturerFilter('');
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleSortChange = (field: typeof sortBy) => {
    if (sortBy === field) {
      // Toggle sort order
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // New sort field, default to descending
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleAddEquipment = () => {
    router.push('/equipment-inventory/create');
  };

  // Check if any filters are active
  const hasActiveFilters = search || statusFilter.length > 0 || categoryFilter.length > 0 || manufacturerFilter;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white drop-shadow-sm">{t('title')}</h1>
              <p className="text-blue-100 mt-2">{t('subtitle')}</p>
            </div>
            <Button onClick={handleAddEquipment} className="gap-2 bg-white hover:bg-gray-100 text-blue-700 font-medium shadow-sm">
              <Plus className="size-4" />
              {t('addButton')}
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <EquipmentFilters
          search={search}
          onSearchChange={handleSearchChange}
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusFilterChange}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={handleCategoryFilterChange}
          manufacturerFilter={manufacturerFilter}
          onManufacturerFilterChange={handleManufacturerFilterChange}
          onClearFilters={handleClearFilters}
        />
      </div>

      {/* Error Alert */}
      {isError && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>
            {t('error')}
          </AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {isLoading && <EquipmentSkeleton />}

      {/* Equipment Table */}
      {!isLoading && !isError && data?.data?.items && data.data.items.length > 0 && (
        <>
          <EquipmentTable
            items={data.data.items}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
          />
          <div className="mt-6">
            <EquipmentPagination
              pagination={{
                total: data.data.total,
                page: data.data.page,
                limit: data.data.limit,
                totalPages: data.data.totalPages,
                hasNextPage: data.data.hasNextPage,
                hasPreviousPage: data.data.hasPreviousPage,
              }}
              onPageChange={handlePageChange}
              limit={limit}
              onLimitChange={handleLimitChange}
            />
          </div>
        </>
      )}

      {/* Empty State */}
      {!isLoading && !isError && (!data?.data?.items || data.data.items.length === 0) && (
        <EquipmentEmptyState
          hasFilters={!!hasActiveFilters}
          onClearFilters={handleClearFilters}
          onAddEquipment={handleAddEquipment}
        />
      )}
    </div>
  );
}
