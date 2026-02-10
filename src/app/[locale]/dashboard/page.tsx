'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { AxiosError } from 'axios';
import { formatDateTime } from '@/utils/date.util';
import { useDashboard } from '@/hooks/use-dashboard';
import { 
  CompanyInfoCard, 
  DashboardMetrics, 
  UserProfileMenu,
  DashboardLayout 
} from '@/components/dashboard';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

/**
 * Dashboard Page Component - UC3.1, UC3.3
 * Displays user profile, company information, navigation structure, and metrics placeholders
 */
export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const tShared = useTranslations('shared');
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const { data, isLoading, error, refetch } = useDashboard();

  // Handle authentication errors - redirect to login
  useEffect(() => {
    if (error instanceof AxiosError) {
      const errorCode = error.response?.data?.code;
      // Strip "error." prefix if present (backend format: "error.ERROR_NAME")
      const strippedErrorCode = errorCode && typeof errorCode === 'string' && errorCode.startsWith('error.')
        ? errorCode.substring(6)
        : errorCode;
      
      if (strippedErrorCode === 'SESSION_EXPIRED' || strippedErrorCode === 'UNAUTHORIZED') {
        router.push('/login');
      }
    }
  }, [error, router]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="size-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">{t('loading.dashboard')}</p>
        </div>
      </div>
    );
  }

  // Error state (non-authentication errors)
  if (error && error instanceof AxiosError) {
    const errorCode = error.response?.data?.code;
    
    // Strip "error." prefix if present (backend format: "error.ERROR_NAME")
    const strippedErrorCode = errorCode && typeof errorCode === 'string' && errorCode.startsWith('error.')
      ? errorCode.substring(6)
      : errorCode;
    
    const errorMessage = strippedErrorCode
      ? t(`errors.${strippedErrorCode}`)
      : error.message.includes('Network')
      ? t('errors.NETWORK_ERROR')
      : t('errors.UNKNOWN_ERROR');

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full space-y-4">
          <Alert variant="destructive">
            <p className="font-medium">{errorMessage}</p>
          </Alert>
          <Button
            onClick={() => refetch()}
            className="w-full"
            variant="outline"
          >
            {t('actions.retry')}
          </Button>
        </div>
      </div>
    );
  }

  // Success state - render dashboard
  if (!data?.data) {
    return null;
  }

  const { user, company } = data.data;

  return (
    <DashboardLayout>
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 border-b border-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white drop-shadow-sm">
                {company.companyName}
              </h1>
              <p className="text-sm text-blue-100 mt-2">
                {t('page.description')}
              </p>
            </div>
            {/* User profile dropdown menu */}
            <div className="flex items-center gap-4">
              <UserProfileMenu user={user} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900">
            {user.fullName
              ? t('welcome.greeting', { name: user.fullName })
              : t('welcome.genericGreeting')}
          </h2>
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-medium">
              {tShared(`roles.${user.role.code}`)}
            </span>
            <span>{t('welcome.lastLogin', { date: formatDateTime(user.lastLoginAt, locale) })}</span>
          </div>
        </div>

        {/* Metrics Section - UC3.3 */}
        <div className="mb-8">
          <DashboardMetrics />
        </div>

        {/* Company Information Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CompanyInfoCard company={company} />

          {/* Placeholder for future sections */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {t('quickActions.title')}
            </h2>
            <p className="text-gray-500 text-sm">
              {t('metrics.comingSoon')}
            </p>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}
