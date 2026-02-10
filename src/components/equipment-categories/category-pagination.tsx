'use client';

import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { EquipmentPagination } from '@/types/equipment.types';

interface CategoryPaginationProps {
  pagination: EquipmentPagination;
  onPageChange: (page: number) => void;
}

export function CategoryPagination({
  pagination,
  onPageChange,
}: CategoryPaginationProps) {
  const t = useTranslations('equipment-category.list.pagination');
  const { currentPage, totalPages, totalItems, pageSize, hasNextPage, hasPreviousPage } = pagination;

  const from = (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
      {/* Results info */}
      <p className="text-sm text-gray-600">
        {t('showing', { from, to, total: totalItems })}
      </p>

      {/* Pagination controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPreviousPage}
          aria-label={t('previous')}
        >
          <ChevronLeft className="size-4" />
          <span className="hidden sm:inline ms-1">{t('previous')}</span>
        </Button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => {
            if (page === '...') {
              return (
                <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
                  ...
                </span>
              );
            }

            return (
              <Button
                key={page}
                variant={page === currentPage ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onPageChange(page as number)}
                className="min-w-[2.5rem]"
                aria-current={page === currentPage ? 'page' : undefined}
                aria-label={t('page', { page, total: totalPages })}
              >
                {page}
              </Button>
            );
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
          aria-label={t('next')}
        >
          <span className="hidden sm:inline me-1">{t('next')}</span>
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
