'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Pencil, Loader2 } from 'lucide-react';
import { AxiosError } from 'axios';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { updateCategorySchema } from '@/schemas/equipment.schema';
import type { UpdateCategoryFormData } from '@/schemas/equipment.schema';
import { useUpdateCategory } from '@/hooks/use-update-category';
import { useGetCategoriesList } from '@/hooks/use-get-categories-list';
import type {
  Category,
  EquipmentErrorResponse,
} from '@/types/equipment.types';

interface EditCategoryDialogProps {
  category: Category;
}

export function EditCategoryDialog({ category }: EditCategoryDialogProps) {
  const t = useTranslations('equipment-category');
  const [open, setOpen] = useState(false);
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateCategoryFormData>({
    resolver: zodResolver(updateCategorySchema),
    defaultValues: {
      name: category.name,
      description: category.description || '',
      parentId: category.parentId || '',
      isActive: category.isActive,
    },
  });

  const { mutate: updateCategory, isPending, error, isSuccess } = useUpdateCategory();
  const { data: categoriesListData } = useGetCategoriesList({ activeOnly: true });

  const selectedParentId = watch('parentId');
  const selectedStatus = watch('isActive');

  // Track previous open state to detect when dialog actually opens
  const prevOpenRef = useRef(false);

  useEffect(() => {
    if (isSuccess) {
      setOpen(false);
    }
  }, [isSuccess]);

  // Reset form with current category values only when dialog opens (transitions from closed to open)
  useEffect(() => {
    if (open && !prevOpenRef.current) {
      reset({
        name: category.name,
        description: category.description || '',
        parentId: category.parentId || '',
        isActive: category.isActive,
      });
    }
    prevOpenRef.current = open;
  }, [open, category, reset]);

  const onSubmit = (data: UpdateCategoryFormData) => {
    // Explicitly handle empty strings - convert to null for API
    const descriptionValue = data.description?.trim();
    const payload = {
      name: data.name,
      description: descriptionValue === '' || descriptionValue === undefined ? null : descriptionValue,
      parentId: data.parentId === '' ? null : data.parentId || null,
      isActive: data.isActive,
    };

    updateCategory({
      categoryId: category.id,
      data: payload,
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && isDirty && !isSuccess) {
      setShowUnsavedWarning(true);
      return;
    }
    setOpen(newOpen);
    if (!newOpen) {
      reset();
      setShowUnsavedWarning(false);
    }
  };

  const handleDiscardChanges = () => {
    setShowUnsavedWarning(false);
    setOpen(false);
    reset();
  };

  const getErrorMessage = (
    fieldName: keyof UpdateCategoryFormData
  ): string | undefined => {
    if (errors[fieldName]?.message) {
      return t(errors[fieldName]!.message as string);
    }

    if (error instanceof AxiosError && error.response?.data?.details) {
      const fieldError = error.response.data.details.find(
        (detail) => detail.field === fieldName
      );
      if (fieldError) {
        return t(`validation.${fieldError.message}`);
      }
    }

    return undefined;
  };

  const globalError =
    error instanceof AxiosError
      ? (error.response?.data as EquipmentErrorResponse)?.code
      : null;
  
  // Strip "error." prefix if present (backend format: "error.ERROR_NAME")
  const errorCode = globalError && typeof globalError === 'string' && globalError.startsWith('error.')
    ? globalError.substring(6)
    : globalError;

  // Filter out current category and its descendants from parent options
  const availableParentCategories = categoriesListData?.data?.categories?.filter(
    (cat) => cat.id !== category.id && cat.parentId !== category.id
  ) || [];

  const descriptionLength = watch('description')?.length || 0;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          title={t('actions.edit')}
        >
          <Pencil className="size-4 text-blue-600" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        {showUnsavedWarning ? (
          <>
            <DialogHeader>
              <DialogTitle>{t('cancelDialog.title')}</DialogTitle>
              <DialogDescription>
                {t('cancelDialog.description')}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setShowUnsavedWarning(false)}
              >
                {t('cancelDialog.back')}
              </Button>
              <Button variant="destructive" onClick={handleDiscardChanges}>
                {t('cancelDialog.confirm')}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{t('editCategory.title')}</DialogTitle>
              <DialogDescription>
                {t('editCategory.description')}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {errorCode && (
                <Alert variant="destructive">
                  <AlertTitle>{t('validation.error')}</AlertTitle>
                  <AlertDescription>
                    {t(`validation.${errorCode}`)}
                  </AlertDescription>
                </Alert>
              )}

              {error && !globalError && (
                <Alert variant="destructive">
                  <AlertTitle>{t('validation.error')}</AlertTitle>
                  <AlertDescription>
                    {t('validation.updateCategoryFailed')}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  {t('form.fields.name.label')}
                  <span className="text-red-500 ms-1">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder={t('form.fields.name.placeholder')}
                  {...register('name')}
                  disabled={isPending}
                  className={
                    getErrorMessage('name')
                      ? 'border-red-500 focus:ring-red-500'
                      : ''
                  }
                />
                {getErrorMessage('name') && (
                  <p className="text-sm text-red-600 mt-1">
                    {getErrorMessage('name')}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  {t('form.fields.description.label')}
                </Label>
                <Textarea
                  id="description"
                  placeholder={t('form.fields.description.placeholder')}
                  value={watch('description') ?? ''}
                  onChange={(e) => setValue('description', e.target.value, { shouldDirty: true })}
                  disabled={isPending}
                  className={
                    getErrorMessage('description')
                      ? 'border-red-500 focus:ring-red-500'
                      : ''
                  }
                  rows={3}
                />
                <div className="flex justify-between items-center">
                  {getErrorMessage('description') && (
                    <p className="text-sm text-red-600">
                      {getErrorMessage('description')}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 text-end ms-auto">
                    {descriptionLength}/500
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="parentId" className="text-sm font-medium">
                  {t('form.fields.parentCategory.label')}
                </Label>
                <Select
                  value={selectedParentId || 'none'}
                  onValueChange={(value) => setValue('parentId', value === 'none' ? '' : value, { shouldDirty: true })}
                  disabled={isPending}
                >
                  <SelectTrigger
                    id="parentId"
                    className={
                      getErrorMessage('parentId')
                        ? 'border-red-500 focus:ring-red-500'
                        : ''
                    }
                  >
                    <SelectValue
                      placeholder={t('form.fields.parentCategory.placeholder')}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">
                      {t('form.fields.parentCategory.topLevel')}
                    </SelectItem>
                    {availableParentCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {getErrorMessage('parentId') && (
                  <p className="text-sm text-red-600 mt-1">
                    {getErrorMessage('parentId')}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="isActive" className="text-sm font-medium">
                  {t('form.fields.status.label')}
                  <span className="text-red-500 ms-1">*</span>
                </Label>
                <Select
                  value={selectedStatus ? 'active' : 'inactive'}
                  onValueChange={(value) =>
                    setValue('isActive', value === 'active', { shouldDirty: true })
                  }
                  disabled={isPending}
                >
                  <SelectTrigger id="isActive">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">
                      {t('form.fields.status.active')}
                    </SelectItem>
                    <SelectItem value="inactive">
                      {t('form.fields.status.inactive')}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter className="flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => handleOpenChange(false)}
                  disabled={isPending}
                >
                  {t('form.buttons.cancel')}
                </Button>
                <Button type="submit" disabled={isPending || !isDirty}>
                  {isPending && <Loader2 className="size-4 me-2 animate-spin" />}
                  {t('form.buttons.save')}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
