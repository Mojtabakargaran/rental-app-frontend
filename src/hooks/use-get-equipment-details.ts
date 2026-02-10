import { useQuery } from '@tanstack/react-query';
import { equipmentService } from '@/services/api/equipment.service';
import type { GetEquipmentDetailsResponse } from '@/types/equipment.types';

/**
 * Hook to fetch equipment details by ID (P6UC03)
 * Uses TanStack Query for caching and state management
 */
export function useGetEquipmentDetails(equipmentId: string | null) {
  return useQuery<GetEquipmentDetailsResponse>({
    queryKey: ['equipment', 'details', equipmentId],
    queryFn: () => {
      if (!equipmentId) {
        throw new Error('Equipment ID is required');
      }
      return equipmentService.getEquipmentDetails(equipmentId);
    },
    enabled: !!equipmentId,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
