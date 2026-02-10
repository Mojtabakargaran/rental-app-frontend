'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Loader2, Mail, Phone, Globe, Calendar, Clock, Key } from 'lucide-react';
import { formatDateTime } from '@/utils/date.util';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert } from '@/components/ui/alert';
import { useGetUserDetails } from '@/hooks/use-get-user-details';
import { ChangeRoleDialog } from './change-role-dialog';
import { EditUserProfileDialog } from './edit-user-profile-dialog';
import { DeactivateUserDialog } from './deactivate-user-dialog';
import { ReactivateUserDialog } from './reactivate-user-dialog';
import type { AxiosError } from 'axios';
import type { UserManagementErrorResponse } from '@/types/user-management.types';

interface UserDetailsModalProps {
  userId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * User Details Modal Component - P4UC02, P4UC03, P4UC04, P4UC05
 * Displays detailed user information in a modal with role change, profile edit, and account status management
 */
export function UserDetailsModal({ userId, isOpen, onClose }: UserDetailsModalProps) {
  const t = useTranslations('user-management');
  const tShared = useTranslations('shared');
  const params = useParams();
  const locale = params.locale as string;

  const [isChangeRoleOpen, setIsChangeRoleOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isDeactivateOpen, setIsDeactivateOpen] = useState(false);
  const [isReactivateOpen, setIsReactivateOpen] = useState(false);

  const { data, isLoading, error, refetch } = useGetUserDetails(userId, isOpen);

  const errorCode = error instanceof Error
    ? (error as AxiosError<UserManagementErrorResponse>).response?.data?.code
    : null;
  
  // Strip "error." prefix if present (backend format: "error.ERROR_NAME")
  const strippedErrorCode = errorCode && typeof errorCode === 'string' && errorCode.startsWith('error.')
    ? errorCode.substring(6)
    : errorCode;

  const getRoleBadgeVariant = (
    roleCode: string
  ): 'default' | 'companyOwner' | 'manager' | 'staff' | 'maintenance' | 'readOnly' => {
    const roleMap: Record<
      string,
      'default' | 'companyOwner' | 'manager' | 'staff' | 'maintenance' | 'readOnly'
    > = {
      COMPANY_OWNER: 'companyOwner',
      MANAGER: 'manager',
      STAFF: 'staff',
      MAINTENANCE: 'maintenance',
      READ_ONLY: 'readOnly',
    };
    return roleMap[roleCode] || 'default';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('details.title')}</DialogTitle>
        </DialogHeader>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ms-3 text-gray-600">{tShared('common.loading')}</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Alert variant="destructive">
            <p className="font-medium">
              {strippedErrorCode ? t(`errors.${strippedErrorCode}`) : t('errors.GENERIC_ERROR')}
            </p>
          </Alert>
        )}

        {/* User Details */}
        {!isLoading && !error && data && (
          <div className="space-y-6">
            {/* Profile Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t('details.sections.profile')}
              </h3>
              <div className="space-y-4">
                {/* Avatar and Name */}
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl">
                    {data.data.user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900">
                      {data.data.user.fullName}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={getRoleBadgeVariant(data.data.user.role.code)}>
                        {tShared(`roles.${data.data.user.role.code}`)}
                      </Badge>
                      <Badge variant={data.data.user.isActive ? 'active' : 'inactive'}>
                        {data.data.user.isActive
                          ? t('list.table.status.active')
                          : t('list.table.status.inactive')}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        {t('details.fields.email')}
                      </p>
                      <p className="text-sm text-gray-900">{data.data.user.email}</p>
                      {data.data.user.emailVerifiedAt && (
                        <p className="text-xs text-emerald-600 mt-1">
                          {t('list.table.status.verified')}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        {t('details.fields.phoneNumber')}
                      </p>
                      <p className="text-sm text-gray-900">
                        {data.data.user.phoneNumber || t('details.placeholders.notProvided')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Globe className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        {t('details.fields.language')}
                      </p>
                      <p className="text-sm text-gray-900">
                        {data.data.user.languagePreference === 'en' ? 'English' : 'فارسی'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Role Description */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    {t('details.fields.role')}
                  </p>
                  <p className="text-sm text-gray-600">
                    {tShared(`roleDescriptions.${data.data.user.role.code}`)}
                  </p>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t('details.sections.account')}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500">
                      {t('details.fields.createdAt')}
                    </p>
                    <p className="text-sm text-gray-900">
                      {formatDateTime(data.data.user.createdAt, locale, t('details.placeholders.never'))}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500">
                      {t('details.fields.updatedAt')}
                    </p>
                    <p className="text-sm text-gray-900">
                      {formatDateTime(data.data.user.updatedAt, locale, t('details.placeholders.never'))}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Key className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500">
                      {t('details.fields.passwordChangedAt')}
                    </p>
                    <p className="text-sm text-gray-900">
                      {formatDateTime(data.data.user.passwordChangedAt, locale, t('details.placeholders.never'))}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700"
          >
            {t('details.actions.close')}
          </Button>
          {data && (
            <Button
              onClick={() => setIsEditProfileOpen(true)}
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              {t('details.actions.edit')}
            </Button>
          )}
          {data && (
            <Button
              onClick={() => setIsChangeRoleOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {t('details.actions.changeRole')}
            </Button>
          )}
          {data && (
            <Button
              onClick={() => {
                if (data.data.user.isActive) {
                  setIsDeactivateOpen(true);
                } else {
                  setIsReactivateOpen(true);
                }
              }}
              variant={data.data.user.isActive ? 'destructive' : 'default'}
            >
              {data.data.user.isActive
                ? t('details.actions.deactivate')
                : t('details.actions.activate')}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>

      {/* Edit Profile Dialog - P4UC04 */}
      {data && (
        <EditUserProfileDialog
          user={data.data.user}
          isOpen={isEditProfileOpen}
          onClose={() => setIsEditProfileOpen(false)}
          onSuccess={() => {
            refetch(); // Refresh user details after profile update
          }}
        />
      )}

      {/* Change Role Dialog - P4UC03 */}
      {data && (
        <ChangeRoleDialog
          userId={userId}
          userName={data.data.user.fullName}
          currentRoleCode={data.data.user.role.code}
          currentRoleName={data.data.user.role.name}
          isOpen={isChangeRoleOpen}
          onClose={() => setIsChangeRoleOpen(false)}
          onSuccess={() => {
            refetch(); // Refresh user details after role change
          }}
        />
      )}

      {/* Deactivate User Dialog - P4UC05 */}
      {data && (
        <DeactivateUserDialog
          userId={userId!}
          userName={data.data.user.fullName}
          isOpen={isDeactivateOpen}
          onClose={() => setIsDeactivateOpen(false)}
          onSuccess={() => {
            refetch(); // Refresh user details after deactivation
          }}
        />
      )}

      {/* Reactivate User Dialog - P4UC05 */}
      {data && (
        <ReactivateUserDialog
          userId={userId!}
          userName={data.data.user.fullName}
          isOpen={isReactivateOpen}
          onClose={() => setIsReactivateOpen(false)}
          onSuccess={() => {
            refetch(); // Refresh user details after reactivation
          }}
        />
      )}
    </Dialog>
  );
}
