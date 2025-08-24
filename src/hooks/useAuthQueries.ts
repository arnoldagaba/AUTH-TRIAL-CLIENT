import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { authAPI } from "@/api/auth.api";
import { useAuthStore } from "@/store/auth.store";
import type {
	LoginData,
	RegisterData,
	ChangePasswordData,
	UpdateProfileData,
	ForgotPasswordData,
	ResetPasswordData,
} from "@/types/auth.types";

// Auth status query
export const useAuthStatus = () => {
	const { setUser, setLoading } = useAuthStore();

	return useQuery({
		queryKey: ["auth-status"],
		queryFn: async () => {
			const response = await authAPI.getAuthStatus();
			return response.data;
		},
		onSuccess: (data) => {
			setUser(data?.user || null);
		},
		onError: () => {
			setUser(null);
		},
		onSettled: () => {
			setLoading(false);
		},
		retry: false,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
};

// Profile query
export const useProfile = () => {
	return useQuery({
		queryKey: ["profile"],
		queryFn: async () => {
			const response = await authAPI.getProfile();
			return response.data;
		},
		enabled: !!useAuthStore.getState().isAuthenticated,
	});
};

// Sessions query
export const useSessions = () => {
	return useQuery({
		queryKey: ["sessions"],
		queryFn: async () => {
			const response = await authAPI.getSessions();
			return response.data;
		},
		enabled: !!useAuthStore.getState().isAuthenticated,
	});
};

// Login mutation
export const useLogin = () => {
	const queryClient = useQueryClient();
	const { setUser, setAccessToken } = useAuthStore();

	return useMutation({
		mutationFn: (data: LoginData) => authAPI.login(data),
		onSuccess: (response) => {
			if (response.success && response.data) {
				setUser(response.data.user);
				setAccessToken(response.data.accessToken);
				queryClient.setQueryData(["auth-status"], {
					isAuthenticated: true,
					user: response.data.user,
				});
				toast.success(response.message);
			}
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Login failed");
		},
	});
};

// Register mutation
export const useRegister = () => {
	const queryClient = useQueryClient();
	const { setUser, setAccessToken } = useAuthStore();

	return useMutation({
		mutationFn: (data: RegisterData) => authAPI.register(data),
		onSuccess: (response) => {
			if (response.success && response.data) {
				setUser(response.data.user);
				setAccessToken(response.data.accessToken);
				queryClient.setQueryData(["auth-status"], {
					isAuthenticated: true,
					user: response.data.user,
				});
				toast.success(response.message);
			}
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Registration failed");
		},
	});
};

// Logout mutation
export const useLogout = () => {
	const queryClient = useQueryClient();
	const { clearAuth } = useAuthStore();

	return useMutation({
		mutationFn: () => authAPI.logout(),
		onSuccess: () => {
			clearAuth();
			queryClient.clear();
			toast.success("Logged out successfully");
		},
		onError: (error: any) => {
			// Still clear auth even if logout fails
			clearAuth();
			queryClient.clear();
			console.error("Logout error:", error);
		},
	});
};

// Forgot password mutation
export const useForgotPassword = () => {
	return useMutation({
		mutationFn: (data: ForgotPasswordData) => authAPI.forgotPassword(data),
		onSuccess: (response) => {
			toast.success(response.message);
		},
		onError: (error: any) => {
			toast.error(
				error.response?.data?.message || "Failed to send reset email",
			);
		},
	});
};

// Reset password mutation
export const useResetPassword = () => {
	return useMutation({
		mutationFn: (data: ResetPasswordData) => authAPI.resetPassword(data),
		onSuccess: (response) => {
			toast.success(response.message);
		},
		onError: (error: any) => {
			toast.error(
				error.response?.data?.message || "Password reset failed",
			);
		},
	});
};

// Change password mutation
export const useChangePassword = () => {
	const queryClient = useQueryClient();
	const { clearAuth } = useAuthStore();

	return useMutation({
		mutationFn: (data: ChangePasswordData) => authAPI.changePassword(data),
		onSuccess: (response) => {
			toast.success(response.message);
			// Clear auth to force re-login
			clearAuth();
			queryClient.clear();
		},
		onError: (error: any) => {
			toast.error(
				error.response?.data?.message || "Password change failed",
			);
		},
	});
};

// Update profile mutation
export const useUpdateProfile = () => {
	const queryClient = useQueryClient();
	const { setUser } = useAuthStore();

	return useMutation({
		mutationFn: (data: UpdateProfileData) => authAPI.updateProfile(data),
		onSuccess: (response) => {
			if (response.success && response.data) {
				setUser(response.data);
				queryClient.setQueryData(["profile"], response.data);
				queryClient.setQueryData(["auth-status"], (old: any) => ({
					...old,
					user: response.data,
				}));
				toast.success(response.message);
			}
		},
		onError: (error: any) => {
			toast.error(
				error.response?.data?.message || "Profile update failed",
			);
		},
	});
};

// Email verification mutation
export const useVerifyEmail = () => {
	const queryClient = useQueryClient();
	const { user, setUser } = useAuthStore();

	return useMutation({
		mutationFn: (token: string) => authAPI.verifyEmail(token),
		onSuccess: (response) => {
			if (response.success && user) {
				const updatedUser = { ...user, isEmailVerified: true };
				setUser(updatedUser);
				queryClient.setQueryData(["profile"], updatedUser);
				queryClient.setQueryData(["auth-status"], (old: any) => ({
					...old,
					user: updatedUser,
				}));
				toast.success(response.message);
			}
		},
		onError: (error: any) => {
			toast.error(
				error.response?.data?.message || "Email verification failed",
			);
		},
	});
};

// Resend verification mutation
export const useResendVerification = () => {
	return useMutation({
		mutationFn: (email: string) => authAPI.resendVerification(email),
		onSuccess: (response) => {
			toast.success(response.message);
		},
		onError: (error: any) => {
			toast.error(
				error.response?.data?.message ||
					"Failed to resend verification email",
			);
		},
	});
};

// Revoke session mutation
export const useRevokeSession = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (sessionId: string) => authAPI.revokeSession(sessionId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["sessions"] });
			toast.success("Session revoked successfully");
		},
		onError: (error: any) => {
			toast.error(
				error.response?.data?.message || "Failed to revoke session",
			);
		},
	});
};
