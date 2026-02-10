import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userManagementService } from '@/services/api/user-management.service';
import type { AxiosError } from 'axios';
import type {
  ReactivateUserSuccessResponse,
  UserManagementErrorResponse,
} from '@/types/user-management.types';

/**
 * Hook for reactivating a user account - P4UC05
 * @param userId - User ID to reactivate
 * @returns TanStack Query mutation result
 */
export function useReactivateUser(userId: string) {
  const queryClient = useQueryClient();

  return useMutation<
    ReactivateUserSuccessResponse,
    AxiosError<UserManagementErrorResponse>,
    void
  >({
    mutationKey: ['reactivateUser', userId],
    mutationFn: () => userManagementService.reactivateUser(userId),
    retry: false,
    onSuccess: () => {
      // Invalidate user list and details to refresh UI
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['userDetails', userId] });
    },
  });
}
