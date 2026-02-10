import { z } from 'zod';

/**
 * Registration Form Validation Schema
 * 
 * Matches backend validation rules from api-gateway-RestContracts.md:
 * - fullName: min 2, max 100 characters
 * - companyName: min 2, max 100 characters
 * - email: valid email format, max 255 characters
 * - password: min 8 characters, must contain uppercase, lowercase, number, special char
 * - passwordConfirmation: must match password
 * - phoneNumber: optional, international format
 * - languagePreference: 'en' or 'fa'
 */
export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, 'validation.fullNameMin')
      .max(100, 'validation.fullNameMax')
      .trim(),

    companyName: z
      .string()
      .min(2, 'validation.companyNameMin')
      .max(100, 'validation.companyNameMax')
      .trim(),

    email: z
      .string()
      .email('validation.invalidEmail')
      .max(255, 'validation.emailMax')
      .toLowerCase()
      .trim(),

    password: z
      .string()
      .min(8, 'validation.passwordMin')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'validation.passwordStrength'
      ),

    passwordConfirmation: z.string().min(1, 'validation.passwordConfirmationRequired'),

    phoneNumber: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (!val || val.trim() === '') return true;
          // International phone format: +[country code][number]
          return /^\+?[1-9]\d{1,14}$/.test(val.replace(/[\s-]/g, ''));
        },
        {
          message: 'validation.invalidPhone',
        }
      ),

    languagePreference: z.enum(['en', 'fa'], {
      errorMap: () => ({ message: 'validation.invalidLanguage' }),
    }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'validation.passwordMismatch',
    path: ['passwordConfirmation'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Password strength validation (for real-time feedback)
 */
export const passwordStrengthSchema = z.object({
  hasMinLength: z.boolean(),
  hasUppercase: z.boolean(),
  hasLowercase: z.boolean(),
  hasNumber: z.boolean(),
  hasSpecialChar: z.boolean(),
});

export type PasswordStrength = z.infer<typeof passwordStrengthSchema>;

/**
 * Calculate password strength for UI feedback
 */
export function calculatePasswordStrength(password: string): PasswordStrength {
  return {
    hasMinLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[@$!%*?&]/.test(password),
  };
}

/**
 * Get overall password strength level (0-4)
 */
export function getPasswordStrengthLevel(strength: PasswordStrength): number {
  return Object.values(strength).filter(Boolean).length;
}

/**
 * Resend Verification Form Validation Schema
 * 
 * Matches backend validation rules from api-gateway-RestContracts.md:
 * - email: valid email format, max 255 characters, required
 */
export const resendVerificationSchema = z.object({
  email: z
    .string()
    .min(1, 'validation.emailRequired')
    .email('validation.invalidEmail')
    .max(255, 'validation.emailMax')
    .toLowerCase()
    .trim(),
});

export type ResendVerificationFormData = z.infer<typeof resendVerificationSchema>;

/**
 * Login Form Validation Schema
 * 
 * Matches backend validation rules from api-gateway-RestContracts.md:
 * - email: valid email format, max 255 characters, required
 * - password: required, min 1 character
 * - rememberMe: optional boolean, default false
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'validation.emailRequired')
    .email('validation.invalidEmail')
    .max(255, 'validation.emailMax')
    .toLowerCase()
    .trim(),

  password: z
    .string()
    .min(1, 'validation.passwordRequired'),

  rememberMe: z
    .boolean()
    .optional()
    .default(false),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Forgot Password Form Validation Schema
 * 
 * Matches backend validation rules from api-gateway-RestContracts.md:
 * - email: valid email format, max 255 characters, required
 */
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'validation.emailRequired')
    .email('validation.invalidEmail')
    .max(255, 'validation.emailMax')
    .toLowerCase()
    .trim(),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

/**
 * Reset Password Form Validation Schema
 * 
 * Matches backend validation rules from api-gateway-RestContracts.md:
 * - token: required (hidden field)
 * - newPassword: min 8 characters, must contain uppercase, lowercase, number, special char
 * - confirmPassword: must match newPassword
 */
export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'validation.tokenRequired'),

    newPassword: z
      .string()
      .min(8, 'validation.passwordMin')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'validation.passwordStrength'
      ),

    confirmPassword: z.string().min(1, 'validation.passwordConfirmationRequired'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'validation.passwordMismatch',
    path: ['confirmPassword'],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

/**
 * Change Password First Login Form Validation Schema (P4UC06)
 * 
 * Matches backend validation rules from api-gateway-RestContracts.md:
 * - newPassword: min 8 characters, must contain uppercase, lowercase, number, special char
 * - confirmPassword: must match newPassword
 */
export const changePasswordFirstLoginSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, 'validation.passwordMin')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'validation.passwordStrength'
      ),

    confirmPassword: z.string().min(1, 'validation.passwordConfirmationRequired'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'validation.passwordMismatch',
    path: ['confirmPassword'],
  });

export type ChangePasswordFirstLoginFormData = z.infer<typeof changePasswordFirstLoginSchema>;
