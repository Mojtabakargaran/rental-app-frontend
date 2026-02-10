import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { LoginForm } from '@/components/forms/login-form';
import { LanguageToggle } from '@/components/ui/language-toggle';
import Link from 'next/link';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'login' });

  return {
    title: t('page.title'),
    description: t('page.description'),
  };
}

export default async function LoginPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'login' });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Language Toggle */}
        <div className="flex justify-center mb-6">
          <LanguageToggle />
        </div>
        
        <LoginForm />

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-600">
          <p>
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
