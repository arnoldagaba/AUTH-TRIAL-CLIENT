import axios, {
	type AxiosResponse,
	type InternalAxiosRequestConfig,
} from "axios";
import { toast } from "react-toastify";

const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	withCredentials: true,
	timeout: 10000,
});

// Token management
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

// Request interceptor to add auth token
api.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		// Get token from localStorage
		const authStore = localStorage.getItem("auth-store");
		if (authStore) {
			try {
				const { state } = JSON.parse(authStore);
				const token = state?.accessToken;

				if (token && config.headers) {
					config.headers.Authorization = `Bearer ${token}`;
				}
			} catch (error) {
				console.error("Error parsing auth store:", error);
			}
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
	(response: AxiosResponse) => {
		return response;
	},
	async (error) => {
		const originalRequest = error.config;

		// Handle 401 errors (token expired)
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			// Check if it's a token expired error
			if (error.response?.data?.code === "TOKEN_EXPIRED") {
				try {
					// If already refreshing, wait for the existing refresh
					if (isRefreshing && refreshPromise) {
						const newToken = await refreshPromise;
						if (newToken && originalRequest.headers) {
							originalRequest.headers.Authorization = `Bearer ${newToken}`;
							return api(originalRequest);
						}
						throw new Error("Token refresh failed");
					}

					// Start refreshing
					isRefreshing = true;
					refreshPromise = refreshToken();

					const newToken = await refreshPromise;

					if (newToken && originalRequest.headers) {
						originalRequest.headers.Authorization = `Bearer ${newToken}`;
						return api(originalRequest);
					}
				} catch (refreshError) {
					console.error("Token refresh failed:", refreshError);

					// Clear auth state and redirect to login
					localStorage.removeItem("auth-store");
					window.location.href = "/login";

					toast.error("Session expired. Please log in again.");
				} finally {
					isRefreshing = false;
					refreshPromise = null;
				}
			} else {
				// Other 401 errors (invalid token, etc.)
				localStorage.removeItem("auth-store");
				window.location.href = "/login";
			}
		}

		// Handle other errors
		if (error.response?.status === 403) {
			toast.error(
				"Access denied. You do not have permission to perform this action.",
			);
		} else if (error.response?.status === 429) {
			toast.error("Too many requests. Please wait before trying again.");
		} else if (error.response?.status >= 500) {
			toast.error("Server error. Please try again later.");
		}

		return Promise.reject(error);
	},
);

// Token refresh function
async function refreshToken(): Promise<string | null> {
	try {
		const response = await axios.post(
			`${import.meta.env.VITE_API_URL}/api/auth/refresh`,
			{},
			{
				withCredentials: true,
				timeout: 5000,
			},
		);

		if (response.data.success && response.data.data?.accessToken) {
			const newToken = response.data.data.accessToken;

			// Update the token in localStorage
			const authStore = localStorage.getItem("auth-store");
			if (authStore) {
				try {
					const store = JSON.parse(authStore);
					store.state.accessToken = newToken;
					localStorage.setItem("auth-store", JSON.stringify(store));
				} catch (error) {
					console.error("Error updating auth store:", error);
				}
			}

			return newToken;
		}

		return null;
	} catch (error) {
		console.error("Refresh token error:", error);
		return null;
	}
}

export default api;
