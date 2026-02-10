import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { equipmentService } from '@/services/api/equipment.service';
import type {
  UpdateCategoryRequest,
  UpdateCategoryResponse,
  EquipmentErrorResponse,
} from '@/types/equipment.types';

interface UpdateCategoryVariables {
  categoryId: string;
  data: UpdateCategoryRequest;
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateCategoryResponse,
    AxiosError<EquipmentErrorResponse>,
    UpdateCategoryVariables
  >({
    mutationFn: ({ categoryId, data }) =>
      equipmentService.updateCategory(categoryId, data),
    onSuccess: () => {
      // Invalidate categories queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories', 'list'] });
    },
    retry: 1,
  });
}
