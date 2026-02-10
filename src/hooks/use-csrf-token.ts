'use client';

import { useEffect, useState } from 'react';
import { authService } from '@/services/api/auth.service';
import { setCsrfToken } from '@/lib/api/axios.config';

/**
 * Custom hook to fetch and manage CSRF token
 * Should be called once on the registration page mount
 */
export function useCsrfToken() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await authService.fetchCsrfToken();
        setCsrfToken(token);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to fetch CSRF token:', err);
        setError('Failed to initialize security token');
        setIsLoading(false);
      }
    };

    fetchToken();
  }, []);

  return { isLoading, error };
}
