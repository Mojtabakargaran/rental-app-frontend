import { z } from 'zod';

/**
 * Schema for updating equipment status (P6UC05)
 */
export const updateEquipmentStatusSchema = z.object({
  status: z.enum(['Available', 'Rented', 'Maintenance', 'Out of Service'], {
    required_error: 'equipment.validation.statusRequired',
    invalid_type_error: 'equipment.validation.statusInvalid',
  }),
  reason: z
    .string()
    .max(500, { message: 'equipment.validation.reasonMaxLength' })
    .optional()
    .nullable(),
});

export type UpdateEquipmentStatusFormData = z.infer<typeof updateEquipmentStatusSchema>;
