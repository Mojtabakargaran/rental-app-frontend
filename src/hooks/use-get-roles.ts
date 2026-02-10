import { useQuery } from '@tanstack/react-query';
import { userManagementService } from '@/services/api';
import type { GetRolesSuccessResponse } from '@/types/user-management.types';

/**
 * Hook to fetch available roles for user assignment - P4UC01
 */
export function useGetRoles() {
  return useQuery<GetRolesSuccessResponse>({
    queryKey: ['roles'],
    queryFn: () => userManagementService.getRoles(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}
