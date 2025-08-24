import { AuthGuard } from "./AuthGuard";

interface AdminGuardProps {
	children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
	return <AuthGuard requiredRoles={["ADMIN"]}>{children}</AuthGuard>;
}
