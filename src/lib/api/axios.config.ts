import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// CSRF token management
let csrfToken: string | null = null;

export const setCsrfToken = (token: string) => {
  csrfToken = token;
};

export const getCsrfToken = (): string | null => {
  return csrfToken;
};

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable cookies for CSRF
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add CSRF token if available
    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }

    // Add language header
    const locale = typeof window !== 'undefined' 
      ? localStorage.getItem('preferredLanguage') || localStorage.getItem('locale') || 'en'
      : 'en';
    config.headers['Accept-Language'] = locale;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Extract CSRF token from response headers if present
    const newCsrfToken = response.headers['x-csrf-token'];
    if (newCsrfToken) {
      setCsrfToken(newCsrfToken);
    }
    return response;
  },
  (error: AxiosError) => {
    // Handle CSRF token refresh
    if (error.response?.status === 403) {
      const errorData = error.response.data as { code?: string };
      if (errorData?.code === 'CSRF_TOKEN_INVALID') {
        // Token will be refreshed on next request
        csrfToken = null;
      }
    }

    // Handle session expiration (401 Unauthorized) - UC3.4 AF4 & AF5
    if (error.response?.status === 401) {
      const errorData = error.response.data as { code?: string };
      
      // Only handle session expiration, not other 401 errors (like login failures)
      if (errorData?.code === 'SESSION_EXPIRED' || errorData?.code === 'UNAUTHORIZED') {
        // Signal session expiration to all tabs
        if (typeof window !== 'undefined') {
          localStorage.setItem('session-expired', Date.now().toString());
          localStorage.removeItem('session-expired');
          
          // Clear all client-side data
          sessionStorage.clear();
          localStorage.removeItem('preferredLanguage');
          
          // Get current locale for redirect
          const currentLocale = localStorage.getItem('locale') || 'en';
          
          // Redirect to login with session expired message
          window.location.href = `/${currentLocale}/login?session_expired=true`;
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
