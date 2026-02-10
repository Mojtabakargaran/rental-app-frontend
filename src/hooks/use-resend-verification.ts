import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { authService } from '@/services/api/auth.service';
import type {
  ResendVerificationRequest,
  ResendVerificationSuccessResponse,
  ResendVerificationErrorResponse,
} from '@/types/auth.types';
import { AxiosError } from 'axios';

/**
 * Custom hook for resending verification email
 * 
 * Uses TanStack Query mutation with stable mutation key for proper state management
 * 
 * @returns Mutation result with mutate function, loading state, and error handling
 * 
 * @example
 * ```tsx
 * const { mutate, isSuccess, isPending, error } = useResendVerification();
 * 
 * const handleSubmit = (data: ResendVerificationFormData) => {
 *   mutate(data, {
 *     onSuccess: (response) => {
 *       // Handle success
 *     },
 *     onError: (error) => {
 *       // Handle error
 *     }
 *   });
 * };
 * ```
 */
export function useResendVerification(): UseMutationResult<
  ResendVerificationSuccessResponse,
  AxiosError<ResendVerificationErrorResponse>,
  ResendVerificationRequest
> {
  return useMutation({
    mutationKey: ['resendVerification'],
    mutationFn: (data: ResendVerificationRequest) =>
      authService.resendVerification(data),
    retry: false, // Don't retry on error
  });
}
