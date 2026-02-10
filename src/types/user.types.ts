// User API Type Definitions - UC3.2

import type { LanguagePreference } from './auth.types';

/**
 * PUT /api/v1/users/profile/language - Request Body
 */
export interface UpdateLanguageRequest {
  languagePreference: LanguagePreference;
}

/**
 * PUT /api/v1/users/profile/language - Success Response Data
 */
export interface UpdateLanguageData {
  languagePreference: LanguagePreference;
}

/**
 * PUT /api/v1/users/profile/language - Success Response
 */
export interface UpdateLanguageSuccessResponse {
  success: true;
  message: string;
  data: UpdateLanguageData;
}

/**
 * User API Error Codes
 */
export enum UserErrorCode {
  INVALID_LANGUAGE = 'INVALID_LANGUAGE',
  LANGUAGE_REQUIRED = 'LANGUAGE_REQUIRED',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  UNAUTHORIZED = 'UNAUTHORIZED',
  ACCOUNT_INACTIVE = 'ACCOUNT_INACTIVE',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  LANGUAGE_UPDATE_FAILED = 'LANGUAGE_UPDATE_FAILED',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
}

/**
 * User API Error Response
 */
export interface UpdateLanguageErrorResponse {
  success: false;
  error: string;
  code: UserErrorCode;
}
