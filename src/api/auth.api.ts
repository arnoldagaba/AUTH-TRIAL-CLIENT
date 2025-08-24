import api from "./index";
import type {
	RegisterData,
	LoginData,
	ChangePasswordData,
	UpdateProfileData,
	ForgotPasswordData,
	ResetPasswordData,
	ApiResponse,
	AuthResponse,
	User,
	Session,
} from "@/types/auth.types";

class AuthAPI {
	// Authentication endpoints
	async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
		const response = await api.post("/api/auth/register", data);
		return response.data;
	}

	async login(data: LoginData): Promise<ApiResponse<AuthResponse>> {
		const response = await api.post("/api/auth/login", data);
		return response.data;
	}

	async refreshToken(): Promise<ApiResponse<{ accessToken: string }>> {
		const response = await api.post("/api/auth/refresh");
		return response.data;
	}

	async logout(): Promise<ApiResponse> {
		const response = await api.post("/api/auth/logout");
		return response.data;
	}

	async logoutAll(): Promise<ApiResponse> {
		const response = await api.post("/api/auth/logout-all");
		return response.data;
	}

	// Email verification
	async verifyEmail(token: string): Promise<ApiResponse> {
		const response = await api.get(`/api/auth/verify-email?token=${token}`);
		return response.data;
	}

	async resendVerification(email: string): Promise<ApiResponse> {
		const response = await api.post("/api/auth/resend-verification", {
			email,
		});
		return response.data;
	}

	// Password management
	async forgotPassword(data: ForgotPasswordData): Promise<ApiResponse> {
		const response = await api.post("/api/auth/forgot-password", data);
		return response.data;
	}

	async resetPassword(data: ResetPasswordData): Promise<ApiResponse> {
		const response = await api.post("/api/auth/reset-password", data);
		return response.data;
	}

	async changePassword(data: ChangePasswordData): Promise<ApiResponse> {
		const response = await api.post("/api/auth/change-password", data);
		return response.data;
	}

	// Profile management
	async getProfile(): Promise<ApiResponse<User>> {
		const response = await api.get("/api/auth/profile");
		return response.data;
	}

	async updateProfile(data: UpdateProfileData): Promise<ApiResponse<User>> {
		const response = await api.patch("/api/auth/profile", data);
		return response.data;
	}

	// Session management
	async getSessions(): Promise<ApiResponse<Session[]>> {
		const response = await api.get("/api/auth/sessions");
		return response.data;
	}

	async revokeSession(sessionId: string): Promise<ApiResponse> {
		const response = await api.delete(`/api/auth/sessions/${sessionId}`);
		return response.data;
	}

	// Status and health
	async getAuthStatus(): Promise<
		ApiResponse<{ isAuthenticated: boolean; user: User | null }>
	> {
		const response = await api.get("/api/auth/status");
		return response.data;
	}

	async healthCheck(): Promise<
		ApiResponse<{ timestamp: string; version: string }>
	> {
		const response = await api.get("/api/auth/health");
		return response.data;
	}
}

export const authAPI = new AuthAPI();
