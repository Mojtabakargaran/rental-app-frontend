import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { CreateEquipmentForm } from '@/components/forms/create-equipment-form';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({
    locale,
    namespace: 'equipment-inventory.createEquipment',
  });

  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default function CreateEquipmentPage() {
  const t = useTranslations('equipment-inventory.createEquipment');

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-white drop-shadow-sm">{t('title')}</h1>
          <p className="mt-2 text-base text-blue-100">{t('subtitle')}</p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <CreateEquipmentForm />
        </div>
      </div>
    </DashboardLayout>
  );
}
