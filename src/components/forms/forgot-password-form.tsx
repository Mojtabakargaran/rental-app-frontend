'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/schemas/auth.schema';
import { useForgotPassword } from '@/hooks/use-forgot-password';
import { useCsrfToken } from '@/hooks/use-csrf-token';
import { getErrorI18nKey, getRetryAfter } from '@/utils/error.util';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export function ForgotPasswordForm() {
  const t = useTranslations('forgot-password.forgotPassword');
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch CSRF token on mount
  const { isLoading: csrfLoading, error: csrfError } = useCsrfToken();

  // Initialize form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  // Forgot password mutation
  const { mutate, isPending, error: mutationError } = useForgotPassword();

  // Handle form submission
  const onSubmit = (data: ForgotPasswordFormData) => {
    mutate(data, {
      onSuccess: () => {
        setShowSuccess(true);
      },
    });
  };

  // Get retry after time for rate limiting
  const retryAfter = mutationError ? getRetryAfter(mutationError) : null;
  const retryMinutes = retryAfter ? Math.ceil(retryAfter / 60) : null;

  // Get error translation key
  const errorKey = mutationError ? getErrorI18nKey(mutationError) : null;

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('form.title')}
          </h1>
          <p className="text-sm text-gray-500">
            {t('form.subtitle')}
          </p>
        </div>

        {/* CSRF Error */}
        {csrfError && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>
              {t('errors.CSRF_TOKEN_INVALID')}
            </AlertDescription>
          </Alert>
        )}

        {/* Success Message */}
        {showSuccess && (
          <Alert variant="success" className="mb-6">
            <CheckCircle2 className="h-5 w-5" />
            <AlertTitle>{t('success.checkEmail')}</AlertTitle>
            <AlertDescription>
              {t('success.sent')}
            </AlertDescription>
          </Alert>
        )}

        {/* Error Message */}
        {mutationError && !showSuccess && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>
              {errorKey && t(`errors.${errorKey}`)}
              {retryMinutes && (
                <div className="mt-2 text-sm">
                  {t('errors.retryAfter', { minutes: retryMinutes })}
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">
              {t('form.fields.email.label')}
            </Label>
            <Input
              id="email"
              type="email"
              dir="ltr"
              placeholder={t('form.fields.email.placeholder')}
              {...register('email')}
              disabled={isPending || csrfLoading || showSuccess}
              className={errors.email ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">
                {t(`validation.${errors.email.message}`)}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isPending || csrfLoading || showSuccess}
          >
            {isPending ? t('form.buttons.submitting') : t('form.buttons.submit')}
          </Button>
        </form>

        {/* Back to Login Link */}
        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
          >
            {t('form.buttons.backToLogin')}
          </Link>
        </div>
      </div>
    </div>
  );
}
