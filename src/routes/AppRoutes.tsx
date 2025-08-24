import { BrowserRouter, Route, Routes, Navigate } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";

// Layout components
import { DashboardLayout } from "@/components/layout/DashboardLayout";

// Auth components
import { AuthGuard } from "@/components/auth/AuthGuard";
import { GuestGuard } from "@/components/auth/GuestGuard";

// Pages
import { LoginPage } from "@/pages/auth/LoginPage";
import { RegisterPage } from "@/pages/auth/RegisterPage";
import { ForgotPasswordPage } from "@/pages/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "@/pages/auth/ResetPasswordPage";
import { EmailVerificationPage } from "@/pages/auth/EmailVerificationPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { ProfilePage } from "@/pages/ProfilePage";

// Create a client
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 1,
			refetchOnWindowFocus: false,
		},
	},
});

const AppRoutes = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<Routes>
					{/* Redirect root to dashboard */}
					<Route
						path="/"
						element={<Navigate to="/dashboard" replace />}
					/>

					{/* Public routes (guests only) */}
					<Route
						path="/login"
						element={
							<GuestGuard>
								<LoginPage />
							</GuestGuard>
						}
					/>
					<Route
						path="/register"
						element={
							<GuestGuard>
								<RegisterPage />
							</GuestGuard>
						}
					/>
					<Route
						path="/forgot-password"
						element={
							<GuestGuard>
								<ForgotPasswordPage />
							</GuestGuard>
						}
					/>
					<Route
						path="/reset-password"
						element={
							<GuestGuard>
								<ResetPasswordPage />
							</GuestGuard>
						}
					/>

					{/* Email verification (accessible to all) */}
					<Route
						path="/verify-email"
						element={<EmailVerificationPage />}
					/>

					{/* Protected routes */}
					<Route
						path="/dashboard"
						element={
							<AuthGuard>
								<DashboardLayout>
									<DashboardPage />
								</DashboardLayout>
							</AuthGuard>
						}
					/>
					<Route
						path="/profile"
						element={
							<AuthGuard>
								<DashboardLayout>
									<ProfilePage />
								</DashboardLayout>
							</AuthGuard>
						}
					/>

					{/* Catch-all route */}
					<Route
						path="*"
						element={
							<div className="flex min-h-screen items-center justify-center">
								<div className="text-center">
									<h1 className="text-4xl font-bold text-gray-900">
										404
									</h1>
									<p className="mt-2 text-gray-600">
										Page not found
									</p>
									<a
										href="/dashboard"
										className="text-primary hover:text-primary/80 mt-4 inline-block"
									>
										Go to Dashboard
									</a>
								</div>
							</div>
						}
					/>
				</Routes>

				<ToastContainer
					position="top-right"
					autoClose={5000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
					theme="light"
				/>
			</BrowserRouter>
		</QueryClientProvider>
	);
};

export default AppRoutes;
