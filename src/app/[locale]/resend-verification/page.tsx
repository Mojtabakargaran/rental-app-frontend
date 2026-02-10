import { Metadata } from 'next';
import { ResendVerificationForm } from '@/components/forms/resend-verification-form';
import { getTranslations } from 'next-intl/server';
import { LanguageToggle } from '@/components/ui/language-toggle';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'register' });

  return {
    title: `${t('resendVerification.pageTitle')} | ${t('resendVerification.appName')}`,
    description: t('resendVerification.pageDescription'),
  };
}

export default function ResendVerificationPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Language Toggle */}
        <div className="flex justify-center mb-6">
          <LanguageToggle />
        </div>
        
        <ResendVerificationForm />
      </div>
    </main>
  );
}
