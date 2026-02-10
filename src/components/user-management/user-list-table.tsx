'use client';

import { useTranslations } from 'next-intl';
import { Eye, MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { UserListItem } from '@/types/user-management.types';

interface UserListTableProps {
  users: UserListItem[];
  onViewDetails: (userId: string) => void;
  onEdit?: (user: UserListItem) => void;
  onChangeRole?: (user: UserListItem) => void;
  onToggleActive?: (user: UserListItem) => void;
}

/**
 * User List Table Component - P4UC02
 * Displays users in a table format with actions
 */
export function UserListTable({ users, onViewDetails, onEdit, onChangeRole, onToggleActive }: UserListTableProps) {
  const t = useTranslations('user-management');
  const tShared = useTranslations('shared');

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
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th scope="col" className="px-4 py-3 text-start text-gray-900 font-medium">
              {t('list.table.columns.user')}
            </th>
            <th scope="col" className="px-4 py-3 text-start text-gray-900 font-medium">
              {t('list.table.columns.contact')}
            </th>
            <th scope="col" className="px-4 py-3 text-start text-gray-900 font-medium">
              {t('list.table.columns.role')}
            </th>
            <th scope="col" className="px-4 py-3 text-start text-gray-900 font-medium">
              {t('list.table.columns.status')}
            </th>
            <th scope="col" className="px-4 py-3 text-start text-gray-900 font-medium">
              {t('list.table.columns.actions')}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr
              key={user.id}
              className="hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => onViewDetails(user.id)}
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{user.fullName}</div>
                    <div className="text-sm text-gray-500">
                      {user.emailVerifiedAt ? (
                        <span className="text-emerald-600">{t('list.table.status.verified')}</span>
                      ) : (
                        <span className="text-gray-400">{t('list.table.status.notVerified')}</span>
                      )}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="text-sm text-gray-700">{user.email}</div>
                {user.phoneNumber && (
                  <div className="text-sm text-gray-500">{user.phoneNumber}</div>
                )}
              </td>
              <td className="px-4 py-3">
                <Badge variant={getRoleBadgeVariant(user.role.code)}>
                  {tShared(`roles.${user.role.code}`)}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <Badge variant={user.isActive ? 'active' : 'inactive'}>
                  {user.isActive
                    ? t('list.table.status.active')
                    : t('list.table.status.inactive')}
                </Badge>
              </td>
              <td className="px-4 py-3 text-start">
                <div className="flex items-center justify-start gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDetails(user.id);
                    }}
                  >
                    <Eye className="h-4 w-4 me-1" />
                    {t('list.table.actions.viewDetails')}
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit?.(user);
                        }}
                      >
                        {t('list.table.actions.edit')}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          onChangeRole?.(user);
                        }}
                      >
                        {t('list.table.actions.changeRole')}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleActive?.(user);
                        }}
                      >
                        {user.isActive
                          ? t('list.table.actions.deactivate')
                          : t('list.table.actions.activate')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
