'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Package, Users, PackageCheck, UserCheck } from 'lucide-react';
import { useListEquipment } from '@/hooks/use-list-equipment';
import { useGetUsers } from '@/hooks/use-get-users';
import { Loader2 } from 'lucide-react';

/**
 * Dashboard Metrics Component - UC3.3
 * Displays metric cards with real data for equipment and users
 */
export function DashboardMetrics() {
  const t = useTranslations('dashboard');
  const params = useParams();
  const locale = params.locale as string;

  // Fetch total equipment count (all active statuses)
  const { data: equipmentData, isLoading: equipmentLoading } = useListEquipment({
    page: 1,
    limit: 1,
    status: ['Available', 'Rented', 'Maintenance'],
  });

  // Fetch total users count
  const { data: usersData, isLoading: usersLoading } = useGetUsers({
    page: 1,
    limit: 1,
    status: 'all',
  });

  const totalEquipment = equipmentData?.data?.total ?? 0;
  const totalUsers = usersData?.data?.pagination?.total ?? 0;

  const metrics = [
    {
      icon: Package,
      label: t('metrics.placeholders.totalEquipment'),
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      value: totalEquipment,
      isLoading: equipmentLoading,
    },
    {
      icon: Users,
      label: t('metrics.placeholders.totalUsers'),
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      value: totalUsers,
      isLoading: usersLoading,
    },
    {
      icon: PackageCheck,
      label: t('metrics.placeholders.availableEquipment'),
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      value: null,
      isLoading: false,
    },
    {
      icon: UserCheck,
      label: t('metrics.placeholders.totalCustomers'),
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      value: null,
      isLoading: false,
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        {t('metrics.title')}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-200 hover:shadow-md hover:scale-[1.02]"
          >
            <div className="flex items-center gap-4">
              <div className={`${metric.bgColor} p-3 rounded-lg`}>
                <metric.icon className={`size-6 ${metric.color}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">
                  {metric.label}
                </p>
                {metric.isLoading ? (
                  <div className="flex items-center gap-2 mt-1">
                    <Loader2 className="size-4 animate-spin text-gray-400" />
                  </div>
                ) : metric.value !== null ? (
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {metric.value.toLocaleString(locale === 'fa' ? 'fa-IR' : 'en-US')}
                  </p>
                ) : (
                  <p className="text-base text-gray-400 mt-1">
                    {t('metrics.comingSoon')}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
