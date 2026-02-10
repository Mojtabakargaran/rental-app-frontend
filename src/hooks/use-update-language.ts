import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { userService } from '@/services/api';
import type {
  UpdateLanguageRequest,
  UpdateLanguageSuccessResponse,
  UpdateLanguageErrorResponse,
} from '@/types';

/**
 * Custom hook to update user's language preference
 * Uses TanStack Query mutation with optimistic updates
 */
export function useUpdateLanguage(): UseMutationResult<
  UpdateLanguageSuccessResponse,
  AxiosError<UpdateLanguageErrorResponse>,
  UpdateLanguageRequest
> {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateLanguageSuccessResponse,
    AxiosError<UpdateLanguageErrorResponse>,
    UpdateLanguageRequest
  >({
    mutationKey: ['updateLanguage'],
    mutationFn: (data: UpdateLanguageRequest) => userService.updateLanguage(data),
    retry: (failureCount, error) => {
      // Don't retry on client errors (4xx)
      const status = error.response?.status;
      if (status && status >= 400 && status < 500) {
        return false;
      }
      // Retry up to 3 times for server errors (5xx)
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => {
      // Exponential backoff: 1s, 2s, 4s
      return Math.min(1000 * 2 ** attemptIndex, 4000);
    },
    onSuccess: () => {
      // Invalidate dashboard query to refresh user data
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
