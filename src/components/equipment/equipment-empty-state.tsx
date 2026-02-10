'use client';

import { useTranslations } from 'next-intl';
import { Package, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EquipmentEmptyStateProps {
  hasFilters: boolean;
  onClearFilters: () => void;
  onAddEquipment: () => void;
}

export function EquipmentEmptyState({
  hasFilters,
  onClearFilters,
  onAddEquipment,
}: EquipmentEmptyStateProps) {
  const t = useTranslations('equipment-inventory.list');

  if (hasFilters) {
    // No results with active filters
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 bg-white rounded-lg border border-gray-200">
        <Package className="size-12 text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {t('noResults.title')}
        </h3>
        <p className="text-gray-500 text-center mb-6 max-w-md">
          {t('noResults.description')}
        </p>
        <Button onClick={onClearFilters} variant="outline" className="gap-2">
          <X className="size-4" />
          {t('noResults.clearFilters')}
        </Button>
      </div>
    );
  }

  // No equipment at all
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 bg-white rounded-lg border border-gray-200">
      <Package className="size-12 text-gray-400 mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {t('empty.title')}
      </h3>
      <p className="text-gray-500 text-center mb-6 max-w-md">
        {t('empty.description')}
      </p>
      <Button onClick={onAddEquipment} className="gap-2">
        <Plus className="size-4" />
        {t('empty.createFirst')}
      </Button>
    </div>
  );
}
