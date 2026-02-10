import { EquipmentDetailsComponent } from '@/components/equipment';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

interface PageProps {
  params: {
    locale: string;
    equipmentId: string;
  };
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'equipment-inventory' });

  return {
    title: `${t('viewEquipment.pageTitle')} | ${t('viewEquipment.appName')}`,
    description: t('viewEquipment.pageDescription'),
  };
}

/**
 * Equipment details page (P6UC03)
 * Displays complete information about a specific equipment item
 */
export default function EquipmentInventoryDetailsPage({ params }: PageProps) {
  const { locale, equipmentId } = params;

  return (
    <DashboardLayout>
      <EquipmentDetailsComponent equipmentId={equipmentId} locale={locale} />
    </DashboardLayout>
  );
}
