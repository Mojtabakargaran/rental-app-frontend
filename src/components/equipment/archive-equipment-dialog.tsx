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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { useSoftDeleteEquipment } from '@/hooks/use-delete-equipment';
import {
  softDeleteEquipmentSchema,
  type SoftDeleteEquipmentFormData,
} from '@/schemas/delete-equipment.schema';
import type { EquipmentErrorResponse } from '@/types/equipment.types';

interface ArchiveEquipmentDialogProps {
  equipmentId: string;
  equipmentName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ArchiveEquipmentDialog({
  equipmentId,
  equipmentName,
  open,
  onOpenChange,
  onSuccess,
}: ArchiveEquipmentDialogProps) {
  const t = useTranslations('equipment-inventory');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutate, error: mutationError } = useSoftDeleteEquipment(equipmentId);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<SoftDeleteEquipmentFormData>({
    resolver: zodResolver(softDeleteEquipmentSchema),
    defaultValues: {
      reason: null,
    },
  });

  const reasonValue = watch('reason') || '';

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const onSubmit = (data: SoftDeleteEquipmentFormData) => {
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
          <DialogTitle>{t('archive.soft.title')}</DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            {t('archive.soft.description')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Warning */}
          <Alert variant="destructive">
            <p className="font-semibold">{t('archive.soft.warning')}</p>
          </Alert>

          {/* Equipment Name Display */}
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">
              {t('archive.soft.equipmentLabel')}
            </p>
            <p className="font-semibold text-gray-900">{equipmentName}</p>
          </div>

          {/* Reason (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="reason" className="text-sm font-medium text-gray-700">
              {t('archive.soft.reason')}
            </Label>
            <Textarea
              id="reason"
              {...register('reason')}
              placeholder={t('archive.soft.reasonPlaceholder')}
              className={`min-h-[80px] resize-vertical ${
                errors.reason ? 'border-red-500' : ''
              }`}
              maxLength={500}
            />
            <div className="flex justify-end items-center">
              {errors.reason && (
                <p className="text-sm text-red-600">
                  {(() => {
                    let message = errors.reason.message!;
                    if (message.startsWith('error.equipment.')) {
                      message = message.substring(16);
                    } else if (message.startsWith('error.')) {
                      message = message.substring(6);
                    } else if (message.startsWith('equipment.validation.')) {
                      message = message.substring(21);
                    }
                    return t(`validation.${message}`);
                  })()}
                </p>
              )}
              <p className="text-xs text-gray-500 text-end ms-auto">
                {reasonValue.length}/500
              </p>
            </div>
          </div>

          {/* Global Error */}
          {errorCode && (
            <Alert variant="destructive">
              {t(`validation.${errorCode}`)}
            </Alert>
          )}

          {/* Fallback for errors without code */}
          {mutationError && !globalError && (
            <Alert variant="destructive">
              {t('validation.INTERNAL_SERVER_ERROR')}
            </Alert>
          )}

          <DialogFooter className="gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              {t('archive.soft.cancelButton')}
            </Button>
            <Button type="submit" variant="destructive" disabled={isSubmitting}>
              {isSubmitting
                ? t('shared.common.loading')
                : t('archive.soft.confirmButton')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
