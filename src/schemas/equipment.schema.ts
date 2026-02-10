import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(2, { message: 'validation.CATEGORY_NAME_TOO_SHORT' })
    .max(100, { message: 'validation.CATEGORY_NAME_TOO_LONG' })
    .regex(/^[a-zA-Z0-9\s\-_\u0600-\u06FF]+$/, {
      message: 'validation.INVALID_CATEGORY_NAME',
    })
    .transform((val) => val.trim()),
  description: z
    .string()
    .max(500, { message: 'validation.DESCRIPTION_TOO_LONG' })
    .optional()
    .transform((val) => (val?.trim() === '' ? undefined : val?.trim())),
  parentId: z
    .string()
    .uuid({ message: 'validation.INVALID_PARENT_CATEGORY' })
    .optional()
    .or(z.literal('')),
  isActive: z.boolean().default(true),
});

export type CreateCategoryFormData = z.infer<typeof createCategorySchema>;

export const updateCategorySchema = z.object({
  name: z
    .string()
    .min(2, { message: 'validation.CATEGORY_NAME_TOO_SHORT' })
    .max(100, { message: 'validation.CATEGORY_NAME_TOO_LONG' })
    .regex(/^[a-zA-Z0-9\s\-_\u0600-\u06FF]+$/, {
      message: 'validation.INVALID_CATEGORY_NAME',
    })
    .transform((val) => val.trim()),
  description: z
    .string()
    .max(500, { message: 'validation.DESCRIPTION_TOO_LONG' })
    .nullable()
    .optional()
    .transform((val) => (val?.trim() === '' ? null : val?.trim())),
  parentId: z
    .string()
    .uuid({ message: 'validation.INVALID_PARENT_CATEGORY' })
    .nullable()
    .optional()
    .or(z.literal('')),
  isActive: z.boolean(),
});

export type UpdateCategoryFormData = z.infer<typeof updateCategorySchema>;
