import { useTranslations } from 'next-intl';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { CreateCategoryForm } from '@/components/forms/create-category-form';

export default function CreateCategoryPage() {
  const t = useTranslations('equipment-category');

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-white drop-shadow-sm">{t('page.title')}</h1>
          <p className="text-blue-100 mt-2">{t('page.subtitle')}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <CreateCategoryForm />
        </div>
      </div>
    </DashboardLayout>
  );
}
