import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { authService } from '@/services/api/auth.service';
import type {
  ChangePasswordFirstLoginRequest,
  ChangePasswordFirstLoginSuccessResponse,
  ChangePasswordFirstLoginErrorResponse,
} from '@/types/auth.types';
import { AxiosError } from 'axios';

/**
 * Custom hook for changing temporary password on first login (P4UC06)
 * 
 * Note: Requires valid temporary session token from first login attempt.
 * After successful password change, temporary session is upgraded to full session.
 * 
 * @returns TanStack Query mutation result
 */
export function useChangePasswordFirstLogin(): UseMutationResult<
  ChangePasswordFirstLoginSuccessResponse,
  AxiosError<ChangePasswordFirstLoginErrorResponse>,
  ChangePasswordFirstLoginRequest
> {
  return useMutation({
    mutationFn: (data: ChangePasswordFirstLoginRequest) =>
      authService.changePasswordFirstLogin(data),
  });
}
