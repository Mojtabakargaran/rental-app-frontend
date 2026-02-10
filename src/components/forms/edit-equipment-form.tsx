'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { Plus, X } from 'lucide-react';
import { editEquipmentSchema, type EditEquipmentFormData } from '@/schemas/edit-equipment.schema';
import { useUpdateEquipment } from '@/hooks/use-update-equipment';
import { useGetCategoriesList } from '@/hooks/use-get-categories-list';
import { getCurrentYear, getTodayForInput } from '@/utils/date.util';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LocaleDatePicker } from '@/components/ui/date-picker';
import { LocaleYearPicker } from '@/components/ui/year-picker';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import type { EquipmentErrorResponse, EquipmentDetails, CustomAttribute } from '@/types/equipment.types';

interface EditEquipmentFormProps {
  equipmentId: string;
  equipmentData: EquipmentDetails;
}

export function EditEquipmentForm({ equipmentId, equipmentData }: EditEquipmentFormProps) {
  const t = useTranslations('equipment-inventory');
  const tShared = useTranslations('shared');
  const router = useRouter();
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  // Convert equipment custom attributes to form format
  const convertCustomAttributes = (attrs: unknown): CustomAttribute[] => {
    if (!attrs || !Array.isArray(attrs)) return [];
    return attrs.map((attr: { name?: string; value?: string | number; unit?: string }) => ({
      key: attr.name || '',
      value: attr.value?.toString() || '',
      unit: attr.unit || '',
    }));
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isDirty },
  } = useForm<EditEquipmentFormData>({
    resolver: zodResolver(editEquipmentSchema),
    defaultValues: {
      name: equipmentData.name,
      categoryId: equipmentData.categoryId,
      description: equipmentData.description || '',
      manufacturer: equipmentData.manufacturer || '',
      model: equipmentData.model || '',
      serialNumber: equipmentData.serialNumber || '',
      yearOfManufacture: equipmentData.yearOfManufacture || undefined,
      purchasePrice: equipmentData.purchasePrice || undefined,
      purchaseDate: equipmentData.purchaseDate || '',
      status: equipmentData.status,
      customAttributes: convertCustomAttributes(equipmentData.customAttributes),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'customAttributes',
  });

  const { mutate, isPending, isSuccess, error: mutationError } = useUpdateEquipment();
  const { data: categoriesData, isLoading: isCategoriesLoading } = useGetCategoriesList({ activeOnly: true });

  const description = watch('description');
  const descriptionLength = description?.length || 0;
  const maxDescriptionLength = 2000;

  useEffect(() => {
    if (isSuccess) {
      router.push(`/equipment-inventory/${equipmentId}`);
    }
  }, [isSuccess, router, equipmentId]);

  const onSubmit = (data: EditEquipmentFormData) => {
    // Filter out empty custom attributes and prepare for API
    const customAttributes = data.customAttributes && data.customAttributes.length > 0
      ? data.customAttributes
          .filter(attr => attr.key && attr.value)
          .map(attr => ({
            key: attr.key,
            value: attr.value,
            unit: attr.unit || undefined,
          }))
      : undefined;

    mutate({
      equipmentId,
      data: {
        ...data,
        customAttributes: customAttributes && customAttributes.length > 0 ? customAttributes : undefined,
      },
    });
  };

  const handleCancel = () => {
    if (isDirty) {
      setShowCancelDialog(true);
    } else {
      router.push(`/equipment-inventory/${equipmentId}`);
    }
  };

  const confirmCancel = () => {
    router.push(`/equipment-inventory/${equipmentId}`);
  };

  const getErrorMessage = (fieldName: keyof EditEquipmentFormData): string | undefined => {
    const fieldError = errors[fieldName];
    if (fieldError?.message) {
      // Strip prefixes from client-side validation (Zod schema)
      let message = fieldError.message;
      if (message.startsWith('error.equipment.')) {
        message = message.substring(16);
      } else if (message.startsWith('error.')) {
        message = message.substring(6);
      } else if (message.startsWith('equipment.validation.')) {
        message = message.substring(21);
      }
      return t(`createEquipment.validation.${message}` as `createEquipment.validation.${string}`);
    }

    if (mutationError instanceof AxiosError && mutationError.response?.data) {
      const errorData = mutationError.response.data as EquipmentErrorResponse;
      if (errorData.details) {
        const fieldDetail = errorData.details.find((detail) => detail.field === fieldName);
        if (fieldDetail?.message) {
          // Strip "error.equipment." or "error." prefix from backend message
          let message = fieldDetail.message;
          if (message.startsWith('error.equipment.')) {
            message = message.substring(16);
          } else if (message.startsWith('error.')) {
            message = message.substring(6);
          }
          return t(`createEquipment.validation.${message}` as `createEquipment.validation.${string}`);
        }
      }
    }

    return undefined;
  };

  const globalError = mutationError instanceof AxiosError
    ? (mutationError.response?.data as EquipmentErrorResponse)?.code
    : null;
  
  // Strip "error." prefix if present (backend format: "error.ERROR_NAME" or "error.equipment.ERROR_NAME")
  let errorCode = globalError;
  if (errorCode && typeof errorCode === 'string') {
    if (errorCode.startsWith('error.equipment.')) {
      errorCode = errorCode.substring(16);
    } else if (errorCode.startsWith('error.')) {
      errorCode = errorCode.substring(6);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Global Error */}
        {errorCode && (
          <Alert variant="destructive">
            <AlertTitle>{tShared('common.errors.title')}</AlertTitle>
            <AlertDescription>{t(`createEquipment.validation.${errorCode}` as `createEquipment.validation.${string}`)}</AlertDescription>
          </Alert>
        )}

        {/* Fallback for errors without code */}
        {mutationError && !globalError && (
          <Alert variant="destructive">
            <AlertTitle>{tShared('common.errors.title')}</AlertTitle>
            <AlertDescription>{tShared('common.errors.unknown')}</AlertDescription>
          </Alert>
        )}

        {/* Basic Information */}
        <div className="space-y-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900">{t('edit.basicInfo')}</h2>

          {/* Equipment Name */}
          <div className="space-y-2">
            <Label htmlFor="name">{t('form.fields.name.label')}</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder={t('form.fields.name.placeholder')}
              className={getErrorMessage('name') ? 'border-red-500 focus:ring-red-500' : ''}
              disabled={isPending}
            />
            {getErrorMessage('name') && (
              <p className="text-sm text-red-600">{getErrorMessage('name')}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="categoryId">{t('form.fields.category.label')}</Label>
            <Select
              value={watch('categoryId')}
              onValueChange={(value) => setValue('categoryId', value, { shouldValidate: true, shouldDirty: true })}
              disabled={isPending || isCategoriesLoading}
            >
              <SelectTrigger
                id="categoryId"
                className={getErrorMessage('categoryId') ? 'border-red-500 focus:ring-red-500' : ''}
              >
                <SelectValue placeholder={t('form.fields.category.placeholder')} />
              </SelectTrigger>
              <SelectContent>
                {categoriesData?.data?.categories && categoriesData.data.categories.length > 0 ? (
                  categoriesData.data.categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))
                ) : (
                  <div className="px-2 py-6 text-sm text-center text-muted-foreground">
                    {t('form.fields.category.noCategories')}
                  </div>
                )}
              </SelectContent>
            </Select>
            {getErrorMessage('categoryId') && (
              <p className="text-sm text-red-600">{getErrorMessage('categoryId')}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">{t('form.fields.description.label')}</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder={t('form.fields.description.placeholder')}
              className={`resize-vertical min-h-[80px] ${
                getErrorMessage('description') ? 'border-red-500 focus:ring-red-500' : ''
              }`}
              disabled={isPending}
              maxLength={maxDescriptionLength}
            />
            <div className="flex justify-between items-center">
              {getErrorMessage('description') && (
                <p className="text-sm text-red-600">{getErrorMessage('description')}</p>
              )}
              <p
                className={`text-xs text-end ${
                  descriptionLength > maxDescriptionLength * 0.9 ? 'text-amber-600' : 'text-gray-500'
                } ms-auto`}
              >
                {descriptionLength} / {maxDescriptionLength} {t('form.charactersRemaining')}
              </p>
            </div>
          </div>
        </div>

        {/* Equipment Details */}
        <div className="space-y-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900">{t('edit.equipmentDetails')}</h2>

          {/* Manufacturer */}
          <div className="space-y-2">
            <Label htmlFor="manufacturer">{t('form.fields.manufacturer.label')}</Label>
            <Input
              id="manufacturer"
              {...register('manufacturer')}
              placeholder={t('form.fields.manufacturer.placeholder')}
              className={getErrorMessage('manufacturer') ? 'border-red-500 focus:ring-red-500' : ''}
              disabled={isPending}
            />
            {getErrorMessage('manufacturer') && (
              <p className="text-sm text-red-600">{getErrorMessage('manufacturer')}</p>
            )}
          </div>

          {/* Model */}
          <div className="space-y-2">
            <Label htmlFor="model">{t('form.fields.model.label')}</Label>
            <Input
              id="model"
              {...register('model')}
              placeholder={t('form.fields.model.placeholder')}
              className={getErrorMessage('model') ? 'border-red-500 focus:ring-red-500' : ''}
              disabled={isPending}
            />
            {getErrorMessage('model') && (
              <p className="text-sm text-red-600">{getErrorMessage('model')}</p>
            )}
          </div>

          {/* Serial Number */}
          <div className="space-y-2">
            <Label htmlFor="serialNumber">{t('form.fields.serialNumber.label')}</Label>
            <Input
              id="serialNumber"
              {...register('serialNumber')}
              placeholder={t('form.fields.serialNumber.placeholder')}
              className={getErrorMessage('serialNumber') ? 'border-red-500 focus:ring-red-500' : ''}
              disabled={isPending}
            />
            {getErrorMessage('serialNumber') && (
              <p className="text-sm text-red-600">{getErrorMessage('serialNumber')}</p>
            )}
          </div>

          {/* Year of Manufacture */}
          <div className="space-y-2">
            <Label htmlFor="yearOfManufacture">{t('form.fields.yearOfManufacture.label')}</Label>
            <Controller
              name="yearOfManufacture"
              control={control}
              render={({ field }) => (
                <LocaleYearPicker
                  id="yearOfManufacture"
                  value={field.value || null}
                  onChange={field.onChange}
                  placeholder={t('form.fields.yearOfManufacture.placeholder')}
                  error={!!getErrorMessage('yearOfManufacture')}
                  disabled={isPending}
                  min={1900}
                  max={getCurrentYear()}
                />
              )}
            />
            {getErrorMessage('yearOfManufacture') && (
              <p className="text-sm text-red-600">{getErrorMessage('yearOfManufacture')}</p>
            )}
          </div>

          {/* Purchase Price */}
          <div className="space-y-2">
            <Label htmlFor="purchasePrice">{t('form.fields.purchasePrice.label')}</Label>
            <Input
              id="purchasePrice"
              type="number"
              step="0.01"
              {...register('purchasePrice', {
                setValueAs: (v) => (v === '' ? undefined : parseFloat(v)),
              })}
              placeholder={t('form.fields.purchasePrice.placeholder')}
              className={getErrorMessage('purchasePrice') ? 'border-red-500 focus:ring-red-500' : ''}
              disabled={isPending}
              min={0}
            />
            {getErrorMessage('purchasePrice') && (
              <p className="text-sm text-red-600">{getErrorMessage('purchasePrice')}</p>
            )}
          </div>

          {/* Purchase Date */}
          <div className="space-y-2">
            <Label htmlFor="purchaseDate">{t('form.fields.purchaseDate.label')}</Label>
            <Controller
              name="purchaseDate"
              control={control}
              render={({ field }) => (
                <LocaleDatePicker
                  id="purchaseDate"
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isPending}
                  max={getTodayForInput()}
                  error={!!getErrorMessage('purchaseDate')}
                />
              )}
            />
            {getErrorMessage('purchaseDate') && (
              <p className="text-sm text-red-600">{getErrorMessage('purchaseDate')}</p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">{t('form.fields.status.label')}</Label>
            <Select
              value={watch('status')}
              onValueChange={(value) => setValue('status', value as EditEquipmentFormData['status'], { shouldValidate: true, shouldDirty: true })}
              disabled={isPending}
            >
              <SelectTrigger
                id="status"
                className={getErrorMessage('status') ? 'border-red-500 focus:ring-red-500' : ''}
              >
                <SelectValue placeholder={t('form.fields.status.placeholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Available">{t('status.available')}</SelectItem>
                <SelectItem value="Rented">{t('status.rented')}</SelectItem>
                <SelectItem value="Maintenance">{t('status.maintenance')}</SelectItem>
                <SelectItem value="Out of Service">{t('status.outOfService')}</SelectItem>
              </SelectContent>
            </Select>
            {getErrorMessage('status') && (
              <p className="text-sm text-red-600">{getErrorMessage('status')}</p>
            )}
          </div>
        </div>

        {/* Custom Attributes */}
        <div className="space-y-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">{t('form.customAttributes.title')}</h2>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => append({ key: '', value: '', unit: '' })}
              disabled={isPending}
            >
              <Plus className="h-4 w-4 me-2" />
              {t('form.customAttributes.addButton')}
            </Button>
          </div>

          {fields.length === 0 ? (
            <p className="text-sm text-gray-500">{t('form.customAttributes.empty')}</p>
          ) : (
            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-3 items-start">
                  <div className="flex-1">
                    <Input
                      {...register(`customAttributes.${index}.key` as const)}
                      placeholder={t('form.customAttributes.keyPlaceholder')}
                      disabled={isPending}
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      {...register(`customAttributes.${index}.value` as const)}
                      placeholder={t('form.customAttributes.valuePlaceholder')}
                      disabled={isPending}
                    />
                  </div>
                  <div className="w-32">
                    <Input
                      {...register(`customAttributes.${index}.unit` as const)}
                      placeholder={t('form.customAttributes.unitPlaceholder')}
                      disabled={isPending}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                    disabled={isPending}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
            disabled={isPending}
          >
            {t('form.buttons.cancel')}
          </Button>
          <Button type="submit" disabled={isPending || !isDirty}>
            {isPending ? tShared('common.loading') : t('form.buttons.update')}
          </Button>
        </div>
      </form>

      {/* Cancel Confirmation Dialog */}
      {showCancelDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {t('edit.cancelDialog.title')}
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              {t('edit.cancelDialog.message')}
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setShowCancelDialog(false)}
              >
                {t('edit.cancelDialog.keepEditing')}
              </Button>
              <Button variant="destructive" onClick={confirmCancel}>
                {t('edit.cancelDialog.discardChanges')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
