'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useVerifyEmail } from '@/hooks/use-verify-email';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { getErrorI18nKey } from '@/utils/error.util';
import { getCurrentYear } from '@/utils/date.util';
import Link from 'next/link';
import { LanguageToggle } from '@/components/ui/language-toggle';

/**
 * VerifyEmailContent component (separated for Suspense boundary)
 * Handles the email verification process
 */
function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations('register.verifyEmail');
  const tErrors = useTranslations('register.errors');
  const [countdown, setCountdown] = useState(3);

  // Extract token from URL query parameter
  const token = searchParams.get('token');

  // Verify email using the token
  const { data, error, isLoading, isSuccess, isError } = useVerifyEmail(token);

  // Handle automatic redirect on success (after 3 seconds)
  useEffect(() => {
    if (isSuccess && data?.redirectUrl) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            router.push(data.redirectUrl);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isSuccess, data, router]);

  // Loading state - verification in progress
  if (isLoading) {
    return (
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <Loader2 className="h-16 w-16 animate-spin text-blue-600" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">{t('title')}</h2>
        <p className="text-gray-600">{t('verifying')}</p>
      </div>
    );
  }

  // Success state - email verified
  if (isSuccess && data) {
    const isAlreadyActivated = data.message.includes('already activated') || 
                                data.message.includes('قبلاً فعال شده');

    return (
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-emerald-100 p-4">
            <CheckCircle2 className="h-16 w-16 text-emerald-600" />
          </div>
        </div>

        {isAlreadyActivated ? (
          <>
            <Alert variant="default" className="mb-6 text-start">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              <AlertTitle className="text-lg font-semibold">
                {t('alreadyActivated.title')}
              </AlertTitle>
              <AlertDescription className="text-gray-600 mt-2">
                {t('alreadyActivated.message')}
              </AlertDescription>
            </Alert>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              {t('success.title')}
            </h2>
            <p className="text-gray-600 mb-6">{t('success.message')}</p>
            <p className="text-sm text-gray-500 mb-6">
              {t('success.redirecting').replace('{count}', countdown.toString())}
            </p>
          </>
        )}
      </div>
    );
  }

  // Error state - verification failed
  if (isError && error) {
    const errorCode = getErrorI18nKey(error);
    const errorMessage = tErrors(errorCode);
    const resendUrl = error.response?.data?.resendUrl;

    return (
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-red-100 p-4">
            <XCircle className="h-16 w-16 text-red-600" />
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 mb-2">{t('error.title')}</h2>

        <Alert variant="destructive" className="mb-6 text-start">
          <XCircle className="h-5 w-5" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>

        {/* Show resend button if resendUrl is provided */}
        {resendUrl && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">{t('error.resendPrompt')}</p>
            <Button asChild className="w-full">
              <Link href={resendUrl}>{t('error.resendButton')}</Link>
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Fallback - missing token
  return (
    <div className="text-center">
      <div className="flex justify-center mb-6">
        <div className="rounded-full bg-red-100 p-4">
          <XCircle className="h-16 w-16 text-red-600" />
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mb-2">{t('error.title')}</h2>

      <Alert variant="destructive" className="mb-6 text-start">
        <XCircle className="h-5 w-5" />
        <AlertDescription>{tErrors('INVALID_TOKEN_FORMAT')}</AlertDescription>
      </Alert>

      <Button asChild className="w-full">
        <Link href="/resend-verification">{t('error.resendButton')}</Link>
      </Button>
    </div>
  );
}

/**
 * VerifyEmailPage component
 * Main page for email verification (P1UC03)
 */
export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Language Toggle */}
        <div className="flex justify-center mb-6">
          <LanguageToggle />
        </div>
        
        {/* Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <Suspense
            fallback={
              <div className="text-center">
                <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto" />
              </div>
            }
          >
            <VerifyEmailContent />
          </Suspense>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-600">
          <p>
            &copy; {getCurrentYear()} Rental Management System. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
