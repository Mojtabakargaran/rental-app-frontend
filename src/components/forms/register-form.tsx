'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useRegister } from '@/hooks/use-register';
import {
  registerSchema,
  type RegisterFormData,
  calculatePasswordStrength,
  getPasswordStrengthLevel,
} from '@/schemas/auth.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, CheckCircle, AlertCircle } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import type { RegisterErrorResponse, AuthErrorCode } from '@/types/auth.types';
import { AxiosError } from 'axios';

export function RegisterForm() {
  const t = useTranslations('register');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(calculatePasswordStrength(''));
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      companyName: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      phoneNumber: '',
      languagePreference: 'en',
    },
  });

  const { mutate: registerUser, isSuccess, error: mutationError } = useRegister();

  const password = watch('password');
  const languagePreference = watch('languagePreference');

  // Update password strength indicator
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPasswordStrength(calculatePasswordStrength(value));
  };

  const onSubmit = (data: RegisterFormData) => {
    registerUser(data, {
      onSuccess: (response) => {
        setRegisteredEmail(response.data.email);
      },
    });
  };

  // Get error message from backend or form validation
  const getErrorMessage = (fieldName: keyof RegisterFormData): string | undefined => {
    if (errors[fieldName]) {
      return t(errors[fieldName]?.message as string);
    }

    if (mutationError && mutationError instanceof AxiosError) {
      const errorData = mutationError.response?.data as RegisterErrorResponse;
      
      // Field-specific errors
      if (errorData?.details) {
        const fieldError = errorData.details.find((detail) => detail.field === fieldName);
        if (fieldError) {
          return t(`errors.${fieldError.code as AuthErrorCode}`);
        }
      }
    }

    return undefined;
  };

  // Get global error message
  const globalError = mutationError instanceof AxiosError
    ? (mutationError.response?.data as RegisterErrorResponse)?.code
    : null;

  const strengthLevel = getPasswordStrengthLevel(passwordStrength);
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-emerald-500'];
  const strengthLabels = ['0', '1', '2', '3', '4', '5'];

  // Success view
  if (isSuccess && registeredEmail) {
    return (
      <div className="space-y-6">
        <Alert variant="success">
          <CheckCircle className="h-5 w-5" />
          <AlertDescription className="space-y-2">
            <p className="font-semibold text-lg">{t('success.title')}</p>
            <p>{t('success.message')}</p>
            <p className="text-sm">{t('success.checkEmail', { email: registeredEmail })}</p>
          </AlertDescription>
        </Alert>

        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">{t('success.resendPrompt')}</p>
          <a href="/resend-verification">
            <Button variant="outline" type="button">
              {t('success.resendButton')}
            </Button>
          </a>
        </div>
      </div>
    );
  }

  // Registration form
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Global Error */}
      {globalError && (
        <Alert variant="destructive">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription>
            {t(`errors.${globalError as AuthErrorCode}`)}
          </AlertDescription>
        </Alert>
      )}
      
      {/* Fallback error display - in case globalError extraction fails */}
      {mutationError && !globalError && (
        <Alert variant="destructive">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription>
            {t('errors.REGISTRATION_FAILED')}
          </AlertDescription>
        </Alert>
      )}

      {/* Language Preference */}
      <div className="space-y-2">
        <Label htmlFor="languagePreference">{t('form.fields.languagePreference.label')}</Label>
        <Select
          value={languagePreference}
          onValueChange={(value) => setValue('languagePreference', value as 'en' | 'fa')}
        >
          <SelectTrigger id="languagePreference">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">{t('form.fields.languagePreference.options.en')}</SelectItem>
            <SelectItem value="fa">{t('form.fields.languagePreference.options.fa')}</SelectItem>
          </SelectContent>
        </Select>
        {getErrorMessage('languagePreference') && (
          <p className="text-sm text-red-600">{getErrorMessage('languagePreference')}</p>
        )}
      </div>

      {/* Full Name */}
      <div className="space-y-2">
        <Label htmlFor="fullName">{t('form.fields.fullName.label')}</Label>
        <Input
          id="fullName"
          type="text"
          placeholder={t('form.fields.fullName.placeholder')}
          {...register('fullName')}
          aria-invalid={!!getErrorMessage('fullName')}
        />
        {getErrorMessage('fullName') && (
          <p className="text-sm text-red-600">{getErrorMessage('fullName')}</p>
        )}
      </div>

      {/* Company Name */}
      <div className="space-y-2">
        <Label htmlFor="companyName">{t('form.fields.companyName.label')}</Label>
        <Input
          id="companyName"
          type="text"
          placeholder={t('form.fields.companyName.placeholder')}
          {...register('companyName')}
          aria-invalid={!!getErrorMessage('companyName')}
        />
        {getErrorMessage('companyName') && (
          <p className="text-sm text-red-600">{getErrorMessage('companyName')}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">{t('form.fields.email.label')}</Label>
        <Input
          id="email"
          type="email"
          placeholder={t('form.fields.email.placeholder')}
          {...register('email')}
          aria-invalid={!!getErrorMessage('email')}
          dir="ltr"
        />
        {getErrorMessage('email') && (
          <p className="text-sm text-red-600">{getErrorMessage('email')}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password">{t('form.fields.password.label')}</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder={t('form.fields.password.placeholder')}
            {...register('password', {
              onChange: handlePasswordChange,
            })}
            aria-invalid={!!getErrorMessage('password')}
            dir="ltr"
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {getErrorMessage('password') && (
          <p className="text-sm text-red-600">{getErrorMessage('password')}</p>
        )}

        {/* Password Strength Indicator */}
        {password && (
          <div className="space-y-2">
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map((index) => (
                <div
                  key={index}
                  className={`h-1 flex-1 rounded ${
                    index < strengthLevel ? strengthColors[strengthLevel - 1] : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-gray-600">
              {t(`form.passwordStrength.levels.${strengthLabels[strengthLevel]}`)}
            </p>
            <div className="text-xs space-y-1 text-gray-600">
              <p className="font-medium">{t('form.passwordStrength.title')}</p>
              <ul className="space-y-1">
                <li className={passwordStrength.hasMinLength ? 'text-emerald-600' : ''}>
                  {passwordStrength.hasMinLength ? '✓' : '○'} {t('form.passwordStrength.minLength')}
                </li>
                <li className={passwordStrength.hasUppercase ? 'text-emerald-600' : ''}>
                  {passwordStrength.hasUppercase ? '✓' : '○'} {t('form.passwordStrength.uppercase')}
                </li>
                <li className={passwordStrength.hasLowercase ? 'text-emerald-600' : ''}>
                  {passwordStrength.hasLowercase ? '✓' : '○'} {t('form.passwordStrength.lowercase')}
                </li>
                <li className={passwordStrength.hasNumber ? 'text-emerald-600' : ''}>
                  {passwordStrength.hasNumber ? '✓' : '○'} {t('form.passwordStrength.number')}
                </li>
                <li className={passwordStrength.hasSpecialChar ? 'text-emerald-600' : ''}>
                  {passwordStrength.hasSpecialChar ? '✓' : '○'} {t('form.passwordStrength.specialChar')}
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Password Confirmation */}
      <div className="space-y-2">
        <Label htmlFor="passwordConfirmation">{t('form.fields.passwordConfirmation.label')}</Label>
        <div className="relative">
          <Input
            id="passwordConfirmation"
            type={showPasswordConfirmation ? 'text' : 'password'}
            placeholder={t('form.fields.passwordConfirmation.placeholder')}
            {...register('passwordConfirmation')}
            aria-invalid={!!getErrorMessage('passwordConfirmation')}
            dir="ltr"
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            aria-label={showPasswordConfirmation ? 'Hide password' : 'Show password'}
          >
            {showPasswordConfirmation ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {getErrorMessage('passwordConfirmation') && (
          <p className="text-sm text-red-600">{getErrorMessage('passwordConfirmation')}</p>
        )}
      </div>

      {/* Phone Number (Optional) */}
      <div className="space-y-2">
        <Label htmlFor="phoneNumber">{t('form.fields.phoneNumber.label')}</Label>
        <Input
          id="phoneNumber"
          type="tel"
          placeholder={t('form.fields.phoneNumber.placeholder')}
          {...register('phoneNumber')}
          aria-invalid={!!getErrorMessage('phoneNumber')}
          dir="ltr"
        />
        {getErrorMessage('phoneNumber') && (
          <p className="text-sm text-red-600">{getErrorMessage('phoneNumber')}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="me-2 h-4 w-4 animate-spin" />
            {t('form.buttons.submitting')}
          </>
        ) : (
          t('form.buttons.submit')
        )}
      </Button>

      {/* Sign In Link */}
      <div className="text-center text-sm text-gray-600">
        {t('form.buttons.haveAccount')}{' '}
        <a href="/login" className="text-blue-600 hover:underline font-medium">
          {t('form.buttons.signIn')}
        </a>
      </div>
    </form>
  );
}
