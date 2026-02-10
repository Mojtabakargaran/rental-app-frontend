import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { dashboardService } from '@/services/api';
import type { DashboardResponse, DashboardErrorResponse } from '@/types';

/**
 * Custom hook to fetch dashboard data (user profile and company information)
 * Uses TanStack Query for caching and automatic refetching
 */
export function useDashboard(): UseQueryResult<DashboardResponse, AxiosError<DashboardErrorResponse>> {
  return useQuery<DashboardResponse, AxiosError<DashboardErrorResponse>>({
    queryKey: ['dashboard'],
    queryFn: () => dashboardService.getDashboard(),
    retry: (failureCount, error) => {
      // Don't retry on authentication errors (401, 403)
      if (error.response?.status === 401 || error.response?.status === 403) {
        return false;
      }
      // Retry up to 2 times for other errors (500, 503, network errors)
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => {
      // Exponential backoff: 2s, 4s, 8s
      return Math.min(1000 * 2 ** attemptIndex, 8000);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - dashboard data is relatively stable
    gcTime: 10 * 60 * 1000, // 10 minutes - keep in cache
    refetchOnWindowFocus: true, // Refresh when user returns to tab
  });
}
