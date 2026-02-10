'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { createCategorySchema, type CreateCategoryFormData } from '@/schemas/equipment.schema';
import { useCreateCategory } from '@/hooks/use-create-category';
import { useGetCategoriesList } from '@/hooks/use-get-categories-list';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { EquipmentErrorResponse } from '@/types/equipment.types';

export function CreateCategoryForm() {
  const t = useTranslations('equipment-category');
  const tShared = useTranslations('shared');
  const router = useRouter();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [formTouched, setFormTouched] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateCategoryFormData>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: '',
      description: '',
      parentId: '',
      isActive: true,
    },
  });

  const { mutate: createCategory, isPending, isSuccess, error: mutationError } = useCreateCategory();
  const { data: categoriesData, isLoading: isLoadingCategories } = useGetCategoriesList({ activeOnly: true });

  const formValues = watch();

  // Track if form has been modified
  useEffect(() => {
    if (formValues.name || formValues.description || formValues.parentId) {
      setFormTouched(true);
    }
  }, [formValues]);

  // Redirect after successful creation
  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        router.push('/equipment-categories');
      }, 2000);
    }
  }, [isSuccess, router]);

  const onSubmit = (data: CreateCategoryFormData) => {
    const payload = {
      name: data.name,
      description: data.description || undefined,
      parentId: data.parentId || undefined,
      isActive: data.isActive,
    };

    createCategory(payload);
  };

  const handleCancel = () => {
    if (formTouched) {
      setShowCancelDialog(true);
    } else {
      router.push('/equipment-categories');
    }
  };

  const confirmCancel = () => {
    setShowCancelDialog(false);
    router.push('/equipment-categories');
  };

  // Extract error message helper
  const getErrorMessage = (fieldName: keyof CreateCategoryFormData): string | undefined => {
    // 1. Check form validation errors
    if (errors[fieldName]?.message) {
      return t(errors[fieldName]!.message as string);
    }

    // 2. Check API validation errors
    if (mutationError instanceof AxiosError) {
      const errorResponse = mutationError.response?.data as EquipmentErrorResponse;
      const fieldError = errorResponse?.details?.find((detail) => detail.field === fieldName);
      if (fieldError) {
        return t(`validation.${fieldError.code}`);
      }
    }

    return undefined;
  };

  // Global error extraction
  const globalError = mutationError instanceof AxiosError
    ? (mutationError.response?.data as EquipmentErrorResponse)?.code
    : null;
  
  // Strip "error." prefix if present (backend format: "error.ERROR_NAME")
  const errorCode = globalError && typeof globalError === 'string' && globalError.startsWith('error.')
    ? globalError.substring(6)
    : globalError;

  const descriptionValue = watch('description') || '';
  const descriptionLength = descriptionValue.length;

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Global Success Message */}
        {isSuccess && (
          <Alert variant="success">
            <AlertDescription>
              {t('success.categoryCreated')}
              <br />
              <span className="text-sm">{t('success.redirecting')}</span>
            </AlertDescription>
          </Alert>
        )}

        {/* Global Error Message */}
        {errorCode && (
          <Alert variant="destructive">
            <AlertDescription>{t(`validation.${errorCode}`)}</AlertDescription>
          </Alert>
        )}

        {/* Fallback for errors without code */}
        {mutationError && !globalError && (
          <Alert variant="destructive">
            <AlertDescription>{tShared('common.errors.unknown')}</AlertDescription>
          </Alert>
        )}

        {/* Category Name */}
        <div className="space-y-2">
          <Label htmlFor="name">{t('form.fields.name.label')}</Label>
          <Input
            id="name"
            type="text"
            placeholder={t('form.fields.name.placeholder')}
            className={getErrorMessage('name') ? 'border-red-500' : ''}
            disabled={isPending || isSuccess}
            {...register('name')}
          />
          {getErrorMessage('name') && (
            <p className="text-sm text-red-600">{getErrorMessage('name')}</p>
          )}
          <p className="text-xs text-gray-500">{t('form.helpers.nameHelp')}</p>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">{t('form.fields.description.label')}</Label>
          <Textarea
            id="description"
            placeholder={t('form.fields.description.placeholder')}
            className={getErrorMessage('description') ? 'border-red-500' : ''}
            disabled={isPending || isSuccess}
            {...register('description')}
          />
          {getErrorMessage('description') && (
            <p className="text-sm text-red-600">{getErrorMessage('description')}</p>
          )}
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">{t('form.helpers.descriptionHelp')}</p>
            <p className="text-xs text-gray-500">{descriptionLength}/500</p>
          </div>
        </div>

        {/* Parent Category */}
        <div className="space-y-2">
          <Label htmlFor="parentId">{t('form.fields.parentId.label')}</Label>
          <Select
            value={watch('parentId') || 'none'}
            onValueChange={(value) => setValue('parentId', value === 'none' ? '' : value)}
            disabled={isPending || isSuccess || isLoadingCategories}
          >
            <SelectTrigger className={getErrorMessage('parentId') ? 'border-red-500' : ''}>
              <SelectValue placeholder={t('form.fields.parentId.placeholder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">{t('form.fields.parentId.none')}</SelectItem>
              {categoriesData?.data?.categories?.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                  {category.level > 1 && ` (${t('level')} ${category.level})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {getErrorMessage('parentId') && (
            <p className="text-sm text-red-600">{getErrorMessage('parentId')}</p>
          )}
          <p className="text-xs text-gray-500">{t('form.helpers.parentHelp')}</p>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label>{t('form.fields.status.label')}</Label>
          <RadioGroup
            value={watch('isActive') ? 'true' : 'false'}
            onValueChange={(value) => setValue('isActive', value === 'true')}
            disabled={isPending || isSuccess}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="active" />
              <Label htmlFor="active" className="font-normal cursor-pointer">
                {t('form.fields.status.active')}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="inactive" />
              <Label htmlFor="inactive" className="font-normal cursor-pointer">
                {t('form.fields.status.inactive')}
              </Label>
            </div>
          </RadioGroup>
          <p className="text-xs text-gray-500">{t('form.helpers.statusHelp')}</p>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
            disabled={isPending || isSuccess}
          >
            {t('form.buttons.cancel')}
          </Button>
          <Button type="submit" disabled={isPending || isSuccess}>
            {isPending ? t('form.buttons.submitting') : t('form.buttons.submit')}
          </Button>
        </div>
      </form>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('dialog.cancel.title')}</DialogTitle>
            <DialogDescription>{t('dialog.cancel.description')}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowCancelDialog(false)}>
              {t('dialog.cancel.back')}
            </Button>
            <Button variant="destructive" onClick={confirmCancel}>
              {t('dialog.cancel.confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
