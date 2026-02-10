'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { ArrowLeft } from 'lucide-react';
import { useGetEquipmentDetails } from '@/hooks/use-get-equipment-details';
import { EditEquipmentForm } from '@/components/forms/edit-equipment-form';
import { EquipmentDetailsSkeleton } from '@/components/equipment';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import type { EquipmentErrorResponse } from '@/types/equipment.types';

interface EditEquipmentPageProps {
  params: {
    equipmentId: string;
  };
}

export default function EditEquipmentPage({ params }: EditEquipmentPageProps) {
  const t = useTranslations('equipment-inventory');
  const tShared = useTranslations('shared');
  const router = useRouter();
  const { equipmentId } = params;

  const {
    data: equipmentData,
    isLoading,
    error,
  } = useGetEquipmentDetails(equipmentId);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 mb-6 text-center">
            <h1 className="text-3xl font-bold text-white drop-shadow-sm">{t('edit.title')}</h1>
          </div>
          <EquipmentDetailsSkeleton />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !equipmentData) {
    const axiosError = error as AxiosError<EquipmentErrorResponse>;
    const errorCode = axiosError?.response?.data?.code;
    
    // Strip "error." prefix if present (backend format: "error.ERROR_NAME")
    const strippedErrorCode = errorCode && typeof errorCode === 'string' && errorCode.startsWith('error.')
      ? errorCode.substring(6)
      : errorCode;
    
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>{tShared('common.errors.title')}</AlertTitle>
            <AlertDescription>
              {strippedErrorCode
                ? t(`validation.${strippedErrorCode}`)
                : tShared('common.errors.unknown')}
            </AlertDescription>
          </Alert>
          <Button onClick={() => router.push('/equipment-inventory')}>
            <ArrowLeft className="h-4 w-4 me-2" />
            {t('details.backToList')}
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  // Check permissions
  if (!equipmentData.data.permissions.canEdit) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>{tShared('common.errors.title')}</AlertTitle>
            <AlertDescription>{t('validation.FORBIDDEN')}</AlertDescription>
          </Alert>
          <Button onClick={() => router.push(`/equipment-inventory/${equipmentId}`)}>
            <ArrowLeft className="h-4 w-4 me-2" />
            {t('details.backToDetails')}
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  // Check if archived
  if (equipmentData.data.isArchived) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>{tShared('common.errors.title')}</AlertTitle>
            <AlertDescription>{t('validation.EQUIPMENT_ARCHIVED')}</AlertDescription>
          </Alert>
          <Button onClick={() => router.push(`/equipment-inventory/${equipmentId}`)}>
            <ArrowLeft className="h-4 w-4 me-2" />
            {t('details.backToDetails')}
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push(`/equipment-inventory/${equipmentId}`)}
            className="mb-4 hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4 me-2" />
            {t('details.backToDetails')}
          </Button>
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-center">
            <h1 className="text-3xl font-bold text-white drop-shadow-sm">{t('edit.title')}</h1>
            <p className="text-blue-100 mt-2">{t('edit.subtitle')}</p>
          </div>
        </div>

        {/* Edit Form */}
        <EditEquipmentForm
          equipmentId={equipmentId}
          equipmentData={equipmentData.data}
        />
      </div>
    </DashboardLayout>
  );
}
