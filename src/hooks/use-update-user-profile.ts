import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { userManagementService } from '@/services/api/user-management.service';
import type {
  UpdateUserProfileRequest,
  UpdateUserProfileSuccessResponse,
  UserManagementErrorResponse,
} from '@/types/user-management.types';

/**
 * Hook for updating user profile information - P4UC04
 * @returns TanStack Query mutation for updating user profile
 */
export function useUpdateUserProfile(userId: string) {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateUserProfileSuccessResponse,
    AxiosError<UserManagementErrorResponse>,
    UpdateUserProfileRequest
  >({
    mutationFn: (data) => userManagementService.updateUserProfile(userId, data),
    onSuccess: () => {
      // Invalidate user details query to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['userDetails', userId] });
      // Invalidate user list query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    retry: 1,
  });
}
