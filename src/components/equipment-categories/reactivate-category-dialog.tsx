'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { RotateCcw } from 'lucide-react';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useReactivateCategory } from '@/hooks/use-reactivate-category';
import type { Category, EquipmentErrorResponse } from '@/types/equipment.types';

interface ReactivateCategoryDialogProps {
  category: Category;
}

export function ReactivateCategoryDialog({ category }: ReactivateCategoryDialogProps) {
  const t = useTranslations('equipment-category');
  const tShared = useTranslations('shared');
  const [open, setOpen] = useState(false);

  const { mutate, isPending, isSuccess, error: mutationError } = useReactivateCategory();

  const handleReactivate = () => {
    mutate(category.id, {
      onSuccess: () => {
        setTimeout(() => {
          setOpen(false);
        }, 1500);
      },
    });
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
          <RotateCcw className="size-4" />
          <span className="sr-only sm:not-sr-only sm:ms-2">{t('categoryArchive.reactivate.buttonLabel')}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('categoryArchive.reactivate.title', { categoryName: category.name })}</DialogTitle>
          <DialogDescription>
            {t('categoryArchive.reactivate.description')}
          </DialogDescription>
        </DialogHeader>

        {isSuccess && (
          <Alert variant="success">
            <AlertDescription>{t('categoryArchive.reactivate.success')}</AlertDescription>
          </Alert>
        )}

        {errorCode && (
          <Alert variant="destructive">
            <AlertDescription>{t(`validation.${errorCode}`)}</AlertDescription>
          </Alert>
        )}

        {mutationError && !globalError && (
          <Alert variant="destructive">
            <AlertDescription>{tShared('common.errors.unknown')}</AlertDescription>
          </Alert>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending || isSuccess}
          >
            {tShared('common.cancel')}
          </Button>
          <Button
            type="button"
            onClick={handleReactivate}
            disabled={isPending || isSuccess}
          >
            {isPending ? tShared('common.status.loading') : t('categoryArchive.reactivate.confirmButton')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
