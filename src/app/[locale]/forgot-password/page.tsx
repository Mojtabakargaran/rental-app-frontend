import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ForgotPasswordForm } from '@/components/forms/forgot-password-form';
import { LanguageToggle } from '@/components/ui/language-toggle';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'forgot-password' });

  return {
    title: t('forgotPassword.page.title'),
    description: t('forgotPassword.page.description'),
  };
}

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Language Toggle */}
        <div className="flex justify-center mb-6">
          <LanguageToggle />
        </div>
        
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
