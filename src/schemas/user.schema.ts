import { z } from 'zod';

/**
 * Language preference validation schema - UC3.2
 */
export const updateLanguageSchema = z.object({
  languagePreference: z.enum(['en', 'fa'], {
    errorMap: () => ({ message: 'validation.INVALID_LANGUAGE' }),
  }),
});

/**
 * Type inferred from updateLanguageSchema
 */
export type UpdateLanguageFormData = z.infer<typeof updateLanguageSchema>;
