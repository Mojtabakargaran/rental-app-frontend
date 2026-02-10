'use client';

import { useTranslations } from 'next-intl';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useGetRoles } from '@/hooks/use-get-roles';

interface UserListFiltersProps {
  status: 'all' | 'active' | 'inactive';
  roleCode: string;
  onStatusChange: (status: 'all' | 'active' | 'inactive') => void;
  onRoleChange: (roleCode: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

/**
 * User List Filters Component - P4UC02
 * Displays filter dropdowns for status and role
 */
export function UserListFilters({
  status,
  roleCode,
  onStatusChange,
  onRoleChange,
  onClearFilters,
  hasActiveFilters,
}: UserListFiltersProps) {
  const t = useTranslations('user-management');
  const tShared = useTranslations('shared');
  const { data: rolesData } = useGetRoles();

  const statusOptions = [
    { value: 'all', label: t('list.filters.status.all') },
    { value: 'active', label: t('list.filters.status.active') },
    { value: 'inactive', label: t('list.filters.status.inactive') },
  ];

  const roleOptions = rolesData?.data.roles.filter(
    (role) => role.code !== 'COMPANY_OWNER'
  ) || [];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Status Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 me-2" />
            {t('list.filters.status.label')}
            {status !== 'all' && (
              <Badge variant="default" className="ms-2">
                1
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{t('list.filters.status.label')}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={status} onValueChange={(value) => onStatusChange(value as 'all' | 'active' | 'inactive')}>
            {statusOptions.map((option) => (
              <DropdownMenuRadioItem key={option.value} value={option.value}>
                {option.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Role Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 me-2" />
            {t('list.filters.role.label')}
            {roleCode && (
              <Badge variant="default" className="ms-2">
                1
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{t('list.filters.role.label')}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={roleCode} onValueChange={onRoleChange}>
            <DropdownMenuRadioItem value="">
              {t('list.filters.role.all')}
            </DropdownMenuRadioItem>
            {roleOptions.map((role) => (
              <DropdownMenuRadioItem key={role.code} value={role.code}>
                {tShared(`roles.${role.code}`)}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClearFilters}
          className="text-red-600 hover:text-red-700"
        >
          <X className="h-4 w-4 me-1" />
          {t('list.filters.clearAll')}
        </Button>
      )}
    </div>
  );
}
