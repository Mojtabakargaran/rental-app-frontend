'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { AxiosError } from 'axios';
import { AlertCircle, CheckCircle2, Mail } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useResendVerification } from '@/hooks/use-resend-verification';
import {
  resendVerificationSchema,
  type ResendVerificationFormData,
} from '@/schemas/auth.schema';
import type {
  ResendVerificationErrorResponse,
  ValidationErrorDetail,
} from '@/types/auth.types';
import { getErrorI18nKey, getRetryAfter } from '@/utils/error.util';

export function ResendVerificationForm() {
  const t = useTranslations('register');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResendVerificationFormData>({
    resolver: zodResolver(resendVerificationSchema),
  });

  const {
    mutate,
    isPending,
    isSuccess,
    data: mutationData,
    error: mutationError,
  } = useResendVerification();

  const onSubmit = (data: ResendVerificationFormData) => {
    mutate(data);
  };

  // Extract error code from mutation error
  const globalError =
    mutationError instanceof AxiosError
      ? (mutationError.response?.data as ResendVerificationErrorResponse)?.code
      : null;

  // Get retry after time for rate limit errors
  const retryAfter =
    mutationError instanceof AxiosError ? getRetryAfter(mutationError) : null;

  // Helper to get field-level error message
  const getErrorMessage = (
    fieldName: keyof ResendVerificationFormData
  ): string | undefined => {
    // 1. Check form validation errors first
    if (errors[fieldName]) {
      return t(errors[fieldName]?.message as string);
    }

    // 2. Check backend validation errors
    if (mutationError instanceof AxiosError) {
      const errorResponse =
        mutationError.response?.data as ResendVerificationErrorResponse;
      const fieldError = errorResponse?.details?.find(
        (detail: ValidationErrorDetail) => detail.field === fieldName
      );
      if (fieldError) {
        // Strip "error." prefix if present
        const code = fieldError.code && typeof fieldError.code === 'string' && fieldError.code.startsWith('error.')
          ? fieldError.code.substring(6)
          : fieldError.code;
        return t(`errors.${code}` as 'errors.VALIDATION_ERROR');
      }
    }

    return undefined;
  };

  // Check if account is already activated from backend response message
  const isAlreadyActivated = isSuccess && mutationData?.message === 'resendVerification.alreadyActivated';

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t('resendVerification.title')}
          </h1>
          <p className="text-sm text-gray-500">
            {t('resendVerification.subtitle')}
          </p>
        </div>

        {/* Success Message */}
        {isSuccess && !isAlreadyActivated && (
          <Alert variant="success">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>{t('resendVerification.success.title')}</AlertTitle>
            <AlertDescription>
              {t('resendVerification.success.message')}
            </AlertDescription>
          </Alert>
        )}

        {/* Already Activated Message */}
        {isAlreadyActivated && (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>{t('resendVerification.success.title')}</AlertTitle>
            <AlertDescription>
              <div className="space-y-3">
                <p>{t('resendVerification.success.alreadyActivated')}</p>
                <a
                  href="/login"
                  className="inline-block text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium"
                >
                  {t('resendVerification.form.buttons.goToLogin')}
                </a>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Global Error with code */}
        {globalError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t('errors.title' as 'errors.VALIDATION_ERROR')}</AlertTitle>
            <AlertDescription>
              {t(`errors.${globalError}` as 'errors.VALIDATION_ERROR')}
              {retryAfter && (
                <span className="block mt-1 text-xs">
                  {t('resendVerification.info.waitTime')}
                </span>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Fallback error without code */}
        {mutationError && !globalError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {t(getErrorI18nKey(mutationError))}
            </AlertDescription>
          </Alert>
        )}

        {/* Info Message */}
        <Alert>
          <AlertDescription className="text-sm">
            {t('resendVerification.info.checkSpam')}
          </AlertDescription>
        </Alert>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">
              {t('resendVerification.form.fields.email.label')}
            </Label>
            <Input
              id="email"
              type="email"
              dir="ltr"
              placeholder={t('resendVerification.form.fields.email.placeholder')}
              className={getErrorMessage('email') ? 'border-red-500' : ''}
              disabled={isPending || isSuccess}
              {...register('email')}
            />
            {getErrorMessage('email') && (
              <p className="text-sm text-red-600 mt-1">
                {getErrorMessage('email')}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isPending || isSuccess}
          >
            {isPending
              ? t('resendVerification.form.buttons.submitting')
              : t('resendVerification.form.buttons.submit')}
          </Button>

          {/* Back to Register Link */}
          <div className="text-center">
            <a
              href="/register"
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
            >
              {t('resendVerification.form.buttons.backToRegister')}
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
