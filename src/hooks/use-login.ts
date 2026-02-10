import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { authService } from '@/services/api';
import type {
  LoginRequest,
  LoginSuccessResponse,
  LoginErrorResponse,
} from '@/types/auth.types';
import { AxiosError } from 'axios';

/**
 * Custom hook for user login mutation
 * 
 * Uses TanStack Query mutation for authentication state management
 * Automatically handles loading, error, and success states
 * 
 * @returns UseMutationResult for login operation
 * 
 * @example
 * ```tsx
 * const { mutate: login, isPending, isSuccess, error } = useLogin();
 * 
 * const handleSubmit = (data: LoginFormData) => {
 *   login(data, {
 *     onSuccess: (response) => {
 *       // Store auth state, redirect to dashboard
 *     },
 *     onError: (error) => {
 *       // Handle specific error codes
 *     }
 *   });
 * };
 * ```
 */
export function useLogin(): UseMutationResult<
  LoginSuccessResponse,
  AxiosError<LoginErrorResponse>,
  LoginRequest
> {
  return useMutation({
    mutationKey: ['login'],
    mutationFn: (data: LoginRequest) => authService.login(data),
  });
}
