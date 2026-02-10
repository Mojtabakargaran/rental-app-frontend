import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { equipmentService } from '@/services/api/equipment.service';
import type {
  UpdateEquipmentStatusRequest,
  UpdateEquipmentStatusResponse,
  EquipmentErrorResponse,
} from '@/types/equipment.types';

/**
 * Hook for updating equipment status (P6UC05)
 * @returns Mutation for updating equipment status
 */
export function useUpdateEquipmentStatus(equipmentId: string) {
  return useMutation<
    UpdateEquipmentStatusResponse,
    AxiosError<EquipmentErrorResponse>,
    UpdateEquipmentStatusRequest
  >({
    mutationKey: ['equipment', 'updateStatus', equipmentId],
    mutationFn: (data) => equipmentService.updateEquipmentStatus(equipmentId, data),
    retry: false,
  });
}
