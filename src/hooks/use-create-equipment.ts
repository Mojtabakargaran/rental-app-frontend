import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { equipmentService } from '@/services/api/equipment.service';
import type {
  CreateEquipmentRequest,
  CreateEquipmentResponse,
  EquipmentErrorResponse,
} from '@/types/equipment.types';

/**
 * Hook for creating equipment (P6UC01)
 *
 * @returns Mutation result with createEquipment function
 */
export function useCreateEquipment(): UseMutationResult<
  CreateEquipmentResponse,
  AxiosError<EquipmentErrorResponse>,
  CreateEquipmentRequest
> {
  return useMutation({
    mutationFn: (data: CreateEquipmentRequest) =>
      equipmentService.createEquipment(data),
    retry: false,
  });
}
