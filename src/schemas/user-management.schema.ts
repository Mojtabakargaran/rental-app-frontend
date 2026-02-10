import { z } from 'zod';

/**
 * Create user form validation schema - P4UC01
 */
export const createUserSchema = z.object({
  fullName: z
    .string()
    .min(1, 'validation.fullNameRequired')
    .min(2, 'validation.fullNameMinLength')
    .max(100, 'validation.fullNameMaxLength'),
  
  email: z
    .string()
    .min(1, 'validation.emailRequired')
    .email('validation.invalidEmail')
    .max(255, 'validation.emailMaxLength'),
  
  phoneNumber: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[0-9+\-\s()]+$/.test(val),
      'validation.invalidPhone'
    ),
  
  roleCode: z
    .string()
    .min(1, 'validation.roleRequired'),
});

/**
 * Create user form data type
 */
export type CreateUserFormData = z.infer<typeof createUserSchema>;

/**
 * Update user role validation schema - P4UC03
 */
export const updateUserRoleSchema = z.object({
  roleCode: z
    .string()
    .min(1, 'validation.roleRequired'),
});

/**
 * Update user role form data type
 */
export type UpdateUserRoleFormData = z.infer<typeof updateUserRoleSchema>;

/**
 * Update user profile validation schema - P4UC04
 */
export const updateUserProfileSchema = z.object({
  fullName: z
    .string()
    .min(1, 'validation.fullNameRequired')
    .min(2, 'validation.fullNameMinLength')
    .max(100, 'validation.fullNameMaxLength'),
  
  email: z
    .string()
    .min(1, 'validation.emailRequired')
    .email('validation.invalidEmail')
    .max(255, 'validation.emailMaxLength'),
  
  phoneNumber: z
    .string()
    .optional()
    .nullable()
    .refine(
      (val) => !val || /^[0-9+\-\s()]+$/.test(val),
      'validation.invalidPhone'
    ),
});

/**
 * Update user profile form data type
 */
export type UpdateUserProfileFormData = z.infer<typeof updateUserProfileSchema>;
