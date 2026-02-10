'use client';

import { useTranslations } from 'next-intl';
import { Users, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UserListEmptyProps {
  hasFilters: boolean;
  searchQuery: string;
  onClearFilters: () => void;
  onCreateUser: () => void;
}

/**
 * User List Empty State Component - P4UC02
 * Displays empty state when no users found
 */
export function UserListEmpty({
  hasFilters,
  onClearFilters,
  onCreateUser,
}: UserListEmptyProps) {
  const t = useTranslations('user-management');

  if (hasFilters) {
    // No results for filters/search
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Search className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {t('list.emptyState.noResults')}
        </h3>
        <p className="text-gray-500 mb-6 max-w-md">
          {t('list.emptyState.noResultsDescription')}
        </p>
        <Button
          onClick={onClearFilters}
          variant="outline"
          className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition-colors"
        >
          {t('list.filters.clearAll')}
        </Button>
      </div>
    );
  }

  // No users at all
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Users className="h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {t('list.emptyState.noUsers')}
      </h3>
      <p className="text-gray-500 mb-6 max-w-md">
        {t('list.emptyState.noUsersDescription')}
      </p>
      <Button
        onClick={onCreateUser}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {t('list.createButton')}
      </Button>
    </div>
  );
}
