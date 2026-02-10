'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CategoryFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: 'active' | 'inactive' | 'all';
  onStatusChange: (value: 'active' | 'inactive' | 'all') => void;
  hierarchyLevel: 'top-level' | 'sub-categories' | 'all';
  onHierarchyLevelChange: (value: 'top-level' | 'sub-categories' | 'all') => void;
  onClearFilters: () => void;
}

export function CategoryFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  hierarchyLevel,
  onHierarchyLevelChange,
  onClearFilters,
}: CategoryFiltersProps) {
  const t = useTranslations('equipment-category.list');
  const [searchInput, setSearchInput] = useState(search);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    const timeoutId = setTimeout(() => {
      onSearchChange(value);
    }, 300);
    return () => clearTimeout(timeoutId);
  };

  const hasActiveFilters = search || status !== 'all' || hierarchyLevel !== 'all';

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      {/* Search Bar */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
        <Input
          type="text"
          placeholder={t('search.placeholder')}
          value={searchInput}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full ps-10 pe-10"
        />
        {searchInput && (
          <button
            onClick={() => {
              setSearchInput('');
              onSearchChange('');
            }}
            className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Clear search"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Status Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="min-w-[140px] justify-between">
            {t('filters.status.label')}: {t(`filters.status.${status}`)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-[14rem]">
          <DropdownMenuLabel>{t('filters.status.label')}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={status} onValueChange={(value) => onStatusChange(value as typeof status)}>
            <DropdownMenuRadioItem value="all">
              {t('filters.status.all')}
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="active">
              {t('filters.status.active')}
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="inactive">
              {t('filters.status.inactive')}
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Hierarchy Level Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="min-w-[140px] justify-between">
            {t('filters.hierarchyLevel.label')}: {t(`filters.hierarchyLevel.${hierarchyLevel === 'top-level' ? 'topLevel' : hierarchyLevel === 'sub-categories' ? 'subCategories' : 'all'}`)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-[14rem]">
          <DropdownMenuLabel>{t('filters.hierarchyLevel.label')}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={hierarchyLevel} onValueChange={(value) => onHierarchyLevelChange(value as typeof hierarchyLevel)}>
            <DropdownMenuRadioItem value="all">
              {t('filters.hierarchyLevel.all')}
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="top-level">
              {t('filters.hierarchyLevel.topLevel')}
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="sub-categories">
              {t('filters.hierarchyLevel.subCategories')}
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button variant="ghost" onClick={onClearFilters}>
          {t('filters.clearAll')}
        </Button>
      )}
    </div>
  );
}
