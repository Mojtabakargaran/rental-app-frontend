import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { authService } from '@/services/api/auth.service';
import type {
  ResetPasswordRequest,
  ResetPasswordSuccessResponse,
  ResetPasswordErrorResponse,
} from '@/types/auth.types';
import { AxiosError } from 'axios';

/**
 * Custom hook for reset password mutation
 * 
 * Completes password reset with new password using valid token.
 * All existing user sessions are invalidated on success.
 * 
 * @returns TanStack Query mutation result
 * 
 * @example
 * ```tsx
 * const { mutate, isSuccess, error } = useResetPassword();
 * 
 * const handleSubmit = (data: ResetPasswordRequest) => {
 *   mutate(data, {
 *     onSuccess: (response) => {
 *       // Redirect to login with success message
 *       router.push(response.data.redirectUrl);
 *     },
 *     onError: (error) => {
 *       // Handle error
 *     }
 *   });
 * };
 * ```
 */
export function useResetPassword(): UseMutationResult<
  ResetPasswordSuccessResponse,
  AxiosError<ResetPasswordErrorResponse>,
  ResetPasswordRequest
> {
  return useMutation({
    mutationKey: ['resetPassword'],
    mutationFn: (data: ResetPasswordRequest) => authService.resetPassword(data),
  });
}
