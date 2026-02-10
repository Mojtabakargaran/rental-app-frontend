import { z } from 'zod';

/**
 * Schema for soft deleting equipment (P6UC05)
 */
export const softDeleteEquipmentSchema = z.object({
  reason: z
    .string()
    .max(500, { message: 'equipment.validation.reasonMaxLength' })
    .optional()
    .nullable(),
});

export type SoftDeleteEquipmentFormData = z.infer<typeof softDeleteEquipmentSchema>;

/**
 * Schema for permanently deleting equipment (P6UC05)
 * User must type exactly "DELETE" to confirm permanent deletion
 */
export const permanentDeleteEquipmentSchema = z.object({
  confirmation: z.string().min(1, { message: 'equipment.validation.confirmationRequired' }),
}).refine((data) => data.confirmation === 'DELETE', {
  message: 'equipment.validation.confirmationInvalid',
  path: ['confirmation'],
});

export type PermanentDeleteEquipmentFormData = z.infer<typeof permanentDeleteEquipmentSchema>;
