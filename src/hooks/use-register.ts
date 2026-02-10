'use client';

import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/api/auth.service';
import type {
  RegisterRequest,
  RegisterSuccessResponse,
  RegisterErrorResponse,
} from '@/types/auth.types';
import { AxiosError } from 'axios';

/**
 * Custom hook for user registration
 * Uses TanStack Query for state management
 */
export function useRegister() {
  return useMutation<
    RegisterSuccessResponse,
    AxiosError<RegisterErrorResponse>,
    RegisterRequest
  >({
    mutationKey: ['register'],
    mutationFn: (data: RegisterRequest) => authService.register(data),
    retry: false,
  });
}
