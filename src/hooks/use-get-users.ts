import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { userManagementService } from '@/services/api';
import type {
  GetUsersParams,
  GetUsersSuccessResponse,
  UserManagementErrorResponse,
} from '@/types/user-management.types';

/**
 * Hook for fetching paginated user list with filters - P4UC02
 * @param params - Query parameters for filtering and pagination
 * @returns TanStack Query result
 */
export function useGetUsers(
  params?: GetUsersParams
): UseQueryResult<GetUsersSuccessResponse, AxiosError<UserManagementErrorResponse>> {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => userManagementService.getUsers(params),
    staleTime: 30000, // 30 seconds cache per performance notes
    retry: 1,
  });
}
