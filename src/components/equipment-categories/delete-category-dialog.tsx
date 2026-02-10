'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Trash2, AlertTriangle } from 'lucide-react';
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
import { useDeleteCategory } from '@/hooks/use-delete-category';
import type { Category, EquipmentErrorResponse } from '@/types/equipment.types';

interface DeleteCategoryDialogProps {
  category: Category;
}

export function DeleteCategoryDialog({ category }: DeleteCategoryDialogProps) {
  const t = useTranslations('equipment-category');
  const tShared = useTranslations('shared');
  const [open, setOpen] = useState(false);

  const { mutate, isPending, isSuccess, error: mutationError } = useDeleteCategory();

  const handleDelete = () => {
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
        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
          <Trash2 className="size-4" />
          <span className="sr-only sm:not-sr-only sm:ms-2">{t('categoryArchive.delete.buttonLabel')}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('categoryArchive.delete.title', { categoryName: category.name })}</DialogTitle>
          <DialogDescription>
            {t('categoryArchive.delete.description', { categoryName: category.name })}
          </DialogDescription>
        </DialogHeader>

        <Alert className="bg-amber-50 border-amber-200">
          <AlertTriangle className="size-4 text-amber-700" />
          <AlertDescription className="text-amber-700">
            {t('categoryArchive.delete.warning')}
          </AlertDescription>
        </Alert>

        {isSuccess && (
          <Alert variant="success">
            <AlertDescription>{t('categoryArchive.delete.success')}</AlertDescription>
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
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending || isSuccess}
          >
            {isPending ? tShared('common.status.loading') : t('categoryArchive.delete.confirmButton')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
