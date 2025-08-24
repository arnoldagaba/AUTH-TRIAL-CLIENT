import { Navigate } from "react-router";
import { useAuthStore } from "@/store/auth.store";

interface GuestGuardProps {
	children: React.ReactNode;
	redirectTo?: string;
}

export function GuestGuard({
	children,
	redirectTo = "/dashboard",
}: GuestGuardProps) {
	const { isAuthenticated } = useAuthStore();

	// Redirect authenticated users
	if (isAuthenticated) {
		return <Navigate to={redirectTo} replace />;
	}

	return <>{children}</>;
}
