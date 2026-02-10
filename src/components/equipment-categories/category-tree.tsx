'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { ChevronRight, ChevronDown, Folder, FolderOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { EditCategoryDialog } from './edit-category-dialog';
import { DeactivateCategoryDialog } from './deactivate-category-dialog';
import { ReactivateCategoryDialog } from './reactivate-category-dialog';
import { DeleteCategoryDialog } from './delete-category-dialog';
import type { Category } from '@/types/equipment.types';
import { formatDateShort } from '@/utils/date.util';

interface CategoryTreeProps {
  categories: Category[];
}

export function CategoryTree({ categories }: CategoryTreeProps) {
  const t = useTranslations('equipment-category.list');
  const params = useParams();
  const locale = params.locale as string;
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // Organize categories into a tree structure
  const organizeTree = (cats: Category[]) => {
    const categoryMap = new Map<string, Category & { children: Category[] }>();
    const roots: (Category & { children: Category[] })[] = [];

    // First pass: create map with children arrays
    cats.forEach((cat) => {
      categoryMap.set(cat.id, { ...cat, children: [] });
    });

    // Second pass: build tree
    cats.forEach((cat) => {
      const categoryWithChildren = categoryMap.get(cat.id)!;
      if (cat.parentId) {
        const parent = categoryMap.get(cat.parentId);
        if (parent) {
          parent.children.push(categoryWithChildren);
        } else {
          // Parent not in current filtered results, show as root
          roots.push(categoryWithChildren);
        }
      } else {
        roots.push(categoryWithChildren);
      }
    });

    return roots;
  };

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const renderCategory = (category: Category & { children: Category[] }, level: number = 0) => {
    const hasChildren = category.children.length > 0;
    const isExpanded = expandedIds.has(category.id);
    const indent = level * 24;

    return (
      <div key={category.id}>
        <div
          className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100"
          style={{ paddingInlineStart: `${indent + 16}px` }}
        >
          {/* Expand/Collapse Toggle */}
          {hasChildren ? (
            <button
              onClick={() => toggleExpand(category.id)}
              className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? (
                <ChevronDown className="size-4" />
              ) : (
                <ChevronRight className="size-4" />
              )}
            </button>
          ) : (
            <div className="size-4 shrink-0" />
          )}

          {/* Folder Icon */}
          <div className="shrink-0 text-gray-400">
            {hasChildren ? (
              isExpanded ? (
                <FolderOpen className="size-5" />
              ) : (
                <Folder className="size-5" />
              )
            ) : (
              <Folder className="size-5" />
            )}
          </div>

          {/* Category Details */}
          <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 items-center gap-2 lg:gap-4">
            {/* Name and Description */}
            <div className="lg:col-span-2 min-w-0">
              <h3 className="font-medium text-gray-900 truncate">{category.name}</h3>
              {category.description && (
                <p className="text-sm text-gray-500 truncate mt-0.5">{category.description}</p>
              )}
            </div>

            {/* Parent Category */}
            <div className="text-sm">
              <span className="text-gray-500 sm:hidden">{t('table.columns.parent')}: </span>
              <span className="text-gray-700">
                {category.parentName || t('table.noParent')}
              </span>
            </div>

            {/* Status */}
            <div>
              <Badge variant={category.isActive ? 'active' : 'inactive'}>
                {category.isActive ? t('filters.status.active') : t('filters.status.inactive')}
              </Badge>
            </div>

            {/* Children Count and Created Date */}
            <div className="text-sm space-y-1">
              {category.childrenCount > 0 && (
                <div className="text-gray-600">
                  {t('table.childrenCount', { count: category.childrenCount })}
                </div>
              )}
              <div className="text-gray-500 text-xs">
                {formatDateShort(category.createdAt, locale)}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2">
              <EditCategoryDialog category={category} />
              {category.isActive ? (
                <DeactivateCategoryDialog category={category} />
              ) : (
                <ReactivateCategoryDialog category={category} />
              )}
              <DeleteCategoryDialog category={category} />
            </div>
          </div>
        </div>

        {/* Render Children */}
        {hasChildren && isExpanded && (
          <div>
            {category.children.map((child) => renderCategory(child as Category & { children: Category[] }, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const tree = organizeTree(categories);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Table Header (Desktop) */}
      <div className="hidden lg:flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200 font-semibold text-sm text-gray-700">
        {/* Space for expand icon and folder icon */}
        <div className="size-4 shrink-0" />
        <div className="size-5 shrink-0" />
        
        <div className="flex-1 min-w-0 grid grid-cols-6 gap-2 lg:gap-4">
          <div className="col-span-2">{t('table.columns.name')}</div>
          <div>{t('table.columns.parent')}</div>
          <div>{t('table.columns.status')}</div>
          <div>{t('table.columns.created')}</div>
          <div className="text-start">{t('table.columns.actions')}</div>
        </div>
      </div>

      {/* Tree */}
      <div className="divide-y divide-gray-100">
        {tree.map((category) => renderCategory(category))}
      </div>
    </div>
  );
}
