'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { AxiosError } from 'axios';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useUpdateUserProfile } from '@/hooks/use-update-user-profile';
import {
  updateUserProfileSchema,
  type UpdateUserProfileFormData,
} from '@/schemas/user-management.schema';
import type {
  UserDetails,
  UserManagementErrorResponse,
  UserManagementErrorCode,
} from '@/types/user-management.types';

interface EditUserProfileDialogProps {
  user: UserDetails | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditUserProfileDialog({
  user,
  isOpen,
  onClose,
  onSuccess,
}: EditUserProfileDialogProps) {
  const t = useTranslations('user-management');
  const params = useParams();
  const locale = params.locale as string;
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<UpdateUserProfileFormData>({
    resolver: zodResolver(updateUserProfileSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
    },
  });

  const { mutate, isPending, isSuccess, error, reset: resetMutation } = useUpdateUserProfile(user?.id || '');

  // Reset form when user data changes
  useEffect(() => {
    if (user && isOpen) {
      reset({
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber || '',
      });
      setIsDirty(false);
      resetMutation(); // Clear mutation state when dialog opens
    }
  }, [user, isOpen, reset, resetMutation]);

  // Track form changes
  useEffect(() => {
    const subscription = watch(() => {
      setIsDirty(true);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // Cleanup when dialog is closed
  useEffect(() => {
    if (!isOpen) {
      resetMutation();
      setIsDirty(false);
      setShowCancelConfirm(false);
    }
  }, [isOpen, resetMutation]);

  // Handle successful update
  useEffect(() => {
    if (isSuccess) {
      onSuccess();
      onClose();
      reset();
      resetMutation();
      setIsDirty(false);
    }
  }, [isSuccess, onSuccess, onClose, reset, resetMutation]);

  const onSubmit = (data: UpdateUserProfileFormData) => {
    // Convert empty string to null for phoneNumber
    const payload = {
      fullName: data.fullName,
      email: data.email,
      phoneNumber: data.phoneNumber?.trim() || null,
    };
    mutate(payload);
  };

  const handleClose = () => {
    if (isDirty && !isPending) {
      setShowCancelConfirm(true);
    } else {
      onClose();
      reset();
      resetMutation();
      setIsDirty(false);
    }
  };

  const handleCancelConfirm = () => {
    setShowCancelConfirm(false);
    onClose();
    reset();
    resetMutation();
    setIsDirty(false);
  };

  const handleKeepEditing = () => {
    setShowCancelConfirm(false);
  };

  const getErrorMessage = (
    fieldName: keyof UpdateUserProfileFormData
  ): string | undefined => {
    // Check form validation errors
    if (errors[fieldName]) {
      return t(errors[fieldName]?.message as string);
    }

    // Check API validation errors
    if (error instanceof AxiosError && error.response?.data) {
      const errorData = error.response.data as UserManagementErrorResponse;
      if (errorData.details) {
        const fieldError = errorData.details.find((d) => d.field === fieldName);
        if (fieldError) {
          // Strip "error." prefix if present
          const code = fieldError.code && typeof fieldError.code === 'string' && fieldError.code.startsWith('error.')
            ? fieldError.code.substring(6)
            : fieldError.code;
          return t(`errors.${code as UserManagementErrorCode}`);
        }
      }
    }

    return undefined;
  };

  // Extract global error - IMPORTANT: Check instanceof before accessing response
  const globalError =
    error instanceof AxiosError
      ? (error.response?.data as UserManagementErrorResponse)?.code
      : null;
  
  // Strip "error." prefix if present (backend format: "error.ERROR_NAME")
  const errorCode = globalError && typeof globalError === 'string' && globalError.startsWith('error.')
    ? globalError.substring(6)
    : globalError;

  if (!user) return null;

  return (
    <>
      <Dialog open={isOpen && !showCancelConfirm} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t('profileEdit.dialogTitle')}</DialogTitle>
            <DialogDescription>
              {t('profileEdit.dialogDescription', { name: user.fullName })}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Global Error Alert */}
            {errorCode && (
              <Alert variant="destructive">
                <AlertDescription>
                  {t(`errors.${errorCode}`) || t('errors.GENERIC_ERROR')}
                </AlertDescription>
              </Alert>
            )}

            {/* Full Name Field */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium">
                {t('form.fields.fullName.label')} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fullName"
                type="text"
                {...register('fullName')}
                placeholder={t('form.fields.fullName.placeholder')}
                className={getErrorMessage('fullName') ? 'border-red-500' : ''}
                disabled={isPending}
                dir={locale === 'fa' ? 'rtl' : 'ltr'}
              />
              {getErrorMessage('fullName') && (
                <p className="text-sm text-red-600">{getErrorMessage('fullName')}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                {t('form.fields.email.label')} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder={t('form.fields.email.placeholder')}
                className={getErrorMessage('email') ? 'border-red-500' : ''}
                disabled={isPending}
                dir="ltr"
              />
              {getErrorMessage('email') && (
                <p className="text-sm text-red-600">{getErrorMessage('email')}</p>
              )}
            </div>

            {/* Phone Number Field */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-sm font-medium">
                {t('form.fields.phoneNumber.label')}
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                {...register('phoneNumber')}
                placeholder={t('form.fields.phoneNumber.placeholder')}
                className={getErrorMessage('phoneNumber') ? 'border-red-500' : ''}
                disabled={isPending}
                dir="ltr"
              />
              {getErrorMessage('phoneNumber') && (
                <p className="text-sm text-red-600">{getErrorMessage('phoneNumber')}</p>
              )}
            </div>

            {/* Email Change Warning */}
            {watch('email') !== user.email && (
              <Alert variant="default" className="bg-blue-50 border-blue-200">
                <AlertDescription className="text-sm text-blue-800">
                  {t('profileEdit.emailChangeWarning')}
                </AlertDescription>
              </Alert>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isPending}
              >
                {t('form.buttons.cancel')}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="me-2 size-4 animate-spin" />
                    {t('profileEdit.buttons.saving')}
                  </>
                ) : (
                  t('profileEdit.buttons.save')
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('profileEdit.cancel.confirmTitle')}</DialogTitle>
            <DialogDescription>
              {t('profileEdit.cancel.confirmMessage')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleKeepEditing}>
              {t('profileEdit.cancel.keepEditingButton')}
            </Button>
            <Button type="button" variant="destructive" onClick={handleCancelConfirm}>
              {t('profileEdit.cancel.confirmButton')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
