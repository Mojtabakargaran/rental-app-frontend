import apiClient from '@/lib/api/axios.config';
import type {
  UpdateLanguageRequest,
  UpdateLanguageSuccessResponse,
} from '@/types/user.types';

/**
 * User API Service - UC3.2
 */
class UserService {
  /**
   * Update user's language preference
   * @param data - Language preference data
   * @returns Promise<UpdateLanguageSuccessResponse>
   */
  async updateLanguage(data: UpdateLanguageRequest): Promise<UpdateLanguageSuccessResponse> {
    const response = await apiClient.put<UpdateLanguageSuccessResponse>(
      '/api/v1/users/profile/language',
      data
    );
    return response.data;
  }
}

export const userService = new UserService();
