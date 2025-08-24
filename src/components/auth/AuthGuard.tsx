import { useEffect } from "react";
import { Navigate, useLocation } from "react-router";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
// import type { User } from "@/types/auth.types";

interface AuthGuardProps {
	children: React.ReactNode;
	requiredRoles?: Array<"USER" | "ADMIN">;
	requireEmailVerification?: boolean;
}

export function AuthGuard({
	children,
	requiredRoles = ["USER"],
	requireEmailVerification = false,
}: AuthGuardProps) {
	const location = useLocation();
	const { user, isAuthenticated, isLoading, checkAuthStatus } =
		useAuthStore();

	useEffect(() => {
		// Check auth status on mount if not already authenticated
		if (!isAuthenticated && !isLoading) {
			checkAuthStatus();
		}
	}, [isAuthenticated, isLoading, checkAuthStatus]);

	// Show loading while checking auth status
	if (isLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="text-center">
					<Loader2 className="text-primary mx-auto h-8 w-8 animate-spin" />
					<p className="mt-2 text-sm text-gray-600">Loading...</p>
				</div>
			</div>
		);
	}

	// Redirect to login if not authenticated
	if (!isAuthenticated || !user) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	// Check role permissions
	if (requiredRoles && !requiredRoles.includes(user.role)) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="p-8 text-center">
					<h1 className="text-2xl font-bold text-gray-900">
						Access Denied
					</h1>
					<p className="mt-2 text-gray-600">
						You don't have permission to access this page.
					</p>
				</div>
			</div>
		);
	}

	// Check email verification if required
	if (requireEmailVerification && !user.isEmailVerified) {
		return <Navigate to="/verify-email" replace />;
	}

	// Check if account is active
	if (!user.isActive) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="p-8 text-center">
					<h1 className="text-2xl font-bold text-gray-900">
						Account Deactivated
					</h1>
					<p className="mt-2 text-gray-600">
						Your account has been deactivated. Please contact
						support.
					</p>
				</div>
			</div>
		);
	}

	return <>{children}</>;
}
