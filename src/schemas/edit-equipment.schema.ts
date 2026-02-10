import { z } from 'zod';
import { getCurrentYear } from '@/utils/date.util';

const currentYear = getCurrentYear();

/**
 * Custom attribute validation schema
 */
const customAttributeSchema = z.object({
  key: z
    .string()
    .min(1, 'equipment.validation.customAttributeKeyRequired')
    .max(100, 'equipment.validation.customAttributeKeyTooLong'),
  value: z
    .string()
    .min(1, 'equipment.validation.customAttributeValueRequired')
    .max(500, 'equipment.validation.customAttributeValueTooLong'),
  unit: z
    .string()
    .max(50, 'equipment.validation.customAttributeUnitTooLong')
    .optional(),
});

/**
 * Edit equipment validation schema
 */
export const editEquipmentSchema = z.object({
  name: z
    .string()
    .min(1, 'equipment.validation.nameRequired')
    .max(200, 'equipment.validation.nameTooLong')
    .trim(),
  categoryId: z
    .string()
    .uuid('equipment.validation.invalidCategoryId')
    .min(1, 'equipment.validation.categoryRequired'),
  description: z
    .string()
    .max(2000, 'equipment.validation.descriptionTooLong')
    .trim()
    .optional()
    .nullable()
    .transform((val) => (val === '' ? null : val)),
  manufacturer: z
    .string()
    .max(100, 'equipment.validation.manufacturerTooLong')
    .trim()
    .optional()
    .nullable()
    .transform((val) => (val === '' ? null : val)),
  model: z
    .string()
    .max(100, 'equipment.validation.modelTooLong')
    .trim()
    .optional()
    .nullable()
    .transform((val) => (val === '' ? null : val)),
  serialNumber: z
    .string()
    .max(100, 'equipment.validation.serialNumberTooLong')
    .trim()
    .optional()
    .nullable()
    .transform((val) => (val === '' ? null : val)),
  yearOfManufacture: z
    .number({
      invalid_type_error: 'equipment.validation.yearInvalid',
    })
    .int('equipment.validation.yearInvalid')
    .min(1900, 'equipment.validation.yearTooOld')
    .max(currentYear, 'equipment.validation.yearInFuture')
    .optional()
    .nullable(),
  purchasePrice: z
    .number({
      invalid_type_error: 'equipment.validation.priceInvalid',
    })
    .nonnegative('equipment.validation.priceNegative')
    .optional()
    .nullable(),
  purchaseDate: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val === '' ? null : val))
    .refine(
      (dateString) => {
        if (!dateString) return true;
        // Check if it matches the format
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return false;
        const date = new Date(dateString);
        return date <= new Date();
      },
      { message: 'equipment.validation.dateInFuture' }
    ),
  status: z.enum(['Available', 'Rented', 'Maintenance', 'Out of Service'], {
    required_error: 'equipment.validation.statusRequired',
    invalid_type_error: 'equipment.validation.statusInvalid',
  }),
  customAttributes: z
    .array(customAttributeSchema)
    .optional()
    .nullable()
    .default([]),
});

export type EditEquipmentFormData = z.infer<typeof editEquipmentSchema>;
