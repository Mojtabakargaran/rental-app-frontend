import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { authService } from '@/services/api/auth.service';
import type {
  ForgotPasswordRequest,
  ForgotPasswordSuccessResponse,
  ForgotPasswordErrorResponse,
} from '@/types/auth.types';
import { AxiosError } from 'axios';

/**
 * Custom hook for forgot password mutation
 * 
 * Sends password reset link to user's email address.
 * Returns generic success message to prevent email enumeration.
 * 
 * @returns TanStack Query mutation result
 * 
 * @example
 * ```tsx
 * const { mutate, isSuccess, error } = useForgotPassword();
 * 
 * const handleSubmit = (data: ForgotPasswordRequest) => {
 *   mutate(data, {
 *     onSuccess: (response) => {
 *       // Show success message
 *     },
 *     onError: (error) => {
 *       // Handle error
 *     }
 *   });
 * };
 * ```
 */
export function useForgotPassword(): UseMutationResult<
  ForgotPasswordSuccessResponse,
  AxiosError<ForgotPasswordErrorResponse>,
  ForgotPasswordRequest
> {
  return useMutation({
    mutationKey: ['forgotPassword'],
    mutationFn: (data: ForgotPasswordRequest) => authService.forgotPassword(data),
  });
}
