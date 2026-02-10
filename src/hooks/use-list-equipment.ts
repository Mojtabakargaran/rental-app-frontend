import { useQuery } from '@tanstack/react-query';
import { equipmentService } from '@/services/api/equipment.service';
import type { ListEquipmentRequest } from '@/types/equipment.types';

/**
 * Custom hook for fetching equipment list
 * Uses TanStack Query for server state management
 */
export function useListEquipment(params?: ListEquipmentRequest) {
  return useQuery({
    queryKey: ['equipment', 'list', params],
    queryFn: () => equipmentService.listEquipment(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
