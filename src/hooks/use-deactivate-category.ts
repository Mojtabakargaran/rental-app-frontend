import { useMutation, useQueryClient } from '@tanstack/react-query';
import { equipmentService } from '@/services/api/equipment.service';
import type { DeactivateCategoryRequest } from '@/types/equipment.types';

export function useDeactivateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ categoryId, data }: { categoryId: string; data: DeactivateCategoryRequest }) =>
      equipmentService.deactivateCategory(categoryId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['categoriesList'] });
    },
  });
}
