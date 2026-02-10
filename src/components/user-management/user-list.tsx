'use client';

import { useState, useMemo, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, UserPlus, Loader2 } from 'lucide-react';
import { useGetUsers } from '@/hooks/use-get-users';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/alert';
import { UserListTable } from './user-list-table';
import { UserListPagination } from './user-list-pagination';
import { UserListFilters } from './user-list-filters';
import { UserDetailsModal } from './user-details-modal';
import { UserListEmpty } from './user-list-empty';
import { EditUserProfileDialog } from './edit-user-profile-dialog';
import { ChangeRoleDialog } from './change-role-dialog';
import { DeactivateUserDialog } from './deactivate-user-dialog';
import { ReactivateUserDialog } from './reactivate-user-dialog';
import type { AxiosError } from 'axios';
import type { UserManagementErrorResponse, UserListItem } from '@/types/user-management.types';

/**
 * User List Component - P4UC02
 * Main component for displaying and managing user list
 */
export function UserList() {
  const t = useTranslations('user-management');
  const tShared = useTranslations('shared');
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL-synced state
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [status, setStatus] = useState<'all' | 'active' | 'inactive'>(
    (searchParams.get('status') as 'all' | 'active' | 'inactive') || 'all'
  );
  const [roleCode, setRoleCode] = useState(searchParams.get('roleCode') || '');
  
  // Local state
  const [searchInput, setSearchInput] = useState(search);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
  // Dialog states
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<UserListItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUserForRole, setSelectedUserForRole] = useState<UserListItem | null>(null);
  const [isChangeRoleDialogOpen, setIsChangeRoleDialogOpen] = useState(false);
  const [selectedUserForToggle, setSelectedUserForToggle] = useState<UserListItem | null>(null);
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
  const [isReactivateDialogOpen, setIsReactivateDialogOpen] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1); // Reset to first page on search
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Build query params
  const queryParams = useMemo(() => {
    const params: Record<string, string | number> = { page, limit: 50 };
    if (search && search.length >= 2) params.search = search;
    if (status !== 'all') params.status = status;
    if (roleCode) params.roleCode = roleCode;
    return params;
  }, [page, search, status, roleCode]);

  // Sync URL with state
  useEffect(() => {
    const params = new URLSearchParams();
    if (page > 1) params.set('page', page.toString());
    if (search) params.set('search', search);
    if (status !== 'all') params.set('status', status);
    if (roleCode) params.set('roleCode', roleCode);
    
    const newUrl = params.toString() ? `?${params.toString()}` : '';
    router.replace(newUrl, { scroll: false });
  }, [page, search, status, roleCode, router]);

  // Fetch users
  const { data, isLoading, error, refetch } = useGetUsers(queryParams);

  // Handle filter changes
  const handleStatusChange = (newStatus: 'all' | 'active' | 'inactive') => {
    setStatus(newStatus);
    setPage(1);
  };

  const handleRoleChange = (newRoleCode: string) => {
    setRoleCode(newRoleCode);
    setPage(1);
  };

  const handleClearFilters = () => {
    setStatus('all');
    setRoleCode('');
    setSearchInput('');
    setSearch('');
    setPage(1);
  };

  const handleViewDetails = (userId: string) => {
    setSelectedUserId(userId);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsModalOpen(false);
    setSelectedUserId(null);
  };

  const handleEdit = (user: UserListItem) => {
    setSelectedUserForEdit(user);
    setIsEditDialogOpen(true);
  };

  const handleChangeRole = (user: UserListItem) => {
    setSelectedUserForRole(user);
    setIsChangeRoleDialogOpen(true);
  };

  const handleToggleActive = (user: UserListItem) => {
    setSelectedUserForToggle(user);
    if (user.isActive) {
      setIsDeactivateDialogOpen(true);
    } else {
      setIsReactivateDialogOpen(true);
    }
  };

  const handleDialogSuccess = () => {
    refetch();
  };

  // Error handling
  const errorCode = error instanceof Error
    ? (error as AxiosError<UserManagementErrorResponse>).response?.data?.code
    : null;
  
  // Strip "error." prefix if present (backend format: "error.ERROR_NAME")
  const strippedErrorCode = errorCode && typeof errorCode === 'string' && errorCode.startsWith('error.')
    ? errorCode.substring(6)
    : errorCode;

  const hasActiveFilters = status !== 'all' || !!roleCode || !!search;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white drop-shadow-sm">{t('listPageTitle')}</h1>
            <p className="mt-2 text-sm text-blue-100">{t('listPageDescription')}</p>
          </div>
          <Button
            onClick={() => router.push('/user-management/create')}
            className="bg-white hover:bg-gray-100 text-blue-700 font-medium px-5 py-2.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 shadow-sm"
          >
            <UserPlus className="h-4 w-4 me-2" />
            {t('list.createButton')}
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder={t('list.searchPlaceholder')}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full px-4 py-2 ps-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <UserListFilters
          status={status}
          roleCode={roleCode}
          onStatusChange={handleStatusChange}
          onRoleChange={handleRoleChange}
          onClearFilters={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      {/* Search results indicator */}
      {search && data && (
        <p className="text-sm text-gray-600">
          {t('list.searchResults', { count: data.data.pagination.total, query: search })}
        </p>
      )}

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <p className="font-medium">
            {strippedErrorCode ? t(`errors.${strippedErrorCode}`) : t('errors.GENERIC_ERROR')}
          </p>
          <Button
            onClick={() => refetch()}
            variant="outline"
            size="sm"
            className="mt-2"
          >
            {tShared('common.retry')}
          </Button>
        </Alert>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ms-3 text-gray-600">{t('list.loading')}</span>
        </div>
      )}

      {/* User List */}
      {!isLoading && !error && data && (
        <>
          {data.data.users.length > 0 ? (
            <>
              <UserListTable
                users={data.data.users}
                onViewDetails={handleViewDetails}
                onEdit={handleEdit}
                onChangeRole={handleChangeRole}
                onToggleActive={handleToggleActive}
              />
              <UserListPagination
                pagination={data.data.pagination}
                onPageChange={setPage}
              />
            </>
          ) : (
            <UserListEmpty
              hasFilters={hasActiveFilters}
              searchQuery={search}
              onClearFilters={handleClearFilters}
              onCreateUser={() => router.push('/user-management/create')}
            />
          )}
        </>
      )}

      {/* User Details Modal */}
      <UserDetailsModal
        userId={selectedUserId}
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetails}
      />

      {/* Edit User Profile Dialog */}
      <EditUserProfileDialog
        user={selectedUserForEdit ? {
          id: selectedUserForEdit.id,
          fullName: selectedUserForEdit.fullName,
          email: selectedUserForEdit.email,
          phoneNumber: selectedUserForEdit.phoneNumber,
          role: {
            ...selectedUserForEdit.role,
            description: null,
          },
          isActive: selectedUserForEdit.isActive,
          emailVerifiedAt: selectedUserForEdit.emailVerifiedAt,
          passwordChangedAt: null,
          languagePreference: 'en', // Default, will be fetched if needed
          createdAt: selectedUserForEdit.createdAt,
          updatedAt: new Date().toISOString(),
        } : null}
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setSelectedUserForEdit(null);
        }}
        onSuccess={handleDialogSuccess}
      />

      {/* Change Role Dialog */}
      <ChangeRoleDialog
        userId={selectedUserForRole?.id || null}
        userName={selectedUserForRole?.fullName || ''}
        currentRoleCode={selectedUserForRole?.role.code || ''}
        currentRoleName={selectedUserForRole?.role.name || ''}
        isOpen={isChangeRoleDialogOpen}
        onClose={() => {
          setIsChangeRoleDialogOpen(false);
          setSelectedUserForRole(null);
        }}
        onSuccess={handleDialogSuccess}
      />

      {/* Deactivate User Dialog */}
      <DeactivateUserDialog
        userId={selectedUserForToggle?.id || ''}
        userName={selectedUserForToggle?.fullName || ''}
        isOpen={isDeactivateDialogOpen}
        onClose={() => {
          setIsDeactivateDialogOpen(false);
          setSelectedUserForToggle(null);
        }}
        onSuccess={handleDialogSuccess}
      />

      {/* Reactivate User Dialog */}
      <ReactivateUserDialog
        userId={selectedUserForToggle?.id || ''}
        userName={selectedUserForToggle?.fullName || ''}
        isOpen={isReactivateDialogOpen}
        onClose={() => {
          setIsReactivateDialogOpen(false);
          setSelectedUserForToggle(null);
        }}
        onSuccess={handleDialogSuccess}
      />
    </div>
  );
}
