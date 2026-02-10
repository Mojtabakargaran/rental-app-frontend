import { useQuery } from '@tanstack/react-query';
import { equipmentService } from '@/services/api/equipment.service';
import type { GetCategoriesListRequest } from '@/types/equipment.types';

export function useGetCategoriesList(params?: GetCategoriesListRequest) {
  return useQuery({
    queryKey: ['categories', 'list', params],
    queryFn: () => equipmentService.getCategoriesList(params),
  });
}
