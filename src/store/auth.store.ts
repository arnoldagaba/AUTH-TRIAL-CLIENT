import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { authAPI } from "@/api/auth.api";
import type {
	AuthState,
	User,
	RegisterData,
	LoginData,
	ChangePasswordData,
	UpdateProfileData,
	ForgotPasswordData,
	ResetPasswordData,
} from "@/types/auth.types";

interface AuthActions {
	// Authentication actions
	register: (
		data: RegisterData,
	) => Promise<{ success: boolean; message: string; user?: User }>;
	login: (
		data: LoginData,
	) => Promise<{ success: boolean; message: string; user?: User }>;
	logout: () => Promise<void>;
	logoutAll: () => Promise<void>;
	refreshToken: () => Promise<boolean>;

	// Email verification
	verifyEmail: (
		token: string,
	) => Promise<{ success: boolean; message: string }>;
	resendVerification: (
		email: string,
	) => Promise<{ success: boolean; message: string }>;

	// Password management
	forgotPassword: (
		data: ForgotPasswordData,
	) => Promise<{ success: boolean; message: string }>;
	resetPassword: (
		data: ResetPasswordData,
	) => Promise<{ success: boolean; message: string }>;
	changePassword: (
		data: ChangePasswordData,
	) => Promise<{ success: boolean; message: string }>;

	// Profile management
	getProfile: () => Promise<void>;
	updateProfile: (
		data: UpdateProfileData,
	) => Promise<{ success: boolean; message: string; user?: User }>;

	// State management
	setUser: (user: User | null) => void;
	setAccessToken: (token: string | null) => void;
	setLoading: (loading: boolean) => void;
	clearAuth: () => void;
	checkAuthStatus: () => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
	persist(
		(set, get) => ({
			// Initial state
			user: null,
			isAuthenticated: false,
			isLoading: false,
			accessToken: null,

			// Authentication actions
			register: async (data: RegisterData) => {
				set({ isLoading: true });
				try {
					const response = await authAPI.register(data);

					if (response.success && response.data) {
						set({
							user: response.data.user,
							accessToken: response.data.accessToken,
							isAuthenticated: true,
							isLoading: false,
						});

						return {
							success: true,
							message: response.message,
							user: response.data.user,
						};
					}

					set({ isLoading: false });
					return { success: false, message: response.message };
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
				} catch (error: any) {
					set({ isLoading: false });
					const message =
						error.response?.data?.message || "Registration failed";
					return { success: false, message };
				}
			},

			login: async (data: LoginData) => {
				set({ isLoading: true });
				try {
					const response = await authAPI.login(data);

					if (response.success && response.data) {
						set({
							user: response.data.user,
							accessToken: response.data.accessToken,
							isAuthenticated: true,
							isLoading: false,
						});

						return {
							success: true,
							message: response.message,
							user: response.data.user,
						};
					}

					set({ isLoading: false });
					return { success: false, message: response.message };
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
				} catch (error: any) {
					set({ isLoading: false });
					const message =
						error.response?.data?.message || "Login failed";
					return { success: false, message };
				}
			},

			logout: async () => {
				try {
					await authAPI.logout();
				} catch (error) {
					console.error("Logout error:", error);
				} finally {
					set({
						user: null,
						accessToken: null,
						isAuthenticated: false,
					});
				}
			},

			logoutAll: async () => {
				try {
					await authAPI.logoutAll();
				} catch (error) {
					console.error("Logout all error:", error);
				} finally {
					set({
						user: null,
						accessToken: null,
						isAuthenticated: false,
					});
				}
			},

			refreshToken: async () => {
				try {
					const response = await authAPI.refreshToken();

					if (response.success && response.data) {
						set({ accessToken: response.data.accessToken });
						return true;
					}

					return false;
				} catch (error) {
					console.error("Token refresh error:", error);
					get().clearAuth();
					return false;
				}
			},

			// Email verification
			verifyEmail: async (token: string) => {
				try {
					const response = await authAPI.verifyEmail(token);

					if (response.success) {
						// Update user's email verification status
						const { user } = get();
						if (user) {
							set({
								user: { ...user, isEmailVerified: true },
							});
						}
					}

					return {
						success: response.success,
						message: response.message,
					};
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
				} catch (error: any) {
					const message =
						error.response?.data?.message ||
						"Email verification failed";
					return { success: false, message };
				}
			},

			resendVerification: async (email: string) => {
				try {
					const response = await authAPI.resendVerification(email);
					return {
						success: response.success,
						message: response.message,
					};
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
				} catch (error: any) {
					const message =
						error.response?.data?.message ||
						"Failed to resend verification";
					return { success: false, message };
				}
			},

			// Password management
			forgotPassword: async (data: ForgotPasswordData) => {
				try {
					const response = await authAPI.forgotPassword(data);
					return {
						success: response.success,
						message: response.message,
					};
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
				} catch (error: any) {
					const message =
						error.response?.data?.message ||
						"Failed to send reset email";
					return { success: false, message };
				}
			},

			resetPassword: async (data: ResetPasswordData) => {
				try {
					const response = await authAPI.resetPassword(data);
					return {
						success: response.success,
						message: response.message,
					};
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
				} catch (error: any) {
					const message =
						error.response?.data?.message ||
						"Password reset failed";
					return { success: false, message };
				}
			},

			changePassword: async (data: ChangePasswordData) => {
				try {
					const response = await authAPI.changePassword(data);

					if (response.success) {
						// Clear auth state to force re-login
						get().clearAuth();
					}

					return {
						success: response.success,
						message: response.message,
					};
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
				} catch (error: any) {
					const message =
						error.response?.data?.message ||
						"Password change failed";
					return { success: false, message };
				}
			},

			// Profile management
			getProfile: async () => {
				try {
					const response = await authAPI.getProfile();

					if (response.success && response.data) {
						set({ user: response.data });
					}
				} catch (error) {
					console.error("Get profile error:", error);
				}
			},

			updateProfile: async (data: UpdateProfileData) => {
				try {
					const response = await authAPI.updateProfile(data);

					if (response.success && response.data) {
						set({ user: response.data });
						return {
							success: true,
							message: response.message,
							user: response.data,
						};
					}

					return { success: false, message: response.message };
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
				} catch (error: any) {
					const message =
						error.response?.data?.message ||
						"Profile update failed";
					return { success: false, message };
				}
			},

			// State management
			setUser: (user: User | null) => {
				set({ user, isAuthenticated: !!user });
			},

			setAccessToken: (token: string | null) => {
				set({ accessToken: token });
			},

			setLoading: (loading: boolean) => {
				set({ isLoading: loading });
			},

			clearAuth: () => {
				set({
					user: null,
					accessToken: null,
					isAuthenticated: false,
				});
			},

			checkAuthStatus: async () => {
				try {
					const response = await authAPI.getAuthStatus();

					if (response.success && response.data) {
						set({
							user: response.data.user,
							isAuthenticated: response.data.isAuthenticated,
						});
					}
				} catch (error) {
					console.error("Auth status check error:", error);
					get().clearAuth();
				}
			},
		}),
		{
			name: "auth-store",
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => ({
				user: state.user,
				accessToken: state.accessToken,
				isAuthenticated: state.isAuthenticated,
			}),
		},
	),
);
