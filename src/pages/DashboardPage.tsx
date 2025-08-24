import { useEffect, useState } from "react";
import { Users, Mail, Shield, Clock, CheckCircle, XCircle } from "lucide-react";

import { useAuthStore } from "@/store/auth.store";

export function DashboardPage() {
	const { user } = useAuthStore();
	const [currentTime, setCurrentTime] = useState(new Date());

	useEffect(() => {
		const timer = setInterval(() => setCurrentTime(new Date()), 1000);
		return () => clearInterval(timer);
	}, []);

	const stats = [
		{
			name: "Account Status",
			value: user?.isActive ? "Active" : "Inactive",
			icon: user?.isActive ? CheckCircle : XCircle,
			color: user?.isActive ? "text-green-600" : "text-red-600",
		},
		{
			name: "Email Status",
			value: user?.isEmailVerified ? "Verified" : "Unverified",
			icon: Mail,
			color: user?.isEmailVerified ? "text-green-600" : "text-yellow-600",
		},
		{
			name: "User Role",
			value: user?.role || "Unknown",
			icon: Shield,
			color: "text-blue-600",
		},
		{
			name: "Last Login",
			value: user?.lastLogin
				? new Date(user.lastLogin).toLocaleDateString()
				: "Never",
			icon: Clock,
			color: "text-gray-600",
		},
	];

	return (
		<div className="space-y-6">
			{/* Welcome Section */}
			<div className="rounded-lg bg-white p-6 shadow">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-bold text-gray-900">
							Welcome back, {user?.firstName || user?.email}!
						</h1>
						<p className="text-gray-600">
							{currentTime.toLocaleDateString("en-US", {
								weekday: "long",
								year: "numeric",
								month: "long",
								day: "numeric",
							})}
						</p>
					</div>
					<div className="text-right">
						<p className="text-primary text-3xl font-bold">
							{currentTime.toLocaleTimeString("en-US", {
								hour: "2-digit",
								minute: "2-digit",
							})}
						</p>
					</div>
				</div>
			</div>

			{/* Stats Grid */}
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
				{stats.map((stat) => (
					<div
						key={stat.name}
						className="rounded-lg bg-white p-6 shadow"
					>
						<div className="flex items-center">
							<div className={`flex-shrink-0 ${stat.color}`}>
								<stat.icon className="h-8 w-8" />
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-gray-500">
									{stat.name}
								</p>
								<p className="text-2xl font-semibold text-gray-900">
									{stat.value}
								</p>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Quick Actions */}
			<div className="rounded-lg bg-white shadow">
				<div className="border-b border-gray-200 px-6 py-4">
					<h3 className="text-lg font-medium text-gray-900">
						Quick Actions
					</h3>
				</div>
				<div className="p-6">
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
						<a
							href="/profile"
							className="group focus-within:ring-primary relative rounded-lg border border-gray-300 bg-white p-6 focus-within:ring-2 focus-within:ring-inset hover:border-gray-400"
						>
							<div>
								<span className="bg-primary inline-flex rounded-lg p-3 text-white">
									<Users className="h-6 w-6" />
								</span>
							</div>
							<div className="mt-4">
								<h3 className="text-lg font-medium text-gray-900">
									Update Profile
								</h3>
								<p className="mt-2 text-sm text-gray-500">
									Update your personal information and
									preferences
								</p>
							</div>
						</a>

						<a
							href="/profile?tab=password"
							className="group focus-within:ring-primary relative rounded-lg border border-gray-300 bg-white p-6 focus-within:ring-2 focus-within:ring-inset hover:border-gray-400"
						>
							<div>
								<span className="bg-primary inline-flex rounded-lg p-3 text-white">
									<Shield className="h-6 w-6" />
								</span>
							</div>
							<div className="mt-4">
								<h3 className="text-lg font-medium text-gray-900">
									Change Password
								</h3>
								<p className="mt-2 text-sm text-gray-500">
									Update your password to keep your account
									secure
								</p>
							</div>
						</a>

						{!user?.isEmailVerified && (
							<div className="group relative rounded-lg border border-yellow-200 bg-yellow-50 p-6">
								<div>
									<span className="inline-flex rounded-lg bg-yellow-400 p-3 text-white">
										<Mail className="h-6 w-6" />
									</span>
								</div>
								<div className="mt-4">
									<h3 className="text-lg font-medium text-gray-900">
										Verify Email
									</h3>
									<p className="mt-2 text-sm text-gray-600">
										Please verify your email address to
										access all features
									</p>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Recent Activity - Placeholder */}
			<div className="rounded-lg bg-white shadow">
				<div className="border-b border-gray-200 px-6 py-4">
					<h3 className="text-lg font-medium text-gray-900">
						Recent Activity
					</h3>
				</div>
				<div className="p-6">
					<div className="py-12 text-center">
						<Clock className="mx-auto h-12 w-12 text-gray-400" />
						<h3 className="mt-2 text-sm font-medium text-gray-900">
							No recent activity
						</h3>
						<p className="mt-1 text-sm text-gray-500">
							Your recent account activity will appear here
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
