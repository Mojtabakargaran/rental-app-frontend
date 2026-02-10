import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { equipmentService } from '@/services/api/equipment.service';
import type {
  SoftDeleteEquipmentRequest,
  SoftDeleteEquipmentResponse,
  PermanentDeleteEquipmentRequest,
  PermanentDeleteEquipmentResponse,
  EquipmentErrorResponse,
} from '@/types/equipment.types';

/**
 * Hook for soft deleting equipment (archiving) (P6UC05)
 * @returns Mutation for soft deleting equipment
 */
export function useSoftDeleteEquipment(equipmentId: string) {
  return useMutation<
    SoftDeleteEquipmentResponse,
    AxiosError<EquipmentErrorResponse>,
    SoftDeleteEquipmentRequest | undefined
  >({
    mutationKey: ['equipment', 'softDelete', equipmentId],
    mutationFn: (data) => equipmentService.softDeleteEquipment(equipmentId, data),
    retry: false,
  });
}

/**
 * Hook for permanently deleting equipment (P6UC05)
 * @returns Mutation for permanently deleting equipment
 */
export function usePermanentDeleteEquipment(equipmentId: string) {
  return useMutation<
    PermanentDeleteEquipmentResponse,
    AxiosError<EquipmentErrorResponse>,
    PermanentDeleteEquipmentRequest
  >({
    mutationKey: ['equipment', 'permanentDelete', equipmentId],
    mutationFn: (data) => equipmentService.permanentDeleteEquipment(equipmentId, data),
    retry: false,
  });
}
