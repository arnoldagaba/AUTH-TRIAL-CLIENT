import { z } from "zod";

// Password validation with security requirements
const passwordSchema = z
	.string()
	.min(8, "Password must be at least 8 characters long")
	.regex(
		/^(?=.*[a-z])/,
		"Password must contain at least one lowercase letter",
	)
	.regex(
		/^(?=.*[A-Z])/,
		"Password must contain at least one uppercase letter",
	)
	.regex(/^(?=.*\d)/, "Password must contain at least one number")
	.regex(
		/^(?=.*[@$!%*?&])/,
		"Password must contain at least one special character",
	)
	.max(128, "Password must not exceed 128 characters");

// Email validation
const emailSchema = z
	.email("Please enter a valid email address")
	.min(1, "Email is required")
	.max(255, "Email must not exceed 255 characters")
	.toLowerCase();

// Name validation
const nameSchema = z
	.string()
	.min(1, "This field is required")
	.max(50, "Name must not exceed 50 characters")
	.regex(
		/^[a-zA-Z\s'-]+$/,
		"Name can only contain letters, spaces, hyphens, and apostrophes",
	);

// Optional name validation
const optionalNameSchema = nameSchema.optional();

// Registration schema
export const registerSchema = z.object({
	email: emailSchema,
	password: passwordSchema,
	firstName: optionalNameSchema,
	lastName: optionalNameSchema,
});

export type RegisterFormData = z.infer<typeof registerSchema>;

// Login schema
export const loginSchema = z.object({
	email: emailSchema,
	password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Forgot password schema
export const forgotPasswordSchema = z.object({
	email: emailSchema,
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

// Reset password schema
export const resetPasswordSchema = z
	.object({
		newPassword: passwordSchema,
		confirmPassword: z.string().min(1, "Please confirm your password"),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

// Change password schema
export const changePasswordSchema = z
	.object({
		currentPassword: z.string().min(1, "Current password is required"),
		newPassword: passwordSchema,
		confirmPassword: z.string().min(1, "Please confirm your new password"),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	})
	.refine((data) => data.currentPassword !== data.newPassword, {
		message: "New password must be different from current password",
		path: ["newPassword"],
	});

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

// Update profile schema
export const updateProfileSchema = z
	.object({
		firstName: optionalNameSchema,
		lastName: optionalNameSchema,
	})
	.refine(
		(data) => data.firstName !== undefined || data.lastName !== undefined,
		{
			message: "At least one field must be provided",
			path: ["firstName"],
		},
	);

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

// Resend verification schema
export const resendVerificationSchema = z.object({
	email: emailSchema,
});

export type ResendVerificationFormData = z.infer<
	typeof resendVerificationSchema
>;
