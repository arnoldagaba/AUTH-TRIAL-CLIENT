import { Header } from "./Header";

interface DashboardLayoutProps {
	children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
	return (
		<div className="min-h-screen bg-gray-50">
			<Header />
			<main className="py-6">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					{children}
				</div>
			</main>
		</div>
	);
}
