// User Management API Type Definitions - P4UC01

import type { ValidationErrorDetail } from './auth.types';

/**
 * Available roles for user assignment
 */
export interface Role {
  id: string;
  code: string;
  name: string;
  description: string | null;
}

/**
 * GET /api/v1/users/roles - Success Response Data
 */
export interface GetRolesData {
  roles: Role[];
}

/**
 * GET /api/v1/users/roles - Success Response
 */
export interface GetRolesSuccessResponse {
  success: true;
  message: string;
  data: GetRolesData;
}

/**
 * POST /api/v1/users/create - Request Body
 */
export interface CreateUserRequest {
  fullName: string;
  email: string;
  phoneNumber?: string;
  roleCode: string;
}

/**
 * POST /api/v1/users/create - Success Response Data
 */
export interface CreateUserData {
  userId: string;
  email: string;
  fullName: string;
}

/**
 * POST /api/v1/users/create - Success Response
 */
export interface CreateUserSuccessResponse {
  success: true;
  message: string;
  data: CreateUserData;
}

/**
 * User data for list display - P4UC02
 */
export interface UserListItem {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  role: {
    code: string;
    name: string;
  };
  isActive: boolean;
  emailVerifiedAt: string | null;
  createdAt: string;
}

/**
 * Pagination metadata - P4UC02
 */
export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * GET /api/v1/users - Query Parameters - P4UC02
 */
export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'active' | 'inactive' | 'all';
  roleCode?: string;
}

/**
 * GET /api/v1/users - Success Response Data - P4UC02
 */
export interface GetUsersData {
  users: UserListItem[];
  pagination: Pagination;
}

/**
 * GET /api/v1/users - Success Response - P4UC02
 */
export interface GetUsersSuccessResponse {
  success: true;
  message: string;
  data: GetUsersData;
}

/**
 * User details data - P4UC02
 */
export interface UserDetails {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  languagePreference: 'en' | 'fa';
  role: {
    code: string;
    name: string;
    description: string | null;
  };
  isActive: boolean;
  emailVerifiedAt: string | null;
  passwordChangedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * GET /api/v1/users/:userId - Success Response Data - P4UC02
 */
export interface GetUserDetailsData {
  user: UserDetails;
}

/**
 * GET /api/v1/users/:userId - Success Response - P4UC02
 */
export interface GetUserDetailsSuccessResponse {
  success: true;
  message: string;
  data: GetUserDetailsData;
}

/**
 * PUT /api/v1/users/:userId/role - Request Body - P4UC03
 */
export interface UpdateUserRoleRequest {
  roleCode: string;
}

/**
 * PUT /api/v1/users/:userId/role - Success Response Data - P4UC03
 */
export interface UpdateUserRoleData {
  userId: string;
  fullName: string;
  email: string;
  oldRole: {
    code: string;
    name: string;
  };
  newRole: {
    code: string;
    name: string;
  };
  updatedAt: string;
}

/**
 * PUT /api/v1/users/:userId/role - Success Response - P4UC03
 */
export interface UpdateUserRoleSuccessResponse {
  success: true;
  message: string;
  data: UpdateUserRoleData;
}

/**
 * PUT /api/v1/users/:userId/profile - Request Body - P4UC04
 */
export interface UpdateUserProfileRequest {
  fullName: string;
  email: string;
  phoneNumber?: string | null;
}

/**
 * PUT /api/v1/users/:userId/profile - Success Response Data - P4UC04
 */
export interface UpdateUserProfileData {
  userId: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  changedFields: string[];
  emailChanged: boolean;
  emailVerificationRequired: boolean;
  updatedAt: string;
}

/**
 * PUT /api/v1/users/:userId/profile - Success Response - P4UC04
 */
export interface UpdateUserProfileSuccessResponse {
  success: true;
  message: string;
  data: UpdateUserProfileData;
}

/**
 * PUT /api/v1/users/:userId/deactivate - Request Body - P4UC05
 */
export interface DeactivateUserRequest {
  reason?: string;             // Optional deactivation reason (max 500 chars)
}

/**
 * PUT /api/v1/users/:userId/deactivate - Success Response Data - P4UC05
 */
export interface DeactivateUserData {
  userId: string;              // UUID
  fullName: string;
  email: string;
  isActive: boolean;           // false
  deactivatedAt: string;       // ISO 8601 UTC
  deactivatedBy: string;       // UUID - company owner who deactivated
}

/**
 * PUT /api/v1/users/:userId/deactivate - Success Response - P4UC05
 */
export interface DeactivateUserSuccessResponse {
  success: true;
  message: string;             // i18n key: 'user.deactivated'
  data: DeactivateUserData;
}

/**
 * PUT /api/v1/users/:userId/reactivate - Success Response Data - P4UC05
 */
export interface ReactivateUserData {
  userId: string;              // UUID
  fullName: string;
  email: string;
  isActive: boolean;           // true
  reactivatedAt: string;       // ISO 8601 UTC
  reactivatedBy: string;       // UUID - company owner who reactivated
}

/**
 * PUT /api/v1/users/:userId/reactivate - Success Response - P4UC05
 */
export interface ReactivateUserSuccessResponse {
  success: true;
  message: string;             // i18n key: 'user.reactivated'
  data: ReactivateUserData;
}

/**
 * User Management API Error Codes
 */
export enum UserManagementErrorCode {
  // Validation errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  INVALID_EMAIL_FORMAT = 'INVALID_EMAIL_FORMAT',
  INVALID_PHONE_FORMAT = 'INVALID_PHONE_FORMAT',
  REQUIRED_FIELD_MISSING = 'REQUIRED_FIELD_MISSING',
  ROLE_NOT_FOUND = 'ROLE_NOT_FOUND',
  INVALID_FULL_NAME = 'INVALID_FULL_NAME',
  INVALID_PAGE_NUMBER = 'INVALID_PAGE_NUMBER',
  INVALID_LIMIT = 'INVALID_LIMIT',
  INVALID_STATUS_FILTER = 'INVALID_STATUS_FILTER',
  SEARCH_TOO_SHORT = 'SEARCH_TOO_SHORT',
  INVALID_USER_ID = 'INVALID_USER_ID',
  ROLE_CODE_REQUIRED = 'ROLE_CODE_REQUIRED',
  INVALID_ROLE_CODE = 'INVALID_ROLE_CODE',
  NO_CHANGES = 'NO_CHANGES',
  FULL_NAME_REQUIRED = 'FULL_NAME_REQUIRED',
  EMAIL_REQUIRED = 'EMAIL_REQUIRED',
  
  // Authentication/Authorization errors
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  UNAUTHORIZED = 'UNAUTHORIZED',
  CSRF_TOKEN_INVALID = 'CSRF_TOKEN_INVALID',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  CROSS_TENANT_ACCESS = 'CROSS_TENANT_ACCESS',
  SELF_ROLE_MODIFICATION = 'SELF_ROLE_MODIFICATION',
  OWNER_ROLE_PROTECTED = 'OWNER_ROLE_PROTECTED',
  
  // P4UC05 specific error codes
  USER_ALREADY_DEACTIVATED = 'USER_ALREADY_DEACTIVATED',
  CANNOT_DEACTIVATE_SELF = 'CANNOT_DEACTIVATE_SELF',
  CANNOT_DEACTIVATE_LAST_OWNER = 'CANNOT_DEACTIVATE_LAST_OWNER',
  USER_ALREADY_ACTIVE = 'USER_ALREADY_ACTIVE',
  
  // System errors
  USER_CREATION_FAILED = 'USER_CREATION_FAILED',
  ROLE_UPDATE_FAILED = 'ROLE_UPDATE_FAILED',
  PROFILE_UPDATE_FAILED = 'PROFILE_UPDATE_FAILED',
  USER_DEACTIVATION_FAILED = 'USER_DEACTIVATION_FAILED',
  USER_REACTIVATION_FAILED = 'USER_REACTIVATION_FAILED',
  ROLES_RETRIEVAL_FAILED = 'ROLES_RETRIEVAL_FAILED',
  USERS_RETRIEVAL_FAILED = 'USERS_RETRIEVAL_FAILED',
  USER_DETAILS_RETRIEVAL_FAILED = 'USER_DETAILS_RETRIEVAL_FAILED',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
}

/**
 * User Management API Error Response
 */
export interface UserManagementErrorResponse {
  success: false;
  error: string;
  code: UserManagementErrorCode;
  details?: ValidationErrorDetail[];
}
