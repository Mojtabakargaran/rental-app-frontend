import apiClient from '@/lib/api/axios.config';
import type { DashboardResponse } from '@/types/dashboard.types';

/**
 * Dashboard API Service - UC3.1
 */
class DashboardService {
  /**
   * Get dashboard data (user profile and company information)
   * @returns Promise<DashboardResponse>
   */
  async getDashboard(): Promise<DashboardResponse> {
    const response = await apiClient.get<DashboardResponse>('/api/v1/dashboard');
    return response.data;
  }
}

export const dashboardService = new DashboardService();
