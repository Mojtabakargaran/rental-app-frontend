'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react';

import {
  resetPasswordSchema,
  type ResetPasswordFormData,
  calculatePasswordStrength,
  getPasswordStrengthLevel,
  type PasswordStrength,
} from '@/schemas/auth.schema';
import { useResetPassword } from '@/hooks/use-reset-password';
import { useCsrfToken } from '@/hooks/use-csrf-token';
import { getErrorI18nKey } from '@/utils/error.util';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const t = useTranslations('forgot-password.resetPassword');
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    hasMinLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  // Fetch CSRF token on mount
  const { isLoading: csrfLoading, error: csrfError } = useCsrfToken();

  // Initialize form
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token,
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Watch password field for real-time strength validation
  const newPassword = watch('newPassword');

  // Update password strength as user types
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setPasswordStrength(calculatePasswordStrength(password));
  };

  // Reset password mutation
  const { mutate, isPending, isSuccess, error: mutationError } = useResetPassword();

  // Handle form submission
  const onSubmit = (data: ResetPasswordFormData) => {
    mutate(data, {
      onSuccess: (response) => {
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push(response.data.redirectUrl);
        }, 3000);
      },
    });
  };

  // Get error translation key
  const errorKey = mutationError ? getErrorI18nKey(mutationError) : null;
  const errorResponse = mutationError?.response?.data;
  const requestNewUrl = errorResponse && 'requestNewUrl' in errorResponse 
    ? errorResponse.requestNewUrl 
    : null;

  // Calculate password strength level (0-5)
  const strengthLevel = getPasswordStrengthLevel(passwordStrength);
  const strengthLabel =
    strengthLevel <= 2
      ? t('form.passwordStrength.weak')
      : strengthLevel <= 4
      ? t('form.passwordStrength.medium')
      : t('form.passwordStrength.strong');
  const strengthColor =
    strengthLevel <= 2
      ? 'bg-red-500'
      : strengthLevel <= 4
      ? 'bg-amber-500'
      : 'bg-emerald-500';

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
        {isSuccess && (
          <Alert variant="success" className="mb-6">
            <CheckCircle2 className="h-5 w-5" />
            <AlertDescription>
              <div>{t('success.reset')}</div>
              <div className="mt-2 text-sm">{t('success.redirecting')}</div>
            </AlertDescription>
          </Alert>
        )}

        {/* Error Message */}
        {mutationError && !isSuccess && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>
              {errorKey && t(`errors.${errorKey}`)}
              {requestNewUrl && (
                <div className="mt-3">
                  <Link
                    href={requestNewUrl}
                    className="text-sm font-medium underline hover:no-underline"
                  >
                    {t('errors.requestNewLink')}
                  </Link>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Hidden Token Field */}
          <input type="hidden" {...register('token')} />

          {/* New Password Field */}
          <div className="space-y-2">
            <Label htmlFor="newPassword">
              {t('form.fields.newPassword.label')}
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPassword ? 'text' : 'password'}
                dir="ltr"
                placeholder={t('form.fields.newPassword.placeholder')}
                {...register('newPassword')}
                onChange={(e) => {
                  register('newPassword').onChange(e);
                  handlePasswordChange(e);
                }}
                disabled={isPending || csrfLoading || isSuccess}
                className={errors.newPassword ? 'border-red-500 focus:ring-red-500 focus:border-red-500 pe-10' : 'pe-10'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-sm text-red-600 mt-1">
                {t(`validation.${errors.newPassword.message}`)}
              </p>
            )}

            {/* Password Strength Indicator */}
            {newPassword && (
              <div className="mt-3 space-y-2">
                {/* Strength Bar */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${strengthColor}`}
                      style={{ width: `${(strengthLevel / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-600">
                    {strengthLabel}
                  </span>
                </div>

                {/* Requirements Checklist */}
                <div className="text-xs space-y-1">
                  <div className="font-medium text-gray-700">
                    {t('form.passwordStrength.title')}
                  </div>
                  <div className="space-y-1 ps-2">
                    <div className={`flex items-center gap-1.5 ${passwordStrength.hasMinLength ? 'text-emerald-600' : 'text-gray-500'}`}>
                      {passwordStrength.hasMinLength ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5" />
                      )}
                      <span>{t('form.passwordStrength.minLength')}</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${passwordStrength.hasUppercase ? 'text-emerald-600' : 'text-gray-500'}`}>
                      {passwordStrength.hasUppercase ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5" />
                      )}
                      <span>{t('form.passwordStrength.uppercase')}</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${passwordStrength.hasLowercase ? 'text-emerald-600' : 'text-gray-500'}`}>
                      {passwordStrength.hasLowercase ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5" />
                      )}
                      <span>{t('form.passwordStrength.lowercase')}</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${passwordStrength.hasNumber ? 'text-emerald-600' : 'text-gray-500'}`}>
                      {passwordStrength.hasNumber ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5" />
                      )}
                      <span>{t('form.passwordStrength.number')}</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${passwordStrength.hasSpecialChar ? 'text-emerald-600' : 'text-gray-500'}`}>
                      {passwordStrength.hasSpecialChar ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5" />
                      )}
                      <span>{t('form.passwordStrength.specialChar')}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">
              {t('form.fields.confirmPassword.label')}
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                dir="ltr"
                placeholder={t('form.fields.confirmPassword.placeholder')}
                {...register('confirmPassword')}
                disabled={isPending || csrfLoading || isSuccess}
                className={errors.confirmPassword ? 'border-red-500 focus:ring-red-500 focus:border-red-500 pe-10' : 'pe-10'}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-600 mt-1">
                {t(`validation.${errors.confirmPassword.message}`)}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isPending || csrfLoading || isSuccess}
          >
            {isPending ? t('form.buttons.submitting') : t('form.buttons.submit')}
          </Button>
        </form>

        {/* Back to Login Link */}
        {!isSuccess && (
          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
            >
              {t('form.buttons.backToLogin')}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
