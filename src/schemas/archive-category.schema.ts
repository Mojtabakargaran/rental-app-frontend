import { z } from 'zod';

export const deactivateCategorySchema = z.object({
  reason: z
    .string()
    .max(500, 'equipment.validation.DEACTIVATION_REASON_TOO_LONG')
    .optional(),
});

export type DeactivateCategoryFormData = z.infer<typeof deactivateCategorySchema>;
