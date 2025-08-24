import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
	User,
	Settings,
	LogOut,
	Menu,
	X,
	Bell,
	ChevronDown,
} from "lucide-react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";

export function Header() {
	const navigate = useNavigate();
	const { user, logout } = useAuthStore();
	const [isProfileOpen, setIsProfileOpen] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const handleLogout = async () => {
		try {
			await logout();
			toast.success("Logged out successfully");
			navigate("/login");
		} catch {
			toast.error("Failed to logout");
		}
	};

	const getInitials = (firstName?: string, lastName?: string) => {
		if (!firstName && !lastName)
			return user?.email?.charAt(0).toUpperCase() || "U";
		return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
	};

	return (
		<header className="border-b border-gray-200 bg-white shadow-sm">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between">
					{/* Logo */}
					<div className="flex items-center">
						<Link to="/dashboard" className="flex items-center">
							<div className="bg-primary flex h-8 w-8 items-center justify-center rounded-md">
								<span className="text-sm font-bold text-white">
									A
								</span>
							</div>
							<span className="ml-2 text-xl font-semibold text-gray-900">
								App
							</span>
						</Link>
					</div>

					{/* Desktop Navigation */}
					<div className="hidden items-center space-x-4 md:flex">
						<Link
							to="/dashboard"
							className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
						>
							Dashboard
						</Link>
						<Link
							to="/profile"
							className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
						>
							Profile
						</Link>
					</div>

					{/* Right side */}
					<div className="flex items-center space-x-4">
						{/* Notifications */}
						<Button
							variant="ghost"
							size="icon"
							className="relative"
						>
							<Bell className="h-5 w-5" />
							<span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
						</Button>

						{/* Profile Dropdown */}
						<div className="relative">
							<button
								onClick={() => setIsProfileOpen(!isProfileOpen)}
								className="focus:ring-primary flex items-center space-x-3 rounded-full text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none"
							>
								<div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
									<span className="text-sm font-medium text-gray-600">
										{getInitials(
											user?.firstName,
											user?.lastName,
										)}
									</span>
								</div>
								<div className="hidden items-center space-x-1 md:flex">
									<span className="font-medium text-gray-700">
										{user?.firstName
											? `${user.firstName} ${user?.lastName || ""}`
											: user?.email}
									</span>
									<ChevronDown className="h-4 w-4 text-gray-400" />
								</div>
							</button>

							{isProfileOpen && (
								<>
									{/* Overlay */}
									<div
										className="fixed inset-0 z-10"
										onClick={() => setIsProfileOpen(false)}
									/>

									{/* Dropdown */}
									<div className="absolute right-0 z-20 mt-2 w-48 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
										<div className="border-b border-gray-100 px-4 py-2">
											<p className="text-sm font-medium text-gray-900">
												{user?.firstName
													? `${user.firstName} ${user?.lastName || ""}`
													: user?.email}
											</p>
											<p className="text-xs text-gray-500">
												{user?.email}
											</p>
										</div>

										<Link
											to="/profile"
											className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
											onClick={() =>
												setIsProfileOpen(false)
											}
										>
											<User className="mr-3 h-4 w-4" />
											Profile
										</Link>

										<Link
											to="/settings"
											className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
											onClick={() =>
												setIsProfileOpen(false)
											}
										>
											<Settings className="mr-3 h-4 w-4" />
											Settings
										</Link>

										<button
											onClick={handleLogout}
											className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
										>
											<LogOut className="mr-3 h-4 w-4" />
											Sign out
										</button>
									</div>
								</>
							)}
						</div>

						{/* Mobile menu button */}
						<div className="md:hidden">
							<Button
								variant="ghost"
								size="icon"
								onClick={() =>
									setIsMobileMenuOpen(!isMobileMenuOpen)
								}
							>
								{isMobileMenuOpen ? (
									<X className="h-6 w-6" />
								) : (
									<Menu className="h-6 w-6" />
								)}
							</Button>
						</div>
					</div>
				</div>

				{/* Mobile menu */}
				{isMobileMenuOpen && (
					<div className="md:hidden">
						<div className="space-y-1 border-t border-gray-200 px-2 pt-2 pb-3 sm:px-3">
							<Link
								to="/dashboard"
								className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
								onClick={() => setIsMobileMenuOpen(false)}
							>
								Dashboard
							</Link>
							<Link
								to="/profile"
								className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
								onClick={() => setIsMobileMenuOpen(false)}
							>
								Profile
							</Link>
						</div>
					</div>
				)}
			</div>
		</header>
	);
}
