'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { AxiosError } from 'axios';
import { Eye, EyeOff, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import {
  changePasswordFirstLoginSchema,
  type ChangePasswordFirstLoginFormData,
  calculatePasswordStrength,
  getPasswordStrengthLevel,
} from '@/schemas/auth.schema';
import { useChangePasswordFirstLogin } from '@/hooks/use-change-password-first-login';
import type { ChangePasswordFirstLoginErrorResponse, ValidationErrorDetail } from '@/types/auth.types';

export function ChangePasswordFirstLoginForm() {
  const t = useTranslations('change-password-first-login');
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(
    calculatePasswordStrength('')
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ChangePasswordFirstLoginFormData>({
    resolver: zodResolver(changePasswordFirstLoginSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const { mutate, isPending, isSuccess, error } = useChangePasswordFirstLogin();

  const newPassword = watch('newPassword');

  // Update password strength on password change
  useEffect(() => {
    if (newPassword) {
      setPasswordStrength(calculatePasswordStrength(newPassword));
    } else {
      setPasswordStrength(calculatePasswordStrength(''));
    }
  }, [newPassword]);

  const strengthLevel = getPasswordStrengthLevel(passwordStrength);

  const getStrengthColor = () => {
    if (strengthLevel <= 2) return 'bg-red-500';
    if (strengthLevel === 3 || strengthLevel === 4) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getStrengthText = () => {
    if (strengthLevel <= 2) return t('form.passwordStrength.weak');
    if (strengthLevel === 3 || strengthLevel === 4) return t('form.passwordStrength.medium');
    return t('form.passwordStrength.strong');
  };

  const getStrengthWidth = () => {
    if (strengthLevel <= 2) return 'w-1/3';
    if (strengthLevel === 3 || strengthLevel === 4) return 'w-2/3';
    return 'w-full';
  };

  const onSubmit = (data: ChangePasswordFirstLoginFormData) => {
    mutate(data, {
      onSuccess: (_response) => {
        // Password changed successfully, redirect to dashboard
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      },
    });
  };

  // Get field-level error message
  const getErrorMessage = (
    fieldName: keyof ChangePasswordFirstLoginFormData
  ): string | undefined => {
    // 1. Check form validation errors
    if (errors[fieldName]) {
      return t(`validation.${errors[fieldName]?.message as string}`);
    }

    // 2. Check API field errors
    if (error instanceof AxiosError && error.response?.data) {
      const errorData = error.response.data as ChangePasswordFirstLoginErrorResponse;
      if (errorData.details) {
        const fieldError = errorData.details.find(
          (detail: ValidationErrorDetail) => detail.field === fieldName
        );
        if (fieldError) {
          // Strip "error." prefix if present
          const code = fieldError.code && typeof fieldError.code === 'string' && fieldError.code.startsWith('error.')
            ? fieldError.code.substring(6)
            : fieldError.code;
          return t(`errors.${code}`);
        }
      }
    }

    return undefined;
  };

  // Get global error code (not field-specific)
  const globalError =
    error instanceof AxiosError
      ? (error.response?.data as ChangePasswordFirstLoginErrorResponse)?.code
      : null;
  
  // Strip "error." prefix if present (backend format: "error.ERROR_NAME")
  const errorCode = globalError && typeof globalError === 'string' && globalError.startsWith('error.')
    ? globalError.substring(6)
    : globalError;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Success Message */}
      {isSuccess && (
        <Alert variant="success">
          <CheckCircle2 className="size-5" />
          <AlertTitle>{t('success.passwordChanged', { companyName: 'Your Company' })}</AlertTitle>
          <AlertDescription>{t('success.redirecting')}</AlertDescription>
        </Alert>
      )}

      {/* Global Error Message */}
      {errorCode && (
        <Alert variant="destructive">
          <XCircle className="size-5" />
          <AlertDescription>{t(`errors.${errorCode}`)}</AlertDescription>
        </Alert>
      )}

      {/* Fallback for errors without code */}
      {error && !globalError && (
        <Alert variant="destructive">
          <XCircle className="size-5" />
          <AlertDescription>{t('errors.unknown')}</AlertDescription>
        </Alert>
      )}

      {/* New Password Field */}
      <div className="space-y-2">
        <Label htmlFor="newPassword">{t('form.fields.newPassword.label')}</Label>
        <div className="relative">
          <Input
            id="newPassword"
            type={showPassword ? 'text' : 'password'}
            dir="ltr"
            placeholder={t('form.fields.newPassword.placeholder')}
            {...register('newPassword')}
            disabled={isPending || isSuccess}
            className={getErrorMessage('newPassword') ? 'border-red-500' : ''}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
          </button>
        </div>
        {getErrorMessage('newPassword') && (
          <p className="text-sm text-red-600">{getErrorMessage('newPassword')}</p>
        )}

        {/* Password Strength Indicator */}
        {newPassword && (
          <div className="space-y-2">
            <div className="h-1.5 rounded-full bg-gray-200">
              <div
                className={`h-full rounded-full transition-all duration-300 ${getStrengthColor()} ${getStrengthWidth()}`}
              />
            </div>
            <p className={`text-xs font-medium ${getStrengthColor().replace('bg-', 'text-')}`}>
              {getStrengthText()}
            </p>
          </div>
        )}

        {/* Password Requirements */}
        <div className="rounded-lg bg-gray-50 p-4">
          <p className="mb-2 text-sm font-medium text-gray-700">
            {t('form.passwordRequirements.title')}
          </p>
          <ul className="space-y-1 text-xs">
            <li
              className={
                passwordStrength.hasMinLength ? 'text-emerald-600' : 'text-gray-500'
              }
            >
              {passwordStrength.hasMinLength && <CheckCircle2 className="me-1 inline size-3" />}
              {t('form.passwordRequirements.minLength')}
            </li>
            <li
              className={
                passwordStrength.hasUppercase ? 'text-emerald-600' : 'text-gray-500'
              }
            >
              {passwordStrength.hasUppercase && <CheckCircle2 className="me-1 inline size-3" />}
              {t('form.passwordRequirements.uppercase')}
            </li>
            <li
              className={
                passwordStrength.hasLowercase ? 'text-emerald-600' : 'text-gray-500'
              }
            >
              {passwordStrength.hasLowercase && <CheckCircle2 className="me-1 inline size-3" />}
              {t('form.passwordRequirements.lowercase')}
            </li>
            <li
              className={
                passwordStrength.hasNumber ? 'text-emerald-600' : 'text-gray-500'
              }
            >
              {passwordStrength.hasNumber && <CheckCircle2 className="me-1 inline size-3" />}
              {t('form.passwordRequirements.number')}
            </li>
            <li
              className={
                passwordStrength.hasSpecialChar ? 'text-emerald-600' : 'text-gray-500'
              }
            >
              {passwordStrength.hasSpecialChar && <CheckCircle2 className="me-1 inline size-3" />}
              {t('form.passwordRequirements.specialChar')}
            </li>
          </ul>
        </div>
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">{t('form.fields.confirmPassword.label')}</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            dir="ltr"
            placeholder={t('form.fields.confirmPassword.placeholder')}
            {...register('confirmPassword')}
            disabled={isPending || isSuccess}
            className={getErrorMessage('confirmPassword') ? 'border-red-500' : ''}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            tabIndex={-1}
          >
            {showConfirmPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
          </button>
        </div>
        {getErrorMessage('confirmPassword') && (
          <p className="text-sm text-red-600">{getErrorMessage('confirmPassword')}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={isPending || isSuccess}>
        {isPending && <Loader2 className="me-2 size-4 animate-spin" />}
        {t('form.buttons.submit')}
      </Button>
    </form>
  );
}
