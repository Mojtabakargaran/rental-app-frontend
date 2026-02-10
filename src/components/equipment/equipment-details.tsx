'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatDate, formatDateTime, gregorianToJalali } from '@/utils/date.util';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EquipmentDetailsSkeleton } from './equipment-details-skeleton';
import { ChangeStatusDialog } from './change-status-dialog';
import { ArchiveEquipmentDialog } from './archive-equipment-dialog';
import { DeleteEquipmentPermanentlyDialog } from './delete-equipment-permanently-dialog';
import { useGetEquipmentDetails } from '@/hooks/use-get-equipment-details';
import type { EquipmentDetails, EquipmentErrorResponse } from '@/types/equipment.types';
import { ChevronRight, AlertCircle, MoreVertical } from 'lucide-react';
import type { AxiosError } from 'axios';

interface EquipmentDetailsProps {
  equipmentId: string;
  locale: string;
}

/**
 * Equipment details display component (P6UC03)
 * Shows complete equipment information with sections for basic info, specifications, financial details, etc.
 */
export function EquipmentDetailsComponent({
  equipmentId,
  locale,
}: EquipmentDetailsProps) {
  const t = useTranslations('equipment-inventory.details');
  const tValidation = useTranslations('equipment-inventory.createEquipment.validation');
  const router = useRouter();
  const queryClient = useQueryClient();

  const [changeStatusDialogOpen, setChangeStatusDialogOpen] = useState(false);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data, isLoading, error } = useGetEquipmentDetails(equipmentId);

  const handleStatusChangeSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['equipment', 'details', equipmentId] });
  };

  const handleArchiveSuccess = () => {
    router.push(`/${locale}/equipment-inventory`);
  };

  const handleDeleteSuccess = () => {
    router.push(`/${locale}/equipment-inventory`);
  };

  if (isLoading) {
    return <EquipmentDetailsSkeleton />;
  }

  if (error || !data?.success) {
    const axiosError = error as AxiosError<EquipmentErrorResponse>;
    const errorCode = axiosError?.response?.data?.code;
    
    // Strip "error." prefix if present (backend format: "error.ERROR_NAME" or "error.equipment.ERROR_NAME")
    let strippedErrorCode = errorCode;
    if (strippedErrorCode && typeof strippedErrorCode === 'string') {
      if (strippedErrorCode.startsWith('error.equipment.')) {
        strippedErrorCode = strippedErrorCode.substring(16);
      } else if (strippedErrorCode.startsWith('error.')) {
        strippedErrorCode = strippedErrorCode.substring(6);
      }
    }
    
    const errorMessage = strippedErrorCode
      ? tValidation(strippedErrorCode)
      : t('errors.loadFailed');

    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
        <div className="mt-6">
          <Button
            variant="outline"
            onClick={() => router.push(`/${locale}/equipment-inventory`)}
          >
            {t('actions.backToList')}
          </Button>
        </div>
      </div>
    );
  }

  const equipment: EquipmentDetails = data.data;

  // Format price helper
  const formatPrice = (price: number | null) => {
    if (price === null) return t('values.notSpecified');
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'USD', // This should come from tenant settings in a real app
    }).format(price);
  };

  // Status badge variant helper
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-emerald-500 text-white';
      case 'Rented':
        return 'bg-blue-500 text-white';
      case 'Maintenance':
        return 'bg-orange-500 text-white';
      case 'Out of Service':
        return 'bg-red-500 text-white';
      default:
        return 'default';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 mb-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-blue-100 mb-3">
          <button
            onClick={() => router.push(`/${locale}/equipment-inventory`)}
            className="hover:text-white hover:underline"
          >
            {t('backToList')}
          </button>
          <ChevronRight className="h-4 w-4" />
          <span className="text-white font-medium">{equipment.name}</span>
        </div>

        {/* Title with archived badge */}
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-white drop-shadow-sm">{equipment.name}</h1>
          {equipment.isArchived && (
            <Badge variant="destructive" className="bg-red-600">{t('badges.archived')}</Badge>
          )}
        </div>

        {/* Category breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-blue-100 mt-3">
          {equipment.categoryHierarchy.map((cat, index) => (
            <div key={cat.id} className="flex items-center gap-2">
              {index > 0 && <ChevronRight className="h-3 w-3" />}
              <span>{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Basic Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-200">
          {t('sections.basic')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">
              {t('fields.name')}
            </label>
            <p className="text-base text-gray-900">{equipment.name}</p>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">
              {t('fields.category')}
            </label>
            <p className="text-base text-gray-900">{equipment.categoryPath}</p>
          </div>

          <div className="md:col-span-2 space-y-1">
            <label className="text-sm font-medium text-gray-600">
              {t('fields.description')}
            </label>
            <p className="text-base text-gray-900">
              {equipment.description || (
                <span className="text-gray-500 italic">
                  {t('values.noDescription')}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Specifications */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-200">
          {t('sections.specifications')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">
              {t('fields.manufacturer')}
            </label>
            <p className="text-base text-gray-900">
              {equipment.manufacturer || (
                <span className="text-gray-500 italic">
                  {t('values.notSpecified')}
                </span>
              )}
            </p>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">
              {t('fields.model')}
            </label>
            <p className="text-base text-gray-900">
              {equipment.model || (
                <span className="text-gray-500 italic">
                  {t('values.notSpecified')}
                </span>
              )}
            </p>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">
              {t('fields.serialNumber')}
            </label>
            <p className="text-base text-gray-900">
              {equipment.serialNumber || (
                <span className="text-gray-500 italic">
                  {t('values.notSpecified')}
                </span>
              )}
            </p>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">
              {t('fields.yearOfManufacture')}
            </label>
            <p className="text-base text-gray-900">
              {equipment.yearOfManufacture ? (
                locale === 'fa' 
                  ? gregorianToJalali(equipment.yearOfManufacture)
                  : equipment.yearOfManufacture
              ) : (
                <span className="text-gray-500 italic">
                  {t('values.notSpecified')}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Financial Details */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-200">
          {t('sections.financial')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">
              {t('fields.purchasePrice')}
            </label>
            <p className="text-base text-gray-900">
              {formatPrice(equipment.purchasePrice)}
            </p>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">
              {t('fields.purchaseDate')}
            </label>
            <p className="text-base text-gray-900">
              {formatDate(equipment.purchaseDate, locale, t('values.notSpecified'))}
            </p>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-200">
          {t('sections.status')}
        </h2>
        <Badge className={getStatusVariant(equipment.status)}>
          {equipment.status}
        </Badge>
      </div>

      {/* Custom Attributes */}
      {equipment.customAttributes && equipment.customAttributes.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-200">
            {t('sections.customAttributes')}
          </h2>
          <div className="w-full border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-start text-sm font-semibold text-gray-900">
                    {t('customAttributesTable.columns.name')}
                  </th>
                  <th className="px-4 py-3 text-start text-sm font-semibold text-gray-900">
                    {t('customAttributesTable.columns.value')}
                  </th>
                  <th className="px-4 py-3 text-start text-sm font-semibold text-gray-900">
                    {t('customAttributesTable.columns.unit')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {equipment.customAttributes.map((attr, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {attr.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {String(attr.value)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {attr.unit || t('customAttributesTable.noUnit')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-200">
          {t('sections.metadata')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">
              {t('fields.createdBy')}
            </label>
            <p className="text-base text-gray-900">
              {equipment.metadata.createdBy.fullName}
            </p>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">
              {t('fields.createdAt')}
            </label>
            <p className="text-base text-gray-900">
              {formatDateTime(equipment.metadata.createdAt, locale)}
            </p>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">
              {t('fields.updatedBy')}
            </label>
            <p className="text-base text-gray-900">
              {equipment.metadata.updatedBy.fullName}
            </p>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">
              {t('fields.updatedAt')}
            </label>
            <p className="text-base text-gray-900">
              {formatDateTime(equipment.metadata.updatedAt, locale)}
            </p>
          </div>

          {equipment.metadata.deletedAt && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">
                {t('fields.deletedAt')}
              </label>
              <p className="text-base text-gray-900">
                {formatDateTime(equipment.metadata.deletedAt, locale)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={() => router.push(`/${locale}/equipment-inventory`)}
        >
          {t('actions.backToList')}
        </Button>

        {!equipment.isArchived && equipment.permissions.canEdit && (
          <Button
            onClick={() => {
              router.push(`/${locale}/equipment-inventory/${equipmentId}/edit`);
            }}
          >
            {t('actions.edit')}
          </Button>
        )}

        {!equipment.isArchived && (equipment.permissions.canEdit || equipment.permissions.canDelete) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>{t('actions.actions')}</DropdownMenuLabel>
              <DropdownMenuSeparator />

              {equipment.permissions.canEdit && (
                <DropdownMenuItem onClick={() => setChangeStatusDialogOpen(true)}>
                  {t('actions.changeStatus')}
                </DropdownMenuItem>
              )}

              {equipment.permissions.canDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setArchiveDialogOpen(true)}
                    className="text-amber-700"
                  >
                    {t('actions.archiveEquipment')}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setDeleteDialogOpen(true)}
                    className="text-red-600"
                  >
                    {t('actions.deleteEquipment')}
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Dialogs */}
      <ChangeStatusDialog
        equipmentId={equipmentId}
        equipmentName={equipment.name}
        currentStatus={equipment.status}
        open={changeStatusDialogOpen}
        onOpenChange={setChangeStatusDialogOpen}
        onSuccess={handleStatusChangeSuccess}
      />

      <ArchiveEquipmentDialog
        equipmentId={equipmentId}
        equipmentName={equipment.name}
        open={archiveDialogOpen}
        onOpenChange={setArchiveDialogOpen}
        onSuccess={handleArchiveSuccess}
      />

      <DeleteEquipmentPermanentlyDialog
        equipmentId={equipmentId}
        equipmentName={equipment.name}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
}
