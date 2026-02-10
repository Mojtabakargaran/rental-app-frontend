import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { LandingPage } from '@/components/landing/landing-page';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'landing' });

  return {
    title: t('page.title'),
    description: t('page.description'),
  };
}

export default function HomePage() {
  return <LandingPage />;
}
