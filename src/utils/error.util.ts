import { AxiosError } from 'axios';
import type { RegisterErrorResponse, AuthErrorCode } from '@/types/auth.types';

/**
 * Extract error code from Axios error response
 * Removes the "error." prefix if present (backend sends "error.ERROR_NAME")
 */
export function getErrorCode(error: unknown): AuthErrorCode | null {
  if (error instanceof AxiosError && error.response) {
    const errorData = error.response.data as RegisterErrorResponse;
    let code = (errorData?.code as AuthErrorCode) || null;
    
    // Strip "error." prefix if present (backend format: "error.ERROR_NAME")
    if (code && typeof code === 'string' && code.startsWith('error.')) {
      code = code.substring(6) as AuthErrorCode; // Remove "error." prefix
    }
    
    return code;
  }
  return null;
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof AxiosError) {
    return !error.response && error.code === 'ERR_NETWORK';
  }
  return false;
}

/**
 * Check if error is a timeout error
 */
export function isTimeoutError(error: unknown): boolean {
  if (error instanceof AxiosError) {
    return error.code === 'ECONNABORTED' || error.message.includes('timeout');
  }
  return false;
}

/**
 * Get retry-after time from rate limit error (in seconds)
 */
export function getRetryAfter(error: unknown): number | null {
  if (error instanceof AxiosError && error.response?.status === 429) {
    const errorData = error.response.data as RegisterErrorResponse;
    return errorData?.retryAfter || null;
  }
  return null;
}

/**
 * Map error to user-friendly i18n key
 * Returns just the error code without namespace prefix
 * (namespace should be set in useTranslations call)
 */
export function getErrorI18nKey(error: unknown): string {
  if (isNetworkError(error)) {
    return 'network';
  }

  if (isTimeoutError(error)) {
    return 'timeout';
  }

  const errorCode = getErrorCode(error);
  if (errorCode) {
    return errorCode; // Return just "TOKEN_NOT_FOUND" instead of "register.errors.TOKEN_NOT_FOUND"
  }

  return 'UNKNOWN_ERROR';
}
