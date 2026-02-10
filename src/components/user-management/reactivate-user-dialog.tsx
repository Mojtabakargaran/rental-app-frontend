'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { CheckCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useReactivateUser } from '@/hooks/use-reactivate-user';
import type { AxiosError } from 'axios';
import type { UserManagementErrorResponse } from '@/types/user-management.types';

interface ReactivateUserDialogProps {
  userId: string;
  userName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

/**
 * Reactivate User Dialog Component - P4UC05
 * Confirmation dialog for reactivating user account
 */
export function ReactivateUserDialog({
  userId,
  userName,
  isOpen,
  onClose,
  onSuccess,
}: ReactivateUserDialogProps) {
  const t = useTranslations('user-management');

  const [showSuccess, setShowSuccess] = useState(false);

  const { mutate, isPending, isSuccess, error, reset } = useReactivateUser(userId);

  const mutationError = error as AxiosError<UserManagementErrorResponse> | null;
  const errorCode = mutationError?.response?.data?.code;
  
  // Strip "error." prefix if present (backend format: "error.ERROR_NAME")
  const strippedErrorCode = errorCode && typeof errorCode === 'string' && errorCode.startsWith('error.')
    ? errorCode.substring(6)
    : errorCode;

  // Reset state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setShowSuccess(false);
      reset();
    }
  }, [isOpen, reset]);

  // Show success message briefly then close
  useEffect(() => {
    if (isSuccess && !showSuccess) {
      setShowSuccess(true);
      const timer = setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, showSuccess, onSuccess, onClose]);

  const handleConfirm = () => {
    mutate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-blue-600" />
            {t('reactivation.dialogTitle')}
          </DialogTitle>
          <DialogDescription>
            {t('reactivation.dialogDescription', { name: userName })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Info Message */}
          <Alert className="border-blue-200 bg-blue-50">
            <AlertDescription className="text-sm text-blue-800">
              {t('reactivation.infoMessage')}
            </AlertDescription>
          </Alert>

          {/* Success Message */}
          {showSuccess && (
            <Alert className="border-emerald-200 bg-emerald-50">
              <AlertDescription className="text-sm text-emerald-800">
                {t('success.userReactivated', { name: userName })}
              </AlertDescription>
            </Alert>
          )}

          {/* Error Message */}
          {error && strippedErrorCode && (
            <Alert variant="destructive">
              <AlertDescription>
                {t(`errors.${strippedErrorCode}`)}
              </AlertDescription>
            </Alert>
          )}

          {/* Fallback Error */}
          {error && !errorCode && (
            <Alert variant="destructive">
              <AlertDescription>
                {t('errors.GENERIC_ERROR')}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isPending || isSuccess}
            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700"
          >
            {t('reactivation.buttons.cancel')}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isPending || isSuccess}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isPending ? t('reactivation.buttons.reactivating') : t('reactivation.buttons.confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
