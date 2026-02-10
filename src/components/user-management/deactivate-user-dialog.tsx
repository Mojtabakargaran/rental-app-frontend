'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { AlertTriangle } from 'lucide-react';
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
import { Label } from '@/components/ui/label';
import { useDeactivateUser } from '@/hooks/use-deactivate-user';
import type { AxiosError } from 'axios';
import type { UserManagementErrorResponse } from '@/types/user-management.types';

interface DeactivateUserDialogProps {
  userId: string;
  userName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

/**
 * Deactivate User Dialog Component - P4UC05
 * Confirmation dialog for deactivating user account with optional reason
 */
export function DeactivateUserDialog({
  userId,
  userName,
  isOpen,
  onClose,
  onSuccess,
}: DeactivateUserDialogProps) {
  const t = useTranslations('user-management');

  const [reason, setReason] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const { mutate, isPending, isSuccess, error, reset } = useDeactivateUser(userId);

  const mutationError = error as AxiosError<UserManagementErrorResponse> | null;
  const errorCode = mutationError?.response?.data?.code;
  
  // Strip "error." prefix if present (backend format: "error.ERROR_NAME")
  const strippedErrorCode = errorCode && typeof errorCode === 'string' && errorCode.startsWith('error.')
    ? errorCode.substring(6)
    : errorCode;

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      setReason('');
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
    const data = reason.trim() ? { reason: reason.trim() } : undefined;
    mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            {t('deactivation.dialogTitle')}
          </DialogTitle>
          <DialogDescription>
            {t('deactivation.dialogDescription', { name: userName })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Warning Message */}
          <Alert className="border-amber-200 bg-amber-50">
            <AlertDescription className="text-sm text-amber-800">
              {t('deactivation.warningMessage')}
            </AlertDescription>
          </Alert>

          {/* Optional Reason Field */}
          <div className="space-y-2">
            <Label htmlFor="reason" className="text-sm font-medium text-gray-700">
              {t('deactivation.reasonLabel')}
            </Label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={t('deactivation.reasonPlaceholder')}
              maxLength={500}
              rows={3}
              disabled={isPending || isSuccess}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
            />
            <p className="text-xs text-gray-500 text-end">
              {reason.length}/500
            </p>
          </div>

          {/* Success Message */}
          {showSuccess && (
            <Alert className="border-emerald-200 bg-emerald-50">
              <AlertDescription className="text-sm text-emerald-800">
                {t('success.userDeactivated', { name: userName })}
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
            {t('deactivation.buttons.cancel')}
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isPending || isSuccess}
          >
            {isPending ? t('deactivation.buttons.deactivating') : t('deactivation.buttons.confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
