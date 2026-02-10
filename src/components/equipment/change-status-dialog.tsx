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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useUpdateEquipmentStatus } from '@/hooks/use-update-equipment-status';
import {
  updateEquipmentStatusSchema,
  type UpdateEquipmentStatusFormData,
} from '@/schemas/update-equipment-status.schema';
import type {
  EquipmentStatus,
  EquipmentErrorResponse,
} from '@/types/equipment.types';

interface ChangeStatusDialogProps {
  equipmentId: string;
  equipmentName: string;
  currentStatus: EquipmentStatus;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ChangeStatusDialog({
  equipmentId,
  equipmentName,
  currentStatus,
  open,
  onOpenChange,
  onSuccess,
}: ChangeStatusDialogProps) {
  const t = useTranslations('equipment-inventory');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutate, error: mutationError } = useUpdateEquipmentStatus(equipmentId);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<UpdateEquipmentStatusFormData>({
    resolver: zodResolver(updateEquipmentStatusSchema),
    defaultValues: {
      status: currentStatus,
      reason: null,
    },
  });

  const statusValue = watch('status');
  const reasonValue = watch('reason') || '';

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const onSubmit = (data: UpdateEquipmentStatusFormData) => {
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

  const statusOptions: EquipmentStatus[] = [
    'Available',
    'Rented',
    'Maintenance',
    'Out of Service',
  ];

  const getStatusBadgeVariant = (status: EquipmentStatus) => {
    switch (status) {
      case 'Available':
        return 'default';
      case 'Rented':
        return 'default';
      case 'Maintenance':
        return 'default';
      case 'Out of Service':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('statusUpdate.title')}</DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            {equipmentName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Current Status */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              {t('statusUpdate.currentStatus')}
            </Label>
            <div>
              <Badge variant={getStatusBadgeVariant(currentStatus)}>
                {t(`createEquipment.form.fields.status.options.${currentStatus}`)}
              </Badge>
            </div>
          </div>

          {/* New Status */}
          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-medium text-gray-700">
              {t('statusUpdate.newStatus')} <span className="text-red-500">*</span>
            </Label>
            <Select
              value={statusValue}
              onValueChange={(value) => setValue('status', value as EquipmentStatus)}
            >
              <SelectTrigger
                id="status"
                className={errors.status ? 'border-red-500' : ''}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {t(`createEquipment.form.fields.status.options.${status}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-red-600">
                {(() => {
                  let message = errors.status.message!;
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
          </div>

          {/* Reason (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="reason" className="text-sm font-medium text-gray-700">
              {t('statusUpdate.reason')}
            </Label>
            <Textarea
              id="reason"
              {...register('reason')}
              placeholder={t('statusUpdate.reasonPlaceholder')}
              className={`min-h-[80px] resize-vertical ${
                errors.reason ? 'border-red-500' : ''
              }`}
              maxLength={500}
            />
            <div className="flex justify-between items-center">
              {errors.reason ? (
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
              ) : (
                <p className="text-xs text-gray-500">{t('statusUpdate.reasonHelp')}</p>
              )}
              <p className="text-xs text-gray-500 text-end">
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
              {t('statusUpdate.cancelButton')}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? t('shared.common.loading')
                : t('statusUpdate.confirmButton')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
