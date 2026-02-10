import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { authService } from '@/services/api/auth.service';
import type {
  LogoutSuccessResponse,
  LogoutErrorResponse,
} from '@/types/auth.types';

/**
 * Custom hook for user logout (UC3.4)
 * 
 * Handles logout mutation with automatic client-side cleanup
 * Always succeeds even if backend fails to ensure user can log out
 * 
 * @returns TanStack Query mutation result
 * 
 * @example
 * ```tsx
 * const { mutate: logout, isPending } = useLogout();
 * 
 * const handleLogout = () => {
 *   logout(undefined, {
 *     onSuccess: (data) => {
 *       // Clear client state
 *       // Redirect to login
 *     }
 *   });
 * };
 * ```
 */
export function useLogout(): UseMutationResult<
  LogoutSuccessResponse,
  AxiosError<LogoutErrorResponse>,
  void
> {
  return useMutation({
    mutationKey: ['logout'],
    mutationFn: async () => {
      return await authService.logout();
    },
    // No retry - logout should be immediate
    retry: false,
    // Network timeout for logout
    networkMode: 'always', // Always attempt logout, even offline
  });
}
