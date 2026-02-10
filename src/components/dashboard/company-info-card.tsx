'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Building2, User, Mail, Phone, Calendar } from 'lucide-react';
import type { DashboardCompany } from '@/types';
import { formatDate } from '@/utils/date.util';

interface CompanyInfoCardProps {
  company: DashboardCompany;
}

/**
 * Company Information Card Component
 * Displays company details in a structured card layout
 */
export function CompanyInfoCard({ company }: CompanyInfoCardProps) {
  const t = useTranslations('dashboard');
  const params = useParams();
  const locale = params.locale as string;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <Building2 className="size-5 text-blue-600" />
        {t('companyInfo.title')}
      </h2>

      <div className="space-y-4">
        {/* Company Name */}
        <div className="flex items-start gap-3">
          <Building2 className="size-5 text-gray-400 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500">
              {t('companyInfo.fields.companyName')}
            </p>
            <p className="text-base text-gray-900 mt-1">{company.companyName}</p>
          </div>
        </div>

        {/* Owner Name */}
        <div className="flex items-start gap-3">
          <User className="size-5 text-gray-400 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500">
              {t('companyInfo.fields.ownerName')}
            </p>
            <p className="text-base text-gray-900 mt-1">{company.ownerFullName}</p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-start gap-3">
          <Mail className="size-5 text-gray-400 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500">
              {t('companyInfo.fields.email')}
            </p>
            <p className={`text-base text-gray-900 mt-1 break-all ${locale === 'fa' ? 'text-right' : 'text-left'}`} dir="ltr">
              {company.ownerEmail}
            </p>
          </div>
        </div>

        {/* Phone Number */}
        <div className="flex items-start gap-3">
          <Phone className="size-5 text-gray-400 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500">
              {t('companyInfo.fields.phone')}
            </p>
            <p className={`text-base text-gray-900 mt-1 ${locale === 'fa' ? 'text-right' : 'text-left'}`} dir="ltr">
              {company.ownerPhoneNumber || t('companyInfo.fields.noPhone')}
            </p>
          </div>
        </div>

        {/* Registration Date */}
        <div className="flex items-start gap-3">
          <Calendar className="size-5 text-gray-400 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500">
              {t('companyInfo.fields.registrationDate')}
            </p>
            <p className="text-base text-gray-900 mt-1">
              {formatDate(company.registrationDate, locale)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
