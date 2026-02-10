import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userManagementService } from '@/services/api/user-management.service';
import type { AxiosError } from 'axios';
import type {
  DeactivateUserRequest,
  DeactivateUserSuccessResponse,
  UserManagementErrorResponse,
} from '@/types/user-management.types';

/**
 * Hook for deactivating a user account - P4UC05
 * @param userId - User ID to deactivate
 * @returns TanStack Query mutation result
 */
export function useDeactivateUser(userId: string) {
  const queryClient = useQueryClient();

  return useMutation<
    DeactivateUserSuccessResponse,
    AxiosError<UserManagementErrorResponse>,
    DeactivateUserRequest | undefined
  >({
    mutationKey: ['deactivateUser', userId],
    mutationFn: (data) => userManagementService.deactivateUser(userId, data),
    retry: false,
    onSuccess: () => {
      // Invalidate user list and details to refresh UI
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['userDetails', userId] });
    },
  });
}
