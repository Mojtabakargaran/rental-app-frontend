'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CategoriesList } from '@/components/equipment-categories/categories-list';

export default function EquipmentCategoriesPage() {
  const t = useTranslations('equipment-category.list');

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white drop-shadow-sm">{t('title')}</h1>
              <p className="text-blue-100 mt-2">{t('subtitle')}</p>
            </div>
            <Link href="/equipment-categories/create">
              <Button className="bg-white hover:bg-gray-100 text-blue-700 font-medium shadow-sm">
                <Plus className="size-4 me-2" />
                {t('createButton')}
              </Button>
            </Link>
          </div>
        </div>

        <CategoriesList />
      </div>
    </DashboardLayout>
  );
}

