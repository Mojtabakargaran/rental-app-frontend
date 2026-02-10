import apiClient from '@/lib/api/axios.config';
import type {
  RegisterRequest,
  RegisterSuccessResponse,
  ResendVerificationRequest,
  ResendVerificationSuccessResponse,
  VerifyEmailSuccessResponse,
  LoginRequest,
  LoginSuccessResponse,
  ForgotPasswordRequest,
  ForgotPasswordSuccessResponse,
  ValidateResetTokenSuccessResponse,
  ResetPasswordRequest,
  ResetPasswordSuccessResponse,
  ChangePasswordFirstLoginRequest,
  ChangePasswordFirstLoginSuccessResponse,
  LogoutSuccessResponse,
} from '@/types/auth.types';
import { AxiosError } from 'axios';

/**
 * Authentication API Service
 * Handles all authentication-related API calls matching api-gateway-RestContracts.md
 */
export class AuthService {
  /**
   * Register new user account with company
   * 
   * Endpoint: POST /api/v1/auth/register
   * 
   * @param data - Registration request data
   * @returns Promise with registration response
   * @throws AxiosError with RegisterErrorResponse data
   */
  async register(
    data: RegisterRequest
  ): Promise<RegisterSuccessResponse> {
    try {
      const response = await apiClient.post<RegisterSuccessResponse>(
        '/api/v1/auth/register',
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      // Re-throw AxiosError as-is for proper error handling
      if (error instanceof AxiosError) {
        // Error is already properly formatted by axios
        throw error;
      }
      // For non-Axios errors, wrap them
      throw error;
    }
  }

  /**
   * Fetch CSRF token from backend
   * This should be called before the first registration attempt
   * 
   * @returns Promise with CSRF token
   */
  async fetchCsrfToken(): Promise<string> {
    try {
      const csrfTokenUrl = process.env.NEXT_PUBLIC_CSRF_TOKEN_URL || '/api/v1/auth/csrf-token';
      const response = await apiClient.get<{ csrfToken: string }>(
        csrfTokenUrl
      );
      return response.data.csrfToken;
    } catch (error) {
      console.error('Failed to fetch CSRF token:', error);
      throw error;
    }
  }

  /**
   * Resend verification email for unactivated account
   * 
   * Endpoint: POST /api/v1/auth/resend-verification
   * 
   * @param data - Resend verification request data (email)
   * @returns Promise with success response
   * @throws AxiosError with ResendVerificationErrorResponse data
   */
  async resendVerification(
    data: ResendVerificationRequest
  ): Promise<ResendVerificationSuccessResponse> {
    try {
      const response = await apiClient.post<ResendVerificationSuccessResponse>(
        '/api/v1/auth/resend-verification',
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      // Re-throw AxiosError as-is for proper error handling
      if (error instanceof AxiosError) {
        throw error;
      }
      // For non-Axios errors, wrap them
      throw error;
    }
  }

  /**
   * Verify user email address using token from verification email
   * 
   * Endpoint: GET /api/v1/auth/verify-email?token={token}
   * 
   * @param token - Verification token from email link
   * @returns Promise with verification response
   * @throws AxiosError with VerifyEmailErrorResponse data
   */
  async verifyEmail(
    token: string
  ): Promise<VerifyEmailSuccessResponse> {
    try {
      const response = await apiClient.get<VerifyEmailSuccessResponse>(
        '/api/v1/auth/verify-email',
        {
          params: { token },
        }
      );

      return response.data;
    } catch (error) {
      // Re-throw AxiosError as-is for proper error handling
      if (error instanceof AxiosError) {
        throw error;
      }
      // For non-Axios errors, wrap them
      throw error;
    }
  }

  /**
   * Authenticate user and create session
   * 
   * Endpoint: POST /api/v1/auth/login
   * 
   * @param data - Login request data (email, password, rememberMe)
   * @returns Promise with login response
   * @throws AxiosError with LoginErrorResponse data
   */
  async login(
    data: LoginRequest
  ): Promise<LoginSuccessResponse> {
    try {
      const response = await apiClient.post<LoginSuccessResponse>(
        '/api/v1/auth/login',
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true, // Required for session cookie
        }
      );

      return response.data;
    } catch (error) {
      // Re-throw AxiosError as-is for proper error handling
      if (error instanceof AxiosError) {
        throw error;
      }
      // For non-Axios errors, wrap them
      throw error;
    }
  }

  /**
   * Request password reset link via email
   * 
   * Endpoint: POST /api/v1/auth/forgot-password
   * 
   * @param data - Forgot password request data (email)
   * @returns Promise with generic success response (prevents email enumeration)
   * @throws AxiosError with ForgotPasswordErrorResponse data
   */
  async forgotPassword(
    data: ForgotPasswordRequest
  ): Promise<ForgotPasswordSuccessResponse> {
    try {
      const response = await apiClient.post<ForgotPasswordSuccessResponse>(
        '/api/v1/auth/forgot-password',
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      // Re-throw AxiosError as-is for proper error handling
      if (error instanceof AxiosError) {
        throw error;
      }
      // For non-Axios errors, wrap them
      throw error;
    }
  }

  /**
   * Validate password reset token
   * 
   * Endpoint: GET /api/v1/auth/reset-password?token={token}
   * 
   * @param token - Password reset token from email link
   * @returns Promise with token validation response
   * @throws AxiosError with ValidateResetTokenErrorResponse data
   */
  async validateResetToken(
    token: string
  ): Promise<ValidateResetTokenSuccessResponse> {
    try {
      const response = await apiClient.get<ValidateResetTokenSuccessResponse>(
        '/api/v1/auth/reset-password',
        {
          params: { token },
        }
      );

      return response.data;
    } catch (error) {
      // Re-throw AxiosError as-is for proper error handling
      if (error instanceof AxiosError) {
        throw error;
      }
      // For non-Axios errors, wrap them
      throw error;
    }
  }

  /**
   * Complete password reset with new password
   * 
   * Endpoint: POST /api/v1/auth/reset-password
   * 
   * @param data - Reset password request data (token, newPassword, confirmPassword)
   * @returns Promise with reset password response
   * @throws AxiosError with ResetPasswordErrorResponse data
   */
  async resetPassword(
    data: ResetPasswordRequest
  ): Promise<ResetPasswordSuccessResponse> {
    try {
      const response = await apiClient.post<ResetPasswordSuccessResponse>(
        '/api/v1/auth/reset-password',
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      // Re-throw AxiosError as-is for proper error handling
      if (error instanceof AxiosError) {
        throw error;
      }
      // For non-Axios errors, wrap them
      throw error;
    }
  }

  /**
   * Change temporary password to permanent password on first login (P4UC06)
   * 
   * Endpoint: POST /api/v1/auth/change-password-first-login
   * 
   * Note: Requires valid temporary session token from first login attempt.
   * After successful password change, temporary session is upgraded to full session.
   * 
   * @param data - Change password request data (newPassword, confirmPassword)
   * @returns Promise with change password response including full user data
   * @throws AxiosError with ChangePasswordFirstLoginErrorResponse data
   */
  async changePasswordFirstLogin(
    data: ChangePasswordFirstLoginRequest
  ): Promise<ChangePasswordFirstLoginSuccessResponse> {
    try {
      const response = await apiClient.post<ChangePasswordFirstLoginSuccessResponse>(
        '/api/v1/auth/change-password-first-login',
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      // Re-throw AxiosError as-is for proper error handling
      if (error instanceof AxiosError) {
        throw error;
      }
      // For non-Axios errors, wrap them
      throw error;
    }
  }

  /**
   * Logout user and terminate session (UC3.4)
   * 
   * Endpoint: POST /api/v1/auth/logout
   * 
   * Note: Always returns success to ensure user experience, even if backend logout fails.
   * Cookie is cleared by backend via Set-Cookie header.
   * 
   * @returns Promise with logout response
   * @throws AxiosError with LogoutErrorResponse data (rare, treated as success by frontend)
   */
  async logout(): Promise<LogoutSuccessResponse> {
    try {
      const response = await apiClient.post<LogoutSuccessResponse>(
        '/api/v1/auth/logout',
        {}, // Empty body per API contract
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      // Even if logout fails, treat as success on frontend
      // User should be logged out client-side regardless
      if (error instanceof AxiosError) {
        // Log the error but don't block logout
        console.warn('Logout API failed, proceeding with client-side logout:', error.message);
        
        // Return a successful logout response
        return {
          success: true,
          message: 'logout.success',
        };
      }
      // For non-Axios errors, wrap them
      throw error;
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
