'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useGetRoles } from '@/hooks/use-get-roles';
import { useUpdateUserRole } from '@/hooks/use-update-user-role';
import { updateUserRoleSchema, type UpdateUserRoleFormData } from '@/schemas/user-management.schema';
import { AxiosError } from 'axios';

interface ChangeRoleDialogProps {
  userId: string | null;
  userName: string;
  currentRoleCode: string;
  currentRoleName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

/**
 * Change Role Dialog Component - P4UC03
 * Allows company owners to change user roles
 */
export function ChangeRoleDialog({
  userId,
  userName,
  currentRoleCode,
  isOpen,
  onClose,
  onSuccess,
}: ChangeRoleDialogProps) {
  const t = useTranslations('user-management');
  const tShared = useTranslations('shared');

  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch available roles
  const { data: rolesData, isLoading: rolesLoading } = useGetRoles();

  // Update user role mutation
  const { mutate, isPending, isSuccess, error } = useUpdateUserRole(userId || '');

  // Form setup
  const {
    setValue,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm<UpdateUserRoleFormData>({
    resolver: zodResolver(updateUserRoleSchema),
    defaultValues: {
      roleCode: currentRoleCode,
    },
  });

  const selectedRoleCode = watch('roleCode');

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      setValue('roleCode', currentRoleCode);
      setShowSuccess(false);
    }
  }, [isOpen, currentRoleCode, setValue]);

  // Handle success
  useEffect(() => {
    if (isSuccess) {
      setShowSuccess(true);
      onSuccess?.();
      // Close dialog after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  }, [isSuccess, onClose, onSuccess]);

  const onSubmit = (data: UpdateUserRoleFormData) => {
    if (!userId) return;
    mutate(data);
  };

  const errorCode = error instanceof AxiosError
    ? error.response?.data?.code
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('roleUpdate.dialogTitle')}</DialogTitle>
          <DialogDescription>
            {t('roleUpdate.dialogDescription', { name: userName })}
          </DialogDescription>
        </DialogHeader>

        {/* Success Message */}
        {showSuccess && (
          <Alert variant="success">
            <p className="font-medium">
              {t('success.roleUpdated', { name: userName })}
            </p>
          </Alert>
        )}

        {/* Error Message */}
        {error && !showSuccess && (
          <Alert variant="destructive">
            <p className="font-medium">
              {strippedErrorCode ? t(`errors.${strippedErrorCode}`) : t('errors.GENERIC_ERROR')}
            </p>
          </Alert>
        )}

        {/* Roles Loading State */}
        {rolesLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            <span className="ms-3 text-gray-600">{tShared('common.loading')}</span>
          </div>
        )}

        {/* Form */}
        {!rolesLoading && rolesData && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Current Role */}
            {currentRoleCode && (
              <div className="space-y-2">
                <Label>{t('roleUpdate.currentRole')}</Label>
                <div className="flex items-center gap-2">
                  <Badge variant={getRoleBadgeVariant(currentRoleCode)}>
                    {tShared(`roles.${currentRoleCode}`)}
                  </Badge>
                </div>
              </div>
            )}

            {/* New Role Selection */}
            <div className="space-y-2">
              <Label htmlFor="roleCode">
                {t('roleUpdate.newRole')}
                <span className="text-red-500 ms-1">*</span>
              </Label>
              <Select
                value={selectedRoleCode}
                onValueChange={(value) => setValue('roleCode', value)}
                disabled={isPending || showSuccess}
              >
                <SelectTrigger
                  id="roleCode"
                  className={errors.roleCode ? 'border-red-500' : ''}
                >
                  <SelectValue placeholder={t('roleUpdate.selectRole')} />
                </SelectTrigger>
                <SelectContent>
                  {rolesData.data.roles
                    .filter((role) => role.code !== 'COMPANY_OWNER') // Don't allow assigning company owner role
                    .map((role) => (
                      <SelectItem key={role.id} value={role.code}>
                        <div className="flex items-center gap-2">
                          <span>{tShared(`roles.${role.code}`)}</span>
                          {role.code === currentRoleCode && (
                            <span className="text-xs text-gray-500">
                              ({t('roleUpdate.currentRole')})
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {errors.roleCode && (
                <p className="text-sm text-red-600">
                  {t(errors.roleCode.message as `${string}`)}
                </p>
              )}
            </div>

            <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isPending || showSuccess}
                className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700"
              >
                {t('roleUpdate.buttons.cancel')}
              </Button>
              <Button
                type="submit"
                disabled={
                  isPending ||
                  showSuccess ||
                  selectedRoleCode === currentRoleCode ||
                  !selectedRoleCode
                }
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isPending ? (
                  <>
                    <Loader2 className="me-2 h-4 w-4 animate-spin" />
                    {t('roleUpdate.buttons.saving')}
                  </>
                ) : (
                  t('roleUpdate.buttons.save')
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
