import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { authService } from '@/services/api/auth.service';
import type {
  ValidateResetTokenSuccessResponse,
  ValidateResetTokenErrorResponse,
} from '@/types/auth.types';
import { AxiosError } from 'axios';

/**
 * Custom hook for validating password reset token
 * 
 * Automatically fetches token validation on component mount when enabled and token exists.
 * Used on reset password page to verify token before showing form.
 * 
 * @param token - Password reset token from URL query parameter
 * @param enabled - Whether to enable automatic fetching (default: true)
 * @returns TanStack Query result with token validation status
 * 
 * @example
 * ```tsx
 * const token = searchParams.get('token');
 * const { data, isLoading, error } = useValidateResetToken(token);
 * 
 * if (isLoading) return <Spinner />;
 * if (error) return <ErrorMessage error={error} />;
 * if (data?.data.valid) return <ResetPasswordForm token={token} />;
 * ```
 */
export function useValidateResetToken(
  token: string | null,
  enabled: boolean = true
): UseQueryResult<
  ValidateResetTokenSuccessResponse,
  AxiosError<ValidateResetTokenErrorResponse>
> {
  return useQuery({
    queryKey: ['validateResetToken', token],
    queryFn: () => {
      if (!token) {
        throw new Error('Token is required');
      }
      return authService.validateResetToken(token);
    },
    enabled: enabled && !!token, // Only fetch if enabled and token exists
    retry: false, // Single-use token, don't retry
    staleTime: Infinity, // Token validation is one-time, never refetch
  });
}
