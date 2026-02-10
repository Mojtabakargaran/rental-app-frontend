'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

import { loginSchema, type LoginFormData } from '@/schemas/auth.schema';
import { useLogin } from '@/hooks/use-login';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getRetryAfter } from '@/utils/error.util';

export function LoginForm() {
  const t = useTranslations('login');
  const tShared = useTranslations('shared');
  const tProfile = useTranslations('profile');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { mutate: login, isPending, error: mutationError } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState<string | null>(null);
  const [sessionExpiredMessage, setSessionExpiredMessage] = useState<string | null>(null);

  // Check for logout success message from URL params (UC3.4)
  useEffect(() => {
    const message = searchParams.get('message');
    const sessionExpired = searchParams.get('session_expired');
    
    if (message === 'logged_out' || message === 'multi_tab_logout') {
      setLogoutMessage(tProfile('logout.success'));
      // Clear message from URL after 5 seconds
      setTimeout(() => setLogoutMessage(null), 5000);
    }
    
    if (sessionExpired === 'true') {
      setSessionExpiredMessage(tProfile('logout.sessionExpired'));
      // Clear message from URL after 5 seconds
      setTimeout(() => setSessionExpiredMessage(null), 5000);
    }
  }, [searchParams, tProfile]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const rememberMeValue = watch('rememberMe');

  const onSubmit = (data: LoginFormData) => {
    login(data, {
      onSuccess: (response) => {
        // Check if password change is required on first login (P4UC06)
        if (response.data.requirePasswordChange) {
          // Redirect to change password page with temporary session
          router.push('/change-password-first-login');
        } else {
          // Normal login - redirect to dashboard
          router.push('/dashboard');
        }
      },
    });
  };

  // Extract error information
  const errorCode = mutationError?.response?.data?.code;
  const errorMessage = errorCode ? t(`errors.${errorCode}`) : null;
  const attemptsRemaining = mutationError?.response?.data?.attemptsRemaining;
  const retryAfter = getRetryAfter(mutationError);
  const retryAfterMinutes = retryAfter ? Math.ceil(retryAfter / 60) : null;
  const resendUrl = mutationError?.response?.data?.resendUrl;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('form.title')}</h1>
        <p className="text-gray-600">{t('form.subtitle')}</p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        {/* Logout Success Alert (UC3.4) */}
        {logoutMessage && (
          <Alert variant="success">
            <AlertDescription>{logoutMessage}</AlertDescription>
          </Alert>
        )}

      {/* Session Expired Alert (UC3.4) */}
      {sessionExpiredMessage && (
        <Alert variant="destructive">
          <AlertDescription>{sessionExpiredMessage}</AlertDescription>
        </Alert>
      )}

      {/* Error Alert */}
      {mutationError && (
        <Alert variant="destructive">
          <AlertDescription className="space-y-2">
            <p>{errorMessage || tShared('errors.unknown')}</p>
            
            {/* Show attempts remaining */}
            {attemptsRemaining !== undefined && attemptsRemaining > 0 && (
              <p className="text-sm">
                {t('errors.attemptsRemaining', { count: attemptsRemaining })}
              </p>
            )}
            
            {/* Show retry after time */}
            {retryAfterMinutes && (
              <p className="text-sm">
                {t('errors.retryAfter', { minutes: retryAfterMinutes })}
              </p>
            )}

            {/* Show resend verification link for EMAIL_NOT_VERIFIED error */}
            {errorCode === 'EMAIL_NOT_VERIFIED' && resendUrl && (
              <div className="mt-2">
                <Link
                  href={resendUrl}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                >
                  {t('form.links.resendVerification')}
                </Link>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email">{t('form.fields.email.label')}</Label>
          <Input
            id="email"
            type="email"
            dir="ltr"
            placeholder={t('form.fields.email.placeholder')}
            {...register('email')}
            className={errors.email ? 'border-red-500' : ''}
            disabled={isPending}
          />
          {errors.email && (
            <p className="text-sm text-red-600">{t(errors.email.message as string)}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password">{t('form.fields.password.label')}</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              dir="ltr"
              placeholder={t('form.fields.password.placeholder')}
              {...register('password')}
              className={errors.password ? 'border-red-500' : ''}
              disabled={isPending}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              disabled={isPending}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-600">{t(errors.password.message as string)}</p>
          )}
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Checkbox
            id="rememberMe"
            checked={rememberMeValue}
            onCheckedChange={(checked: boolean) => {
              register('rememberMe').onChange({
                target: { value: checked, name: 'rememberMe' },
              });
            }}
            disabled={isPending}
          />
          <Label
            htmlFor="rememberMe"
            className="text-sm font-normal cursor-pointer select-none"
          >
            {t('form.fields.rememberMe.label')}
          </Label>
        </div>

        {/* Forgot Password Link */}
        <div className="text-center">
          <Link
            href="/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
          >
            {t('form.links.forgotPassword')}
          </Link>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="me-2 h-4 w-4 animate-spin" />
              {t('form.buttons.submitting')}
            </>
          ) : (
            t('form.buttons.submit')
          )}
        </Button>
      </form>
      </div>

      {/* Register Link */}
      <div className="text-center mt-6">
        <Link
          href="/register"
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          {t('form.links.register')}
        </Link>
      </div>
    </div>
  );
}
