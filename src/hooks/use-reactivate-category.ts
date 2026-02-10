import { useMutation, useQueryClient } from '@tanstack/react-query';
import { equipmentService } from '@/services/api/equipment.service';

export function useReactivateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryId: string) =>
      equipmentService.reactivateCategory(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['categoriesList'] });
    },
  });
}
