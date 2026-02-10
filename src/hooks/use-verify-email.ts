import { useQuery } from '@tanstack/react-query';
import { authService } from '@/services/api/auth.service';
import type {
  VerifyEmailSuccessResponse,
  VerifyEmailErrorResponse,
} from '@/types/auth.types';
import { AxiosError } from 'axios';

/**
 * Custom hook for verifying email address via token
 * Uses TanStack Query's useQuery for GET request
 * 
 * @param token - Verification token from URL parameter
 * @param enabled - Whether to run the query automatically (default: true when token exists)
 * @returns Query result with verification data, loading state, and error
 */
export function useVerifyEmail(token: string | null, enabled = true) {
  return useQuery<
    VerifyEmailSuccessResponse,
    AxiosError<VerifyEmailErrorResponse>
  >({
    queryKey: ['verifyEmail', token],
    queryFn: async () => {
      if (!token) {
        throw new Error('Verification token is required');
      }
      return await authService.verifyEmail(token);
    },
    enabled: enabled && !!token, // Only run if enabled and token exists
    retry: false, // Don't retry on failure (token is single-use)
    staleTime: Infinity, // Result never becomes stale (one-time verification)
    gcTime: 0, // Don't cache (formerly cacheTime in v4)
  });
}
