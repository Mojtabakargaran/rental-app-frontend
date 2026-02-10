// Dashboard API Type Definitions - UC3.1

/**
 * User role information
 */
export interface UserRole {
  code: string;
  name: string;
}

/**
 * User profile data for dashboard
 */
export interface DashboardUser {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  languagePreference: 'en' | 'fa';
  role: UserRole;
  lastLoginAt: string;
}

/**
 * Company information for dashboard
 */
export interface DashboardCompany {
  id: string;
  companyName: string;
  ownerFullName: string;
  ownerEmail: string;
  ownerPhoneNumber: string | null;
  registrationDate: string;
}

/**
 * Dashboard data response
 */
export interface DashboardData {
  user: DashboardUser;
  company: DashboardCompany;
}

/**
 * GET /api/v1/dashboard - Success Response
 */
export interface DashboardResponse {
  success: true;
  message: string;
  data: DashboardData;
}

/**
 * Dashboard error codes
 */
export enum DashboardErrorCode {
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  UNAUTHORIZED = 'UNAUTHORIZED',
  ACCOUNT_INACTIVE = 'ACCOUNT_INACTIVE',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  COMPANY_NOT_FOUND = 'COMPANY_NOT_FOUND',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  DASHBOARD_LOAD_FAILED = 'DASHBOARD_LOAD_FAILED',
}

/**
 * Dashboard error response
 */
export interface DashboardErrorResponse {
  success: false;
  error: string;
  code: DashboardErrorCode;
}
