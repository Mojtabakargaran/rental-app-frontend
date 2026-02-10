'use client';

import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import { Plus, X } from 'lucide-react';
import { getCurrentYear, getTodayForInput } from '@/utils/date.util';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LocaleDatePicker } from '@/components/ui/date-picker';
import { LocaleYearPicker } from '@/components/ui/year-picker';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCreateEquipment } from '@/hooks/use-create-equipment';
import { useGetCategoriesList } from '@/hooks/use-get-categories-list';
import {
  createEquipmentSchema,
  type CreateEquipmentFormData,
} from '@/schemas/create-equipment.schema';
import type {
  CreateEquipmentRequest,
  EquipmentErrorResponse,
  EquipmentStatus,
} from '@/types/equipment.types';
import { cn } from '@/lib/utils';

export function CreateEquipmentForm() {
  const t = useTranslations('equipment-inventory.createEquipment');
  const tShared = useTranslations('shared');
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  // Fetch categories for dropdown
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useGetCategoriesList({ activeOnly: true });

  const { mutate: createEquipment, isPending, isSuccess, error } = useCreateEquipment();

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<CreateEquipmentFormData>({
    resolver: zodResolver(createEquipmentSchema),
    defaultValues: {
      name: '',
      categoryId: '',
      description: '',
      manufacturer: '',
      model: '',
      serialNumber: '',
      yearOfManufacture: 0,
      purchasePrice: 0,
      purchaseDate: '',
      status: 'Available',
      customAttributes: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'customAttributes',
  });

  // Track user interaction
  useEffect(() => {
    const subscription = watch(() => {
      setHasUserInteracted(true);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = (data: CreateEquipmentFormData) => {
    // Transform data for API
    const requestData: CreateEquipmentRequest = {
      name: data.name,
      categoryId: data.categoryId,
      description: data.description || undefined,
      manufacturer: data.manufacturer || undefined,
      model: data.model || undefined,
      serialNumber: data.serialNumber || undefined,
      yearOfManufacture: data.yearOfManufacture || undefined,
      purchasePrice: data.purchasePrice || undefined,
      purchaseDate: data.purchaseDate || undefined,
      status: data.status,
      customAttributes:
        data.customAttributes && data.customAttributes.length > 0
          ? data.customAttributes
          : undefined,
    };

    createEquipment(requestData, {
      onSuccess: () => {
        // Redirect will happen after success message display
      },
    });
  };

  // Handle successful creation
  useEffect(() => {
    if (isSuccess) {
      // Invalidate equipment queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
      
      const timer = setTimeout(() => {
        router.push('/equipment-inventory'); // Redirect to equipment list
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, router, queryClient]);

  const handleCancel = () => {
    if (hasUserInteracted) {
      setShowCancelDialog(true);
    } else {
      router.back();
    }
  };

  const confirmCancel = () => {
    setShowCancelDialog(false);
    router.back();
  };

  // Helper to get error message for a field
  const getErrorMessage = (fieldName: keyof CreateEquipmentFormData): string | undefined => {
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
      return t(`validation.${message}` as `validation.${string}`);
    }

    // Check for backend validation errors
    if (error instanceof AxiosError && error.response?.data) {
      const errorResponse = error.response.data as EquipmentErrorResponse;
      if (errorResponse.code === 'VALIDATION_FAILED' && errorResponse.details) {
        const detail = errorResponse.details.find((d) => d.field === fieldName);
        if (detail) {
          // Strip "error.equipment." or "error." prefix from backend message
          let message = detail.message;
          if (message.startsWith('error.equipment.')) {
            message = message.substring(16);
          } else if (message.startsWith('error.')) {
            message = message.substring(6);
          }
          return t(`validation.${message}` as `validation.${string}`);
        }
      }
    }

    return undefined;
  };

  // Global error extraction
  const globalError =
    error instanceof AxiosError && error.response?.data
      ? (error.response.data as EquipmentErrorResponse).code
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

  // Equipment status options
  const statusOptions: EquipmentStatus[] = ['Available', 'Rented', 'Maintenance', 'Out of Service'];

  return (
    <div className="space-y-8">
      {/* Success Alert */}
      {isSuccess && (
        <Alert variant="success">
          <AlertTitle>{t('success.created')}</AlertTitle>
          <AlertDescription>{t('success.redirecting')}</AlertDescription>
        </Alert>
      )}

      {/* Global Error Alert */}
      {errorCode && (
        <Alert variant="destructive">
          <AlertTitle>{tShared('common.errors.title')}</AlertTitle>
          <AlertDescription>{t(`validation.${errorCode}` as `validation.${string}`)}</AlertDescription>
        </Alert>
      )}

      {/* Fallback for errors without code */}
      {error && !globalError && (
        <Alert variant="destructive">
          <AlertTitle>{tShared('common.errors.title')}</AlertTitle>
          <AlertDescription>{tShared('common.errors.unknown')}</AlertDescription>
        </Alert>
      )}

      {/* Categories Loading Error */}
      {categoriesError && (
        <Alert variant="destructive">
          <AlertTitle>{tShared('common.errors.title')}</AlertTitle>
          <AlertDescription>{t('errors.loadCategoriesFailed')}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information Section */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {t('form.sections.basic.title')}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {t('form.sections.basic.description')}
            </p>
          </div>

          {/* Equipment Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              {t('form.fields.name.label')} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              {...register('name')}
              placeholder={t('form.fields.name.placeholder')}
              className={cn(errors.name && 'border-red-500 focus:ring-red-500')}
              disabled={isPending}
            />
            {getErrorMessage('name') && (
              <p className="text-sm text-red-600">{getErrorMessage('name')}</p>
            )}
            <p className="text-sm text-gray-500">{t('form.helpers.nameHelp')}</p>
          </div>

          {/* Equipment Category */}
          <div className="space-y-2">
            <Label htmlFor="categoryId">
              {t('form.fields.category.label')} <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isPending || categoriesLoading}
                >
                  <SelectTrigger
                    className={cn(errors.categoryId && 'border-red-500 focus:ring-red-500')}
                  >
                    <SelectValue
                      placeholder={
                        categoriesLoading
                          ? t('form.fields.category.loading')
                          : t('form.fields.category.placeholder')
                      }
                    />
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
              )}
            />
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
              className={cn(
                'resize-vertical min-h-[80px]',
                errors.description && 'border-red-500 focus:ring-red-500'
              )}
              disabled={isPending}
              maxLength={2000}
            />
            {getErrorMessage('description') && (
              <p className="text-sm text-red-600">{getErrorMessage('description')}</p>
            )}
            <p className="text-sm text-gray-500">{t('form.helpers.descriptionHelp')}</p>
          </div>
        </div>

        {/* Specifications Section */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {t('form.sections.specifications.title')}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {t('form.sections.specifications.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Manufacturer */}
            <div className="space-y-2">
              <Label htmlFor="manufacturer">{t('form.fields.manufacturer.label')}</Label>
              <Input
                id="manufacturer"
                {...register('manufacturer')}
                placeholder={t('form.fields.manufacturer.placeholder')}
                className={cn(errors.manufacturer && 'border-red-500 focus:ring-red-500')}
                disabled={isPending}
                maxLength={100}
              />
              {getErrorMessage('manufacturer') && (
                <p className="text-sm text-red-600">{getErrorMessage('manufacturer')}</p>
              )}
              <p className="text-sm text-gray-500">{t('form.helpers.manufacturerHelp')}</p>
            </div>

            {/* Model */}
            <div className="space-y-2">
              <Label htmlFor="model">{t('form.fields.model.label')}</Label>
              <Input
                id="model"
                {...register('model')}
                placeholder={t('form.fields.model.placeholder')}
                className={cn(errors.model && 'border-red-500 focus:ring-red-500')}
                disabled={isPending}
                maxLength={100}
              />
              {getErrorMessage('model') && (
                <p className="text-sm text-red-600">{getErrorMessage('model')}</p>
              )}
              <p className="text-sm text-gray-500">{t('form.helpers.modelHelp')}</p>
            </div>

            {/* Serial Number */}
            <div className="space-y-2">
              <Label htmlFor="serialNumber">{t('form.fields.serialNumber.label')}</Label>
              <Input
                id="serialNumber"
                {...register('serialNumber')}
                placeholder={t('form.fields.serialNumber.placeholder')}
                className={cn(errors.serialNumber && 'border-red-500 focus:ring-red-500')}
                disabled={isPending}
                maxLength={100}
              />
              {getErrorMessage('serialNumber') && (
                <p className="text-sm text-red-600">{getErrorMessage('serialNumber')}</p>
              )}
              <p className="text-sm text-gray-500">{t('form.helpers.serialNumberHelp')}</p>
            </div>

            {/* Year of Manufacture */}
            <div className="space-y-2">
              <Label htmlFor="yearOfManufacture">
                {t('form.fields.yearOfManufacture.label')}
              </Label>
              <Controller
                name="yearOfManufacture"
                control={control}
                render={({ field }) => (
                  <LocaleYearPicker
                    id="yearOfManufacture"
                    value={field.value || null}
                    onChange={field.onChange}
                    placeholder={t('form.fields.yearOfManufacture.placeholder')}
                    error={!!errors.yearOfManufacture}
                    disabled={isPending}
                    min={1900}
                    max={getCurrentYear()}
                  />
                )}
              />
              {getErrorMessage('yearOfManufacture') && (
                <p className="text-sm text-red-600">{getErrorMessage('yearOfManufacture')}</p>
              )}
              <p className="text-sm text-gray-500">{t('form.helpers.yearHelp')}</p>
            </div>
          </div>
        </div>

        {/* Financial Details Section */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {t('form.sections.financial.title')}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {t('form.sections.financial.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Purchase Price */}
            <div className="space-y-2">
              <Label htmlFor="purchasePrice">{t('form.fields.purchasePrice.label')}</Label>
              <Input
                id="purchasePrice"
                type="number"
                {...register('purchasePrice', { valueAsNumber: true })}
                placeholder={t('form.fields.purchasePrice.placeholder')}
                className={cn(errors.purchasePrice && 'border-red-500 focus:ring-red-500')}
                disabled={isPending}
                min={0}
                step="0.01"
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
                    placeholder={t('form.fields.purchaseDate.placeholder')}
                    disabled={isPending}
                    max={getTodayForInput()}
                    error={!!errors.purchaseDate}
                  />
                )}
              />
              {getErrorMessage('purchaseDate') && (
                <p className="text-sm text-red-600">{getErrorMessage('purchaseDate')}</p>
              )}
              <p className="text-sm text-gray-500">{t('form.helpers.purchaseDateHelp')}</p>
            </div>
          </div>
        </div>

        {/* Status Section */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {t('form.sections.status.title')}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {t('form.sections.status.description')}
            </p>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">
              {t('form.fields.status.label')} <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value} disabled={isPending}>
                  <SelectTrigger
                    className={cn(errors.status && 'border-red-500 focus:ring-red-500')}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {t(`form.fields.status.options.${status}` as `form.fields.status.options.${string}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {getErrorMessage('status') && (
              <p className="text-sm text-red-600">{getErrorMessage('status')}</p>
            )}
          </div>
        </div>

        {/* Custom Attributes Section */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {t('form.sections.custom.title')}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {t('form.sections.custom.description')}
            </p>
          </div>

          <div className="space-y-3">
            {fields.length === 0 && (
              <p className="text-sm text-gray-500">{t('form.fields.customAttributes.empty')}</p>
            )}

            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-3 items-start">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Input
                    {...register(`customAttributes.${index}.key`)}
                    placeholder={t('form.fields.customAttributes.keyPlaceholder')}
                    className={cn(
                      errors.customAttributes?.[index]?.key && 'border-red-500 focus:ring-red-500'
                    )}
                    disabled={isPending}
                  />
                  <Input
                    {...register(`customAttributes.${index}.value`)}
                    placeholder={t('form.fields.customAttributes.valuePlaceholder')}
                    className={cn(
                      errors.customAttributes?.[index]?.value &&
                        'border-red-500 focus:ring-red-500'
                    )}
                    disabled={isPending}
                  />
                  <Input
                    {...register(`customAttributes.${index}.unit`)}
                    placeholder={t('form.fields.customAttributes.unitPlaceholder')}
                    className={cn(
                      errors.customAttributes?.[index]?.unit && 'border-red-500 focus:ring-red-500'
                    )}
                    disabled={isPending}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  disabled={isPending}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <Button
              type="button"
              variant="secondary"
              onClick={() => append({ key: '', value: '', unit: '' })}
              disabled={isPending}
              className="w-full md:w-auto"
            >
              <Plus className="h-4 w-4 me-2" />
              {t('form.fields.customAttributes.addButton')}
            </Button>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button type="button" variant="secondary" onClick={handleCancel} disabled={isPending}>
            {t('form.buttons.cancel')}
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? t('form.buttons.submitting') : t('form.buttons.submit')}
          </Button>
        </div>
      </form>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('cancelDialog.title')}</DialogTitle>
            <DialogDescription>
              {t('cancelDialog.description')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowCancelDialog(false)}>
              {t('cancelDialog.back')}
            </Button>
            <Button variant="destructive" onClick={confirmCancel}>
              {t('cancelDialog.confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
