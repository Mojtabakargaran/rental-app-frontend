'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { AxiosError } from 'axios';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useGetCategories } from '@/hooks/use-get-categories';
import { CategoryFilters } from './category-filters';
import { CategoryTree } from './category-tree';
import { CategoryPagination } from './category-pagination';
import { CategoryEmptyState } from './category-empty-state';
import { CategorySkeleton } from './category-skeleton';
import type { EquipmentErrorResponse } from '@/types/equipment.types';

export function CategoriesList() {
  const t = useTranslations('equipment-category');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive' | 'all'>('all');
  const [hierarchyLevel, setHierarchyLevel] = useState<'top-level' | 'sub-categories' | 'all'>('all');

  const { data, isLoading, error } = useGetCategories({
    page,
    pageSize: 20,
    search: search || undefined,
    status,
    hierarchyLevel,
  });

  const handleClearFilters = () => {
    setSearch('');
    setStatus('all');
    setHierarchyLevel('all');
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasFilters = search.length > 0 || status !== 'all' || hierarchyLevel !== 'all';

  // Error handling
  const errorMessage = error instanceof AxiosError
    ? (error.response?.data as EquipmentErrorResponse)?.code
    : null;
  
  // Strip "error." prefix if present (backend format: "error.ERROR_NAME")
  const errorCode = errorMessage && typeof errorMessage === 'string' && errorMessage.startsWith('error.')
    ? errorMessage.substring(6)
    : errorMessage;

  if (error) {
    return (
      <div className="space-y-6">
        <CategoryFilters
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={setStatus}
          hierarchyLevel={hierarchyLevel}
          onHierarchyLevelChange={setHierarchyLevel}
          onClearFilters={handleClearFilters}
        />
        
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>{t('list.error')}</AlertTitle>
          <AlertDescription>
            {errorCode ? t(`validation.${errorCode}`) : error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <CategoryFilters
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={setStatus}
          hierarchyLevel={hierarchyLevel}
          onHierarchyLevelChange={setHierarchyLevel}
          onClearFilters={handleClearFilters}
        />
        <CategorySkeleton />
      </div>
    );
  }

  // Empty state
  if (!data || !data.data?.categories || data.data.categories.length === 0) {
    return (
      <div className="space-y-6">
        <CategoryFilters
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={setStatus}
          hierarchyLevel={hierarchyLevel}
          onHierarchyLevelChange={setHierarchyLevel}
          onClearFilters={handleClearFilters}
        />
        <CategoryEmptyState hasFilters={hasFilters} />
      </div>
    );
  }

  // Success state
  return (
    <div className="space-y-6">
      <CategoryFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        hierarchyLevel={hierarchyLevel}
        onHierarchyLevelChange={setHierarchyLevel}
        onClearFilters={handleClearFilters}
      />

      <CategoryTree categories={data.data.categories} />

      {data.data.pagination.totalPages > 1 && (
        <CategoryPagination
          pagination={data.data.pagination}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
