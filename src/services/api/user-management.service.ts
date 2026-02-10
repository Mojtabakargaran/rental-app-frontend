import apiClient from '@/lib/api/axios.config';
import type {
  GetRolesSuccessResponse,
  CreateUserRequest,
  CreateUserSuccessResponse,
  GetUsersParams,
  GetUsersSuccessResponse,
  GetUserDetailsSuccessResponse,
  UpdateUserRoleRequest,
  UpdateUserRoleSuccessResponse,
  UpdateUserProfileRequest,
  UpdateUserProfileSuccessResponse,
  DeactivateUserRequest,
  DeactivateUserSuccessResponse,
  ReactivateUserSuccessResponse,
} from '@/types/user-management.types';

/**
 * User Management API Service - P4UC01, P4UC02, P4UC03, P4UC04, P4UC05
 */
class UserManagementService {
  /**
   * Get available roles for user assignment
   * @returns Promise<GetRolesSuccessResponse>
   */
  async getRoles(): Promise<GetRolesSuccessResponse> {
    const response = await apiClient.get<GetRolesSuccessResponse>('/api/v1/users/roles');
    return response.data;
  }

  /**
   * Create new user account within organization
   * @param data - User creation data
   * @returns Promise<CreateUserSuccessResponse>
   */
  async createUser(data: CreateUserRequest): Promise<CreateUserSuccessResponse> {
    const response = await apiClient.post<CreateUserSuccessResponse>(
      '/api/v1/users/create',
      data
    );
    return response.data;
  }

  /**
   * Get paginated list of users with filters - P4UC02
   * @param params - Query parameters for filtering and pagination
   * @returns Promise<GetUsersSuccessResponse>
   */
  async getUsers(params?: GetUsersParams): Promise<GetUsersSuccessResponse> {
    const response = await apiClient.get<GetUsersSuccessResponse>('/api/v1/users', {
      params,
    });
    return response.data;
  }

  /**
   * Get detailed information about a specific user - P4UC02
   * @param userId - User ID to fetch details for
   * @returns Promise<GetUserDetailsSuccessResponse>
   */
  async getUserDetails(userId: string): Promise<GetUserDetailsSuccessResponse> {
    const response = await apiClient.get<GetUserDetailsSuccessResponse>(
      `/api/v1/users/${userId}`
    );
    return response.data;
  }

  /**
   * Update user role - P4UC03
   * @param userId - User ID to update role for
   * @param data - Role update data
   * @returns Promise<UpdateUserRoleSuccessResponse>
   */
  async updateUserRole(
    userId: string,
    data: UpdateUserRoleRequest
  ): Promise<UpdateUserRoleSuccessResponse> {
    const response = await apiClient.put<UpdateUserRoleSuccessResponse>(
      `/api/v1/users/${userId}/role`,
      data
    );
    return response.data;
  }

  /**
   * Update user profile information - P4UC04
   * @param userId - User ID to update profile for
   * @param data - Profile update data
   * @returns Promise<UpdateUserProfileSuccessResponse>
   */
  async updateUserProfile(
    userId: string,
    data: UpdateUserProfileRequest
  ): Promise<UpdateUserProfileSuccessResponse> {
    const response = await apiClient.put<UpdateUserProfileSuccessResponse>(
      `/api/v1/users/${userId}/profile`,
      data
    );
    return response.data;
  }

  /**
   * Deactivate user account - P4UC05
   * @param userId - User ID to deactivate
   * @param data - Optional deactivation reason
   * @returns Promise<DeactivateUserSuccessResponse>
   */
  async deactivateUser(
    userId: string,
    data?: DeactivateUserRequest
  ): Promise<DeactivateUserSuccessResponse> {
    const response = await apiClient.put<DeactivateUserSuccessResponse>(
      `/api/v1/users/${userId}/deactivate`,
      data || {}
    );
    return response.data;
  }

  /**
   * Reactivate user account - P4UC05
   * @param userId - User ID to reactivate
   * @returns Promise<ReactivateUserSuccessResponse>
   */
  async reactivateUser(userId: string): Promise<ReactivateUserSuccessResponse> {
    const response = await apiClient.put<ReactivateUserSuccessResponse>(
      `/api/v1/users/${userId}/reactivate`,
      {}
    );
    return response.data;
  }
}

export const userManagementService = new UserManagementService();
