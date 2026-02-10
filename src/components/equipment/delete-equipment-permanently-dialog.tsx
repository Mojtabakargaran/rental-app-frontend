'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { AxiosError } from 'axios';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { usePermanentDeleteEquipment } from '@/hooks/use-delete-equipment';
import {
  permanentDeleteEquipmentSchema,
  type PermanentDeleteEquipmentFormData,
} from '@/schemas/delete-equipment.schema';
import type { EquipmentErrorResponse } from '@/types/equipment.types';

interface DeleteEquipmentPermanentlyDialogProps {
  equipmentId: string;
  equipmentName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function DeleteEquipmentPermanentlyDialog({
  equipmentId,
  equipmentName,
  open,
  onOpenChange,
  onSuccess,
}: DeleteEquipmentPermanentlyDialogProps) {
  const t = useTranslations('equipment-inventory');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutate, error: mutationError } = usePermanentDeleteEquipment(equipmentId);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PermanentDeleteEquipmentFormData>({
    resolver: zodResolver(permanentDeleteEquipmentSchema),
    defaultValues: {
      confirmation: '',
    },
  });

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const onSubmit = (data: PermanentDeleteEquipmentFormData) => {
    setIsSubmitting(true);
    mutate(data, {
      onSuccess: () => {
        setIsSubmitting(false);
        handleClose();
        onSuccess();
      },
      onError: () => {
        setIsSubmitting(false);
      },
    });
  };

  const globalError =
    mutationError instanceof AxiosError
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
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-red-600">
            {t('archive.permanent.title')}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            {t('archive.permanent.description')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Warning */}
          <Alert variant="destructive">
            <p className="font-semibold">{t('archive.permanent.warning')}</p>
          </Alert>

          {/* Equipment Name Display */}
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">
              {t('archive.permanent.equipmentLabel')}
            </p>
            <p className="font-semibold text-gray-900">{equipmentName}</p>
          </div>

          {/* Confirmation Input */}
          <div className="space-y-2">
            <Label htmlFor="confirmation" className="text-sm font-medium text-gray-700">
              {t('archive.permanent.confirmation')}{' '}
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="confirmation"
              {...register('confirmation')}
              placeholder={t('archive.permanent.confirmationPlaceholder')}
              className={errors.confirmation ? 'border-red-500' : ''}
              autoComplete="off"
            />
            {errors.confirmation && (
              <p className="text-sm text-red-600">
                {(() => {
                  let message = errors.confirmation.message!;
                  if (message.startsWith('error.equipment.')) {
                    message = message.substring(16);
                  } else if (message.startsWith('error.')) {
                    message = message.substring(6);
                  } else if (message.startsWith('equipment.validation.')) {
                    message = message.substring(21);
                  }
                  return t(`createEquipment.validation.${message}`);
                })()}
              </p>
            )}
          </div>

          {/* Global Error */}
          {errorCode && (
            <Alert variant="destructive">
              {t(`createEquipment.validation.${errorCode}`)}
            </Alert>
          )}

          {/* Fallback for errors without code */}
          {mutationError && !globalError && (
            <Alert variant="destructive">
              {t('createEquipment.validation.INTERNAL_SERVER_ERROR')}
            </Alert>
          )}

          <DialogFooter className="gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              {t('archive.permanent.cancelButton')}
            </Button>
            <Button type="submit" variant="destructive" disabled={isSubmitting}>
              {isSubmitting
                ? t('shared.common.loading')
                : t('archive.permanent.confirmButton')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
