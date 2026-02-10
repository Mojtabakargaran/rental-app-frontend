import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { IntlProvider } from '@/lib/providers/intl-provider';
import { QueryProvider } from '@/lib/providers/query-provider';
import { locales } from '@/i18n';
import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

// Force dynamic rendering for i18n
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Rental Management System',
  description: 'Complete rental equipment management solution',
};

type RootLayoutProps = {
  children: React.ReactNode;
  params: { locale: string };
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params: { locale },
}: RootLayoutProps) {
  // Determine text direction based on locale
  const dir = locale === 'fa' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir}>
      <body className={inter.className}>
        <QueryProvider>
          <IntlProvider locale={locale}>
            {children}
          </IntlProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
