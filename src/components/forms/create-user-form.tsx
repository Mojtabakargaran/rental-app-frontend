'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createUserSchema, type CreateUserFormData } from '@/schemas/user-management.schema';
import { useGetRoles } from '@/hooks/use-get-roles';
import { useCreateUser } from '@/hooks/use-create-user';
import type { UserManagementErrorResponse } from '@/types/user-management.types';
import type { ValidationErrorDetail } from '@/types/auth.types';
import { cn } from '@/lib/utils';

/**
 * Create User Form Component - P4UC01
 */
export function CreateUserForm() {
  const t = useTranslations('user-management');
  const tShared = useTranslations('shared');
  const router = useRouter();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // Fetch roles
  const {
    data: rolesData,
    isLoading: isLoadingRoles,
    error: rolesError,
  } = useGetRoles();

  // Create user mutation
  const {
    mutate: createUser,
    isPending,
    error: mutationError,
  } = useCreateUser();

  // Form setup
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
      roleCode: '',
    },
  });

  const watchedRole = watch('roleCode');

  // Handle form submission
  const onSubmit = (data: CreateUserFormData) => {
    // Remove phoneNumber if empty
    const submitData = {
      ...data,
      phoneNumber: data.phoneNumber?.trim() || undefined,
    };

    createUser(submitData, {
      onSuccess: (_response) => {
        // Redirect to user list
        router.push('/user-management');
      },
    });
  };

  // Handle cancel
  const handleCancel = () => {
    if (isDirty) {
      setShowCancelConfirm(true);
    } else {
      router.push('/user-management');
    }
  };

  const confirmCancel = () => {
    router.push('/user-management');
  };

  // Get field error message
  const getErrorMessage = (
    fieldName: keyof CreateUserFormData
  ): string | undefined => {
    // Check form validation errors
    if (errors[fieldName]) {
      return t(errors[fieldName]!.message as string);
    }

    // Check backend field errors
    if (mutationError instanceof AxiosError) {
      const errorData = mutationError.response?.data as UserManagementErrorResponse;
      if (errorData?.details) {
        const fieldError = errorData.details.find(
          (d: ValidationErrorDetail) => d.field === fieldName
        );
        if (fieldError) {
          return t(`errors.${fieldError.code}`);
        }
      }
    }

    return undefined;
  };

  // Extract global error
  const globalError =
    mutationError instanceof AxiosError
      ? (mutationError.response?.data as UserManagementErrorResponse)?.code
      : null;

  // Show roles loading error
  if (rolesError) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Alert variant="destructive">
          {t('errors.ROLES_RETRIEVAL_FAILED')}
        </Alert>
        <div className="mt-4">
          <Button onClick={() => window.location.reload()}>
            {t('form.buttons.retry', { defaultValue: 'Retry' })}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Cancel Confirmation Dialog */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">
              {t('cancel.confirmTitle')}
            </h3>
            <p className="text-gray-600">{t('cancel.confirmMessage')}</p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowCancelConfirm(false)}
              >
                {t('cancel.keepEditingButton')}
              </Button>
              <Button variant="destructive" onClick={confirmCancel}>
                {t('cancel.confirmButton')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Form Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 mb-8">
        <h1 className="text-3xl font-bold text-white drop-shadow-sm mb-2">
          {t('pageTitle')}
        </h1>
        <p className="text-blue-100">{t('pageDescription')}</p>
      </div>

      {/* Global Error */}
      {globalError && (
        <Alert variant="destructive" className="mb-6">
          {t(`errors.${globalError}`)}
        </Alert>
      )}

      {/* Fallback for errors without code */}
      {mutationError && !globalError && (
        <Alert variant="destructive" className="mb-6">
          {t('errors.GENERIC_ERROR')}
        </Alert>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {t('form.title')}
          </h2>

          <div className="space-y-6">
            {/* Full Name */}
            <div>
              <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                {t('form.fields.fullName.label')}{' '}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fullName"
                type="text"
                {...register('fullName')}
                placeholder={t('form.fields.fullName.placeholder')}
                className={cn(
                  'mt-1',
                  getErrorMessage('fullName') && 'border-red-500 focus:ring-red-500'
                )}
                disabled={isPending}
              />
              {getErrorMessage('fullName') && (
                <p className="text-sm text-red-600 mt-1">
                  {getErrorMessage('fullName')}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                {t('form.fields.email.label')}{' '}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                dir="ltr"
                {...register('email')}
                placeholder={t('form.fields.email.placeholder')}
                className={cn(
                  'mt-1',
                  getErrorMessage('email') && 'border-red-500 focus:ring-red-500'
                )}
                disabled={isPending}
              />
              {getErrorMessage('email') && (
                <p className="text-sm text-red-600 mt-1">
                  {getErrorMessage('email')}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                {t('form.fields.phoneNumber.label')}
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                dir="ltr"
                {...register('phoneNumber')}
                placeholder={t('form.fields.phoneNumber.placeholder')}
                className={cn(
                  'mt-1',
                  getErrorMessage('phoneNumber') && 'border-red-500 focus:ring-red-500'
                )}
                disabled={isPending}
              />
              {getErrorMessage('phoneNumber') && (
                <p className="text-sm text-red-600 mt-1">
                  {getErrorMessage('phoneNumber')}
                </p>
              )}
            </div>

            {/* Role */}
            <div>
              <Label htmlFor="roleCode" className="text-sm font-medium text-gray-700">
                {t('form.fields.role.label')}{' '}
                <span className="text-red-500">*</span>
              </Label>
              <Select
                value={watchedRole}
                onValueChange={(value) => setValue('roleCode', value, { shouldValidate: true })}
                disabled={isPending || isLoadingRoles}
              >
                <SelectTrigger
                  id="roleCode"
                  className={cn(
                    'mt-1',
                    getErrorMessage('roleCode') && 'border-red-500 focus:ring-red-500'
                  )}
                >
                  <SelectValue placeholder={t('form.fields.role.placeholder')} />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingRoles ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="size-4 animate-spin text-blue-600" />
                    </div>
                  ) : (
                    rolesData?.data.roles.map((role) => (
                      <SelectItem key={role.id} value={role.code}>
                        {tShared(`roles.${role.code}`)}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {getErrorMessage('roleCode') && (
                <p className="text-sm text-red-600 mt-1">
                  {getErrorMessage('roleCode')}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
            disabled={isPending}
          >
            {t('form.buttons.cancel')}
          </Button>
          <Button type="submit" disabled={isPending || isLoadingRoles}>
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin me-2" />
                {t('form.buttons.submitting')}
              </>
            ) : (
              t('form.buttons.submit')
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
