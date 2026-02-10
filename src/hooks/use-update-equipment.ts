import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { equipmentService } from '@/services/api/equipment.service';
import type {
  UpdateEquipmentRequest,
  UpdateEquipmentResponse,
  EquipmentErrorResponse,
} from '@/types/equipment.types';

interface UpdateEquipmentParams {
  equipmentId: string;
  data: UpdateEquipmentRequest;
}

/**
 * Hook for updating equipment information
 * @returns Mutation hook for updating equipment
 */
export function useUpdateEquipment(): UseMutationResult<
  UpdateEquipmentResponse,
  AxiosError<EquipmentErrorResponse>,
  UpdateEquipmentParams,
  unknown
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ equipmentId, data }: UpdateEquipmentParams) =>
      equipmentService.updateEquipment(equipmentId, data),
    onSuccess: (_, variables) => {
      // Invalidate equipment queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['equipment', 'details', variables.equipmentId] });
      queryClient.invalidateQueries({ queryKey: ['equipment'] });
    },
    retry: false,
  });
}
