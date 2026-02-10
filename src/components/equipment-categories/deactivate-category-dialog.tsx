'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2 } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useDeactivateCategory } from '@/hooks/use-deactivate-category';
import { deactivateCategorySchema, type DeactivateCategoryFormData } from '@/schemas/archive-category.schema';
import type { Category, EquipmentErrorResponse } from '@/types/equipment.types';

interface DeactivateCategoryDialogProps {
  category: Category;
}

export function DeactivateCategoryDialog({ category }: DeactivateCategoryDialogProps) {
  const t = useTranslations('equipment-category');
  const tShared = useTranslations('shared');
  const [open, setOpen] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<DeactivateCategoryFormData>({
    resolver: zodResolver(deactivateCategorySchema),
    defaultValues: { reason: '' },
  });

  const { mutate, isPending, isSuccess, error: mutationError } = useDeactivateCategory();

  const reason = watch('reason');
  
  // Update character count when reason changes
  if (reason && reason.length !== characterCount) {
    setCharacterCount(reason.length);
  }

  const onSubmit = (data: DeactivateCategoryFormData) => {
    mutate(
      { categoryId: category.id, data },
      {
        onSuccess: () => {
          reset();
          setTimeout(() => {
            setOpen(false);
          }, 1500);
        },
      }
    );
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !isPending) {
      reset();
      setCharacterCount(0);
    }
    setOpen(newOpen);
  };

  // Extract error code
  const globalError = mutationError instanceof AxiosError
    ? (mutationError.response?.data as EquipmentErrorResponse)?.code
    : null;
  
  // Strip "error." prefix if present (backend format: "error.ERROR_NAME")
  const errorCode = globalError && typeof globalError === 'string' && globalError.startsWith('error.')
    ? globalError.substring(6)
    : globalError;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
          <Trash2 className="size-4" />
          <span className="sr-only sm:not-sr-only sm:ms-2">{t('categoryArchive.deactivate.buttonLabel')}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {t('categoryArchive.deactivate.title', { categoryName: category.name })}
          </DialogTitle>
          <DialogDescription>
            {t('categoryArchive.deactivate.description')}
          </DialogDescription>
        </DialogHeader>

        {isSuccess && (
          <Alert variant="success">
            <AlertDescription>{t('categoryArchive.deactivate.success')}</AlertDescription>
          </Alert>
        )}

        {errorCode && (
          <Alert variant="destructive">
            <AlertDescription>{t(`validation.${errorCode}`)}</AlertDescription>
          </Alert>
        )}

        {mutationError && !globalError && (
          <Alert variant="destructive">
            <AlertDescription>{tShared('errors.unknown')}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reason">{t('categoryArchive.deactivate.reasonLabel')}</Label>
            <Textarea
              id="reason"
              {...register('reason')}
              placeholder={t('categoryArchive.deactivate.reasonPlaceholder')}
              className="resize-vertical min-h-[80px]"
              disabled={isPending || isSuccess}
            />
            <div className="flex justify-between items-center">
              {errors.reason && (
                <p className="text-sm text-red-600">{t(errors.reason.message!)}</p>
              )}
              <p className="text-xs text-gray-500 text-end ms-auto">
                {characterCount}/500
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isPending || isSuccess}
            >
              {tShared('common.cancel')}
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={isPending || isSuccess}
            >
              {isPending ? tShared('common.loading') : t('categoryArchive.deactivate.confirmButton')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
