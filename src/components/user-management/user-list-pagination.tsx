'use client';

import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Pagination } from '@/types/user-management.types';

interface UserListPaginationProps {
  pagination: Pagination;
  onPageChange: (page: number) => void;
}

/**
 * User List Pagination Component - P4UC02
 * Displays pagination controls for user list
 */
export function UserListPagination({ pagination, onPageChange }: UserListPaginationProps) {
  const t = useTranslations('user-management');

  const { page, totalPages, total, limit, hasNext, hasPrev } = pagination;
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages with ellipsis
      if (page <= 3) {
        // Near start
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (page >= totalPages - 2) {
        // Near end
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        // Middle
        pages.push(1, '...', page - 1, page, page + 1, '...', totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
      {/* Results info */}
      <p className="text-sm text-gray-600">
        {t('list.pagination.showing', { from, to, total })}
      </p>

      {/* Pagination controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrev}
          className="disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-4 w-4 me-1" />
          {t('list.pagination.previous')}
        </Button>

        <div className="flex items-center gap-1">
          {pageNumbers.map((pageNum, index) => {
            if (pageNum === '...') {
              return (
                <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
                  ...
                </span>
              );
            }

            const isCurrentPage = pageNum === page;
            return (
              <Button
                key={pageNum}
                variant={isCurrentPage ? 'default' : 'outline'}
                size="sm"
                onClick={() => onPageChange(pageNum as number)}
                className={
                  isCurrentPage
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : ''
                }
                aria-current={isCurrentPage ? 'page' : undefined}
              >
                {pageNum}
              </Button>
            );
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNext}
          className="disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t('list.pagination.next')}
          <ChevronRight className="h-4 w-4 ms-1" />
        </Button>
      </div>
    </div>
  );
}
