'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { AlertCircle, Loader2 } from 'lucide-react';

import { useValidateResetToken } from '@/hooks/use-validate-reset-token';
import { ResetPasswordForm } from '@/components/forms/reset-password-form';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { LanguageToggle } from '@/components/ui/language-toggle';

function ResetPasswordContent() {
  const t = useTranslations('forgot-password.resetPassword');
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  // Validate token on mount
  const { data, isLoading, error } = useValidateResetToken(token);

  // If no token in URL
  if (!token) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <Alert variant="destructive">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle>{t('tokenValidation.invalid')}</AlertTitle>
            <AlertDescription>
              <div className="mb-4">{t('tokenValidation.invalidDescription')}</div>
              <Link href="/forgot-password">
                <Button variant="outline" className="w-full">
                  {t('errors.requestNewLink')}
                </Button>
              </Link>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
            <p className="text-gray-600">{t('tokenValidation.validating')}</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state (invalid token)
  if (error) {
    const errorResponse = error.response?.data;
    const requestNewUrl = (errorResponse && 'requestNewUrl' in errorResponse 
      ? errorResponse.requestNewUrl 
      : '/forgot-password') || '/forgot-password';

    return (
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <Alert variant="destructive">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle>{t('tokenValidation.invalid')}</AlertTitle>
            <AlertDescription>
              <div className="mb-2">{t('tokenValidation.invalidDescription')}</div>
              <div className="mb-4">{t('tokenValidation.requestNew')}</div>
              <Link href={requestNewUrl}>
                <Button variant="outline" className="w-full">
                  {t('errors.requestNewLink')}
                </Button>
              </Link>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // Success state - show reset form
  if (data?.data.valid) {
    return <ResetPasswordForm token={token} />;
  }

  return null;
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Language Toggle */}
        <div className="flex justify-center mb-6">
          <LanguageToggle />
        </div>
        
        <Suspense
          fallback={
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
                <p className="text-gray-600">Loading...</p>
              </div>
            </div>
          }
        >
          <ResetPasswordContent />
        </Suspense>
      </div>
    </div>
  );
}
