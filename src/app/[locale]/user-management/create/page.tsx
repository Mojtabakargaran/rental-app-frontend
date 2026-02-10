import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { DashboardLayout } from '@/components/dashboard';
import { CreateUserForm } from '@/components/forms/create-user-form';

/**
 * Generate metadata for create user page - P4UC01
 */
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('user-management');
  
  return {
    title: `${t('pageTitle')} - ${process.env.NEXT_PUBLIC_APP_NAME}`,
    description: t('pageDescription'),
  };
}

/**
 * Create User Page - P4UC01
 */
export default function CreateUserPage() {
  return (
    <DashboardLayout>
      <CreateUserForm />
    </DashboardLayout>
  );
}
