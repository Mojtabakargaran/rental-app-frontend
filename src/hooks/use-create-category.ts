import { useMutation, useQueryClient } from '@tanstack/react-query';
import { equipmentService } from '@/services/api/equipment.service';
import type { CreateCategoryRequest } from '@/types/equipment.types';

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryRequest) =>
      equipmentService.createCategory(data),
    onSuccess: () => {
      // Invalidate categories queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories', 'list'] });
    },
  });
}
