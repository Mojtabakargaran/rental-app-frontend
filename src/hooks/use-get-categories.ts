import { useQuery } from '@tanstack/react-query';
import { equipmentService } from '@/services/api/equipment.service';
import type { GetCategoriesRequest } from '@/types/equipment.types';

export function useGetCategories(params?: GetCategoriesRequest) {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: () => equipmentService.getCategories(params),
    staleTime: 30000, // 30 seconds
  });
}
