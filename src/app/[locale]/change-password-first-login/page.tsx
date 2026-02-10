import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ChangePasswordFirstLoginForm } from '@/components/forms/change-password-first-login-form';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('change-password-first-login');
  
  return {
    title: t('form.title'),
  };
}

export default async function ChangePasswordFirstLoginPage() {
  const t = await getTranslations('change-password-first-login');

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">{t('form.title')}</h1>
          <p className="mt-2 text-sm text-gray-600">{t('form.subtitle')}</p>
        </div>

        {/* Form Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <ChangePasswordFirstLoginForm />
        </div>
      </div>
    </div>
  );
}
