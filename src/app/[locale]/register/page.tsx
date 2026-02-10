'use client';

import { useTranslations } from 'next-intl';
import { RegisterForm } from '@/components/forms/register-form';
import { useCsrfToken } from '@/hooks/use-csrf-token';
import { Alert, AlertDescription, AlertCircle } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { getCurrentYear } from '@/utils/date.util';
import { LanguageToggle } from '@/components/ui/language-toggle';
import Link from 'next/link';

export default function RegisterPage() {
  const t = useTranslations('register');
  const { isLoading: csrfLoading, error: csrfError } = useCsrfToken();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Language Toggle */}
        <div className="flex justify-center mb-6">
          <LanguageToggle />
        </div>
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
          <p className="text-gray-600">{t('subtitle')}</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {/* CSRF Token Loading State */}
          {csrfLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          )}

          {/* CSRF Token Error State */}
          {csrfError && (
            <Alert variant="destructive">
              <AlertCircle className="h-5 w-5" />
              <AlertDescription>{csrfError}</AlertDescription>
            </Alert>
          )}

          {/* Registration Form */}
          {!csrfLoading && !csrfError && <RegisterForm />}
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-600">
          <p>
            &copy; {getCurrentYear()} Rental Management System. All rights reserved.
          </p>
          <p className="mt-2">
            {t('footer.sampleApp')}
            <Link href="/" className="text-blue-600 hover:underline">
              {t('footer.methodology')}
            </Link>
            {t('footer.byAuthor')}
          </p>
        </div>
      </div>
    </div>
  );
}
