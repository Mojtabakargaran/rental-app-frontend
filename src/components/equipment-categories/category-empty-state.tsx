'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { FolderPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CategoryEmptyStateProps {
  hasFilters: boolean;
}

export function CategoryEmptyState({ hasFilters }: CategoryEmptyStateProps) {
  const t = useTranslations('equipment-category.list');

  if (hasFilters) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 py-12">
        <div className="flex flex-col items-center justify-center text-center px-4">
          <FolderPlus className="size-12 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {t('noResults.title')}
          </h3>
          <p className="text-gray-500 max-w-md">
            {t('noResults.description')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 py-12">
      <div className="flex flex-col items-center justify-center text-center px-4">
        <FolderPlus className="size-12 text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {t('empty.title')}
        </h3>
        <p className="text-gray-500 max-w-md mb-6">
          {t('empty.description')}
        </p>
        <Link href="/equipment-categories/create">
          <Button>
            <FolderPlus className="size-4 me-2" />
            {t('empty.createFirst')}
          </Button>
        </Link>
      </div>
    </div>
  );
}
