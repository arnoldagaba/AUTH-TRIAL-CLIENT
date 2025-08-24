
export interface User {
	id: string;
	email: string;
	firstName?: string;
	lastName?: string;
	role: "USER" | "ADMIN";
	isEmailVerified: boolean;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
	lastLogin?: string;
}

export interface AuthTokens {
	accessToken: string;
	refreshToken: string;
}

export interface AuthResponse {
	user: User;
	accessToken: string;
}

export interface RegisterData {
	email: string;
	password: string;
	firstName?: string;
	lastName?: string;
}

export interface LoginData {
	email: string;
	password: string;
}

export interface ChangePasswordData {
	currentPassword: string;
	newPassword: string;
}

export interface UpdateProfileData {
	firstName?: string;
	lastName?: string;
}

export interface ForgotPasswordData {
	email: string;
}

export interface ResetPasswordData {
	token: string;
	newPassword: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ApiResponse<T = any> {
	success: boolean;
	message: string;
	data?: T;
	errors?: Array<{
		field: string;
		message: string;
	}>;
	code?: string;
}

export interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	accessToken: string | null;
}

export interface Session {
	id: string;
	userId: string;
	token: string;
	ipAddress?: string;
	userAgent?: string;
	createdAt: string;
	expiresAt: string;
	isRevoked: boolean;
}
