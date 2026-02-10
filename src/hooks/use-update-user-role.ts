import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userManagementService } from '@/services/api/user-management.service';
import type { AxiosError } from 'axios';
import type {
  UpdateUserRoleRequest,
  UpdateUserRoleSuccessResponse,
  UserManagementErrorResponse,
} from '@/types/user-management.types';

/**
 * TanStack Query mutation hook for updating user role - P4UC03
 * Uses mutationKey: ['updateUserRole', userId], no retry
 * Invalidates 'users' and 'userDetails' queries on success
 */
export function useUpdateUserRole(userId: string) {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateUserRoleSuccessResponse,
    AxiosError<UserManagementErrorResponse>,
    UpdateUserRoleRequest
  >({
    mutationKey: ['updateUserRole', userId],
    mutationFn: (data: UpdateUserRoleRequest) =>
      userManagementService.updateUserRole(userId, data),
    retry: false,
    onSuccess: () => {
      // Invalidate user list to refresh role changes
      queryClient.invalidateQueries({ queryKey: ['users'] });
      // Invalidate user details to show updated role
      queryClient.invalidateQueries({ queryKey: ['userDetails', userId] });
    },
  });
}
