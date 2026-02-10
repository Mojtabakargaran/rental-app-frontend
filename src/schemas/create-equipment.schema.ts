import { z } from 'zod';
import { getCurrentYear } from '@/utils/date.util';

/**
 * Custom attribute schema
 */
const customAttributeSchema = z.object({
  key: z
    .string()
    .min(1, 'error.equipment.customAttributeKeyRequired')
    .max(100, 'error.equipment.customAttributeKeyLength'),
  value: z
    .string()
    .min(1, 'error.equipment.customAttributeValueRequired')
    .max(500, 'error.equipment.customAttributeValueLength'),
  unit: z.string().max(50, 'error.equipment.customAttributeUnitLength').optional(),
});

/**
 * Create equipment form schema (P6UC01)
 */
export const createEquipmentSchema = z.object({
  name: z
    .string()
    .min(1, 'error.equipment.nameRequired')
    .max(200, 'error.equipment.nameLength')
    .trim(),
  categoryId: z
    .string()
    .min(1, 'error.equipment.categoryRequired')
    .uuid('error.equipment.categoryInvalid'),
  description: z
    .string()
    .max(2000, 'error.equipment.descriptionLength')
    .trim()
    .optional()
    .or(z.literal('')),
  manufacturer: z
    .string()
    .max(100, 'error.equipment.manufacturerLength')
    .trim()
    .optional()
    .or(z.literal('')),
  model: z
    .string()
    .max(100, 'error.equipment.modelLength')
    .trim()
    .optional()
    .or(z.literal('')),
  serialNumber: z
    .string()
    .max(100, 'error.equipment.serialNumberLength')
    .trim()
    .optional()
    .or(z.literal('')),
  yearOfManufacture: z
    .number()
    .int('error.equipment.yearInvalid')
    .min(1900, 'error.equipment.yearInvalid')
    .max(getCurrentYear(), 'error.equipment.yearInvalid')
    .optional()
    .or(z.literal(0)), // Allow 0 as "not set"
  purchasePrice: z
    .number()
    .nonnegative('error.equipment.purchasePriceInvalid')
    .optional()
    .or(z.literal(0)), // Allow 0 as "not set"
  purchaseDate: z
    .string()
    .refine(
      (date) => {
        if (!date) return true; // Allow empty
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        return selectedDate <= today;
      },
      { message: 'error.equipment.purchaseDateFuture' }
    )
    .optional()
    .or(z.literal('')),
  status: z.enum(['Available', 'Rented', 'Maintenance', 'Out of Service'], {
    required_error: 'error.equipment.statusRequired',
    invalid_type_error: 'error.equipment.statusInvalid',
  }),
  customAttributes: z.array(customAttributeSchema).optional(),
});

export type CreateEquipmentFormData = z.infer<typeof createEquipmentSchema>;
