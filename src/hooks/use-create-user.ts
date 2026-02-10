import { useMutation } from '@tanstack/react-query';
import { userManagementService } from '@/services/api';
import type {
  CreateUserRequest,
  CreateUserSuccessResponse,
} from '@/types/user-management.types';

/**
 * Hook to create a new user - P4UC01
 */
export function useCreateUser() {
  return useMutation<CreateUserSuccessResponse, Error, CreateUserRequest>({
    mutationKey: ['createUser'],
    mutationFn: (data: CreateUserRequest) => userManagementService.createUser(data),
    retry: false,
  });
}
