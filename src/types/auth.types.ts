// ============================================================================
// Request DTOs - Matching api-gateway-RestContracts.md
// ============================================================================

export interface RegisterRequest {
  fullName: string;
  companyName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  phoneNumber?: string;
  languagePreference: 'en' | 'fa';
}

export interface ResendVerificationRequest {
  email: string;
}

export interface VerifyEmailRequest {
  token: string; // verification token from URL query parameter
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ValidateResetTokenRequest {
  token: string; // password reset token from URL query parameter
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

// Empty body per API contract - using Record<string, never> to satisfy linter
export type LogoutRequest = Record<string, never>;

// ============================================================================
// Response DTOs - Matching api-gateway-RestContracts.md
// ============================================================================

export interface RegisterSuccessData {
  userId: string;
  email: string;
  fullName: string;
  tenantId: string;
}

export interface RegisterSuccessResponse {
  success: true;
  message: string;
  data: RegisterSuccessData;
}

export interface ResendVerificationSuccessResponse {
  success: true;
  message?: string;
  alreadyActivated?: boolean;
}

export interface VerifyEmailSuccessResponse {
  success: true;
  message: string;
  redirectUrl: string; // '/login'
}

export interface LoginSuccessData {
  userId: string;
  email: string;
  fullName: string;
  tenantId: string;
  languagePreference: 'en' | 'fa';
  requirePasswordChange?: boolean; // true if first login
}

export interface LoginSuccessResponse {
  success: true;
  message: string;
  data: LoginSuccessData;
}

export interface ChangePasswordFirstLoginRequest {
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordFirstLoginSuccessData {
  userId: string;
  email: string;
  fullName: string;
  tenantId: string;
  languagePreference: 'en' | 'fa';
}

export interface ChangePasswordFirstLoginSuccessResponse {
  success: true;
  message: string;
  data: ChangePasswordFirstLoginSuccessData;
}

export interface ForgotPasswordSuccessResponse {
  success: true;
  message: string; // Generic response - prevents email enumeration
}

export interface ValidateResetTokenSuccessResponse {
  success: true;
  message: string;
  data: { valid: true };
}

export interface ResetPasswordSuccessData {
  redirectUrl: string; // '/login'
}

export interface ResetPasswordSuccessResponse {
  success: true;
  message: string;
  data: ResetPasswordSuccessData;
}

export interface LogoutSuccessResponse {
  success: true;
  message: string; // i18n key: 'logout.success'
  warning?: string; // i18n key: 'logout.cleanupFailed' (optional, when backend cleanup fails)
  code?: 'LOGOUT_CLEANUP_FAILED';
}

// ============================================================================
// Error Response DTOs
// ============================================================================

export interface ValidationErrorDetail {
  field: string;
  message: string;
  code: string;
}

export interface RegisterErrorResponse {
  success: false;
  error: string;
  code: string;
  details?: ValidationErrorDetail[];
  retryAfter?: number;
}

export interface ResendVerificationErrorResponse {
  success: false;
  error: string;
  code: string;
  details?: ValidationErrorDetail[];
  retryAfter?: number;
}

export interface VerifyEmailErrorResponse {
  success: false;
  error: string;
  code: string;
  resendUrl?: string; // '/resend-verification'
}

export interface LoginErrorResponse {
  success: false;
  error: string;
  code: string;
  details?: ValidationErrorDetail[];
  attemptsRemaining?: number;
  retryAfter?: number;
  resendUrl?: string; // '/resend-verification' for EMAIL_NOT_VERIFIED
}

export interface ForgotPasswordErrorResponse {
  success: false;
  error: string;
  code: string;
  details?: ValidationErrorDetail[];
  retryAfter?: number;
}

export interface ValidateResetTokenErrorResponse {
  success: false;
  error: string;
  code: string;
  requestNewUrl?: string; // '/forgot-password'
}

export interface ResetPasswordErrorResponse {
  success: false;
  error: string;
  code: string;
  details?: ValidationErrorDetail[];
  requestNewUrl?: string; // '/forgot-password'
}

export interface ChangePasswordFirstLoginErrorResponse {
  success: false;
  error: string;
  code: string;
  details?: ValidationErrorDetail[];
}

export interface LogoutErrorResponse {
  success: false;
  error: string; // i18n key: 'error.sessionNotFound' or 'error.logoutFailed'
  code: 'SESSION_NOT_FOUND' | 'LOGOUT_FAILED';
}

// ============================================================================
// Error Code Enums - Matching api-gateway-RestContracts.md
// ============================================================================

export enum AuthErrorCode {
  // Validation Errors (400)
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  INVALID_EMAIL_FORMAT = 'INVALID_EMAIL_FORMAT',
  WEAK_PASSWORD = 'WEAK_PASSWORD',
  PASSWORD_MISMATCH = 'PASSWORD_MISMATCH',
  REQUIRED_FIELD_MISSING = 'REQUIRED_FIELD_MISSING',
  INVALID_PHONE_FORMAT = 'INVALID_PHONE_FORMAT',
  
  // Verify Email Errors
  INVALID_TOKEN_FORMAT = 'INVALID_TOKEN_FORMAT', // 400
  TOKEN_NOT_FOUND = 'TOKEN_NOT_FOUND', // 404
  TOKEN_EXPIRED = 'TOKEN_EXPIRED', // 410
  TOKEN_ALREADY_USED = 'TOKEN_ALREADY_USED', // 410
  TOKEN_INVALIDATED = 'TOKEN_INVALIDATED', // 410
  VERIFICATION_FAILED = 'VERIFICATION_FAILED', // 500

  // Forgot Password / Reset Password Errors
  RESET_PASSWORD_FAILED = 'RESET_PASSWORD_FAILED', // 500

  // Change Password First Login Errors
  PASSWORD_TOO_SHORT = 'PASSWORD_TOO_SHORT', // 400
  PASSWORD_MISSING_UPPERCASE = 'PASSWORD_MISSING_UPPERCASE', // 400
  PASSWORD_MISSING_LOWERCASE = 'PASSWORD_MISSING_LOWERCASE', // 400
  PASSWORD_MISSING_NUMBER = 'PASSWORD_MISSING_NUMBER', // 400
  PASSWORD_MISSING_SPECIAL_CHAR = 'PASSWORD_MISSING_SPECIAL_CHAR', // 400
  PASSWORDS_DO_NOT_MATCH = 'PASSWORDS_DO_NOT_MATCH', // 400
  PASSWORD_SAME_AS_TEMPORARY = 'PASSWORD_SAME_AS_TEMPORARY', // 400
  SESSION_EXPIRED = 'SESSION_EXPIRED', // 401
  UNAUTHORIZED = 'UNAUTHORIZED', // 401
  PASSWORD_CHANGE_FAILED = 'PASSWORD_CHANGE_FAILED', // 500

  // Login Errors
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS', // 401
  EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED', // 403
  ACCOUNT_INACTIVE = 'ACCOUNT_INACTIVE', // 403
  ACCOUNT_DEACTIVATED = 'ACCOUNT_DEACTIVATED', // 403
  ACCOUNT_SUSPENDED = 'ACCOUNT_SUSPENDED', // 403

  // Security Errors
  CSRF_TOKEN_INVALID = 'CSRF_TOKEN_INVALID', // 403
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED', // 429

  // Server Errors
  REGISTRATION_FAILED = 'REGISTRATION_FAILED', // 500
  RESEND_VERIFICATION_FAILED = 'RESEND_VERIFICATION_FAILED', // 500
  LOGIN_FAILED = 'LOGIN_FAILED', // 500
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE', // 503

  // Logout Errors (UC3.4)
  SESSION_NOT_FOUND = 'SESSION_NOT_FOUND', // 401
  LOGOUT_FAILED = 'LOGOUT_FAILED', // 500
  LOGOUT_CLEANUP_FAILED = 'LOGOUT_CLEANUP_FAILED', // 200 (warning)
}

// ============================================================================
// Union Types
// ============================================================================

export type RegisterResponse = RegisterSuccessResponse | RegisterErrorResponse;

export type ResendVerificationResponse =
  | ResendVerificationSuccessResponse
  | ResendVerificationErrorResponse;

export type VerifyEmailResponse =
  | VerifyEmailSuccessResponse
  | VerifyEmailErrorResponse;

export type LoginResponse = LoginSuccessResponse | LoginErrorResponse;

export type ForgotPasswordResponse =
  | ForgotPasswordSuccessResponse
  | ForgotPasswordErrorResponse;

export type ValidateResetTokenResponse =
  | ValidateResetTokenSuccessResponse
  | ValidateResetTokenErrorResponse;

export type ResetPasswordResponse =
  | ResetPasswordSuccessResponse
  | ResetPasswordErrorResponse;

export type ChangePasswordFirstLoginResponse =
  | ChangePasswordFirstLoginSuccessResponse
  | ChangePasswordFirstLoginErrorResponse;

export type LogoutResponse = LogoutSuccessResponse | LogoutErrorResponse;

export type LanguagePreference = 'en' | 'fa';

// ============================================================================
// Type Guards
// ============================================================================

export function isRegisterSuccessResponse(
  response: RegisterResponse
): response is RegisterSuccessResponse {
  return response.success === true;
}

export function isRegisterErrorResponse(
  response: RegisterResponse
): response is RegisterErrorResponse {
  return response.success === false;
}

export function isResendVerificationSuccessResponse(
  response: ResendVerificationResponse
): response is ResendVerificationSuccessResponse {
  return response.success === true;
}

export function isResendVerificationErrorResponse(
  response: ResendVerificationResponse
): response is ResendVerificationErrorResponse {
  return response.success === false;
}

export function isLoginSuccessResponse(
  response: LoginResponse
): response is LoginSuccessResponse {
  return response.success === true;
}

export function isLoginErrorResponse(
  response: LoginResponse
): response is LoginErrorResponse {
  return response.success === false;
}

export function isForgotPasswordSuccessResponse(
  response: ForgotPasswordResponse
): response is ForgotPasswordSuccessResponse {
  return response.success === true;
}

export function isForgotPasswordErrorResponse(
  response: ForgotPasswordResponse
): response is ForgotPasswordErrorResponse {
  return response.success === false;
}

export function isResetPasswordSuccessResponse(
  response: ResetPasswordResponse
): response is ResetPasswordSuccessResponse {
  return response.success === true;
}

export function isResetPasswordErrorResponse(
  response: ResetPasswordResponse
): response is ResetPasswordErrorResponse {
  return response.success === false;
}

export function isChangePasswordFirstLoginSuccessResponse(
  response: ChangePasswordFirstLoginResponse
): response is ChangePasswordFirstLoginSuccessResponse {
  return response.success === true;
}

export function isChangePasswordFirstLoginErrorResponse(
  response: ChangePasswordFirstLoginResponse
): response is ChangePasswordFirstLoginErrorResponse {
  return response.success === false;
}

export function isLogoutSuccessResponse(
  response: LogoutResponse
): response is LogoutSuccessResponse {
  return response.success === true;
}

export function isLogoutErrorResponse(
  response: LogoutResponse
): response is LogoutErrorResponse {
  return response.success === false;
}
