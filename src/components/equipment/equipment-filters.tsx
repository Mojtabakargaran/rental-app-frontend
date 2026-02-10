'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Search, X, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { EquipmentStatus } from '@/types/equipment.types';
import { useGetCategoriesList } from '@/hooks/use-get-categories-list';

interface EquipmentFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: EquipmentStatus[];
  onStatusFilterChange: (statuses: EquipmentStatus[]) => void;
  categoryFilter: string[];
  onCategoryFilterChange: (categories: string[]) => void;
  manufacturerFilter: string;
  onManufacturerFilterChange: (manufacturer: string) => void;
  onClearFilters: () => void;
}

const EQUIPMENT_STATUSES: EquipmentStatus[] = ['Available', 'Rented', 'Maintenance', 'Out of Service'];

export function EquipmentFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  manufacturerFilter,
  onManufacturerFilterChange,
  onClearFilters,
}: EquipmentFiltersProps) {
  const t = useTranslations('equipment-inventory.list');
  const [searchInput, setSearchInput] = useState(search);

  // Fetch active categories for filter
  const { data: categoriesData } = useGetCategoriesList({ activeOnly: true });

  // Sync search input with parent prop (for when parent clears filters)
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(searchInput);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput, onSearchChange]);

  const handleStatusToggle = (status: EquipmentStatus) => {
    const newStatuses = statusFilter.includes(status)
      ? statusFilter.filter((s) => s !== status)
      : [...statusFilter, status];
    onStatusFilterChange(newStatuses);
  };

  const handleCategoryToggle = (categoryId: string) => {
    const newCategories = categoryFilter.includes(categoryId)
      ? categoryFilter.filter((c) => c !== categoryId)
      : [...categoryFilter, categoryId];
    onCategoryFilterChange(newCategories);
  };

  const activeFilterCount = 
    (search ? 1 : 0) + 
    statusFilter.length + 
    categoryFilter.length + 
    (manufacturerFilter ? 1 : 0);

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
        <Input
          type="text"
          placeholder={t('search.placeholder')}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchInput && (
          <button
            onClick={() => setSearchInput('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Status Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="size-4" />
              {t('filters.status.label')}
              {statusFilter.length > 0 && (
                <Badge variant="default" className="ml-1">
                  {statusFilter.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>{t('filters.status.label')}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {EQUIPMENT_STATUSES.map((status) => (
              <DropdownMenuCheckboxItem
                key={status}
                checked={statusFilter.includes(status)}
                onCheckedChange={() => handleStatusToggle(status)}
              >
                {t(`filters.status.${status}`)}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Category Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="size-4" />
              {t('filters.category.label')}
              {categoryFilter.length > 0 && (
                <Badge variant="default" className="ml-1">
                  {categoryFilter.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56 max-h-96 overflow-y-auto">
            <DropdownMenuLabel>{t('filters.category.label')}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {categoriesData?.data?.categories?.map((category) => (
              <DropdownMenuCheckboxItem
                key={category.id}
                checked={categoryFilter.includes(category.id)}
                onCheckedChange={() => handleCategoryToggle(category.id)}
              >
                {category.name}
              </DropdownMenuCheckboxItem>
            ))}
            {!categoriesData && (
              <div className="px-2 py-4 text-sm text-gray-500 text-center">
                {t('filters.category.loading')}
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Manufacturer Filter */}
        <Input
          type="text"
          placeholder={t('filters.manufacturer.placeholder')}
          value={manufacturerFilter}
          onChange={(e) => onManufacturerFilterChange(e.target.value)}
          className="w-64"
        />

        {/* Clear Filters Button */}
        {activeFilterCount > 0 && (
          <Button variant="ghost" onClick={onClearFilters} className="gap-2">
            <X className="size-4" />
            {t('filters.clearAll')}
          </Button>
        )}
      </div>

      {/* Active Filters Count */}
      {activeFilterCount > 0 && (
        <div className="text-sm text-gray-600">
          {t('filters.activeFilters')}: {activeFilterCount}
        </div>
      )}
    </div>
  );
}
