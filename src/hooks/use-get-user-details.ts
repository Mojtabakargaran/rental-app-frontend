import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { userManagementService } from '@/services/api';
import type {
  GetUserDetailsSuccessResponse,
  UserManagementErrorResponse,
} from '@/types/user-management.types';

/**
 * Hook for fetching user details - P4UC02
 * @param userId - User ID to fetch details for
 * @param enabled - Whether the query should run
 * @returns TanStack Query result
 */
export function useGetUserDetails(
  userId: string | null,
  enabled: boolean = true
): UseQueryResult<GetUserDetailsSuccessResponse, AxiosError<UserManagementErrorResponse>> {
  return useQuery({
    queryKey: ['userDetails', userId],
    queryFn: () => userManagementService.getUserDetails(userId!),
    enabled: enabled && !!userId,
    staleTime: 300000, // 5 minutes
    retry: 1,
  });
}
