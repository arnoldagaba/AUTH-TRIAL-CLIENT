import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Mail, Shield, Smartphone, Loader2, Save } from "lucide-react";
import { toast } from "react-toastify";

import { FormInput, PasswordInput } from "@/components/forms";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";
import {
	updateProfileSchema,
	changePasswordSchema,
	type UpdateProfileFormData,
	type ChangePasswordFormData,
} from "@/lib/validations/auth";

export function ProfilePage() {
	const { user, updateProfile, changePassword } = useAuthStore();
	const [activeTab, setActiveTab] = useState<
		"profile" | "password" | "sessions"
	>("profile");
	const [isUpdating, setIsUpdating] = useState(false);
	const [isChangingPassword, setIsChangingPassword] = useState(false);

	// Profile form
	const profileForm = useForm<UpdateProfileFormData>({
		resolver: zodResolver(updateProfileSchema),
		defaultValues: {
			firstName: user?.firstName || "",
			lastName: user?.lastName || "",
		},
	});

	// Password form
	const passwordForm = useForm<ChangePasswordFormData>({
		resolver: zodResolver(changePasswordSchema),
	});

	const handleProfileUpdate = async (data: UpdateProfileFormData) => {
		setIsUpdating(true);
		try {
			const result = await updateProfile(data);

			if (result.success) {
				toast.success(result.message);
			} else {
				toast.error(result.message);
			}
		} catch {
			toast.error("Failed to update profile");
		} finally {
			setIsUpdating(false);
		}
	};

	const handlePasswordChange = async (data: ChangePasswordFormData) => {
		setIsChangingPassword(true);
		try {
			const result = await changePassword(data);

			if (result.success) {
				toast.success(result.message);
				passwordForm.reset();
				// User will be logged out automatically
			} else {
				toast.error(result.message);
			}
		} catch {
			toast.error("Failed to change password");
		} finally {
			setIsChangingPassword(false);
		}
	};

	const tabs = [
		{ id: "profile", label: "Profile", icon: User },
		{ id: "password", label: "Password", icon: Shield },
		{ id: "sessions", label: "Sessions", icon: Smartphone },
	] as const;

	return (
		<div className="mx-auto max-w-4xl p-6">
			<div className="rounded-lg bg-white shadow">
				{/* Header */}
				<div className="border-b border-gray-200 px-6 py-4">
					<h1 className="text-2xl font-bold text-gray-900">
						Account Settings
					</h1>
					<p className="text-sm text-gray-600">
						Manage your account preferences and security settings
					</p>
				</div>

				{/* Tabs */}
				<div className="border-b border-gray-200">
					<nav className="-mb-px flex space-x-8 px-6">
						{tabs.map(({ id, label, icon: Icon }) => (
							<button
								key={id}
								onClick={() => setActiveTab(id)}
								className={`flex items-center border-b-2 px-1 py-4 text-sm font-medium ${
									activeTab === id
										? "border-primary text-primary"
										: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
								}`}
							>
								<Icon className="mr-2 h-4 w-4" />
								{label}
							</button>
						))}
					</nav>
				</div>

				{/* Content */}
				<div className="p-6">
					{activeTab === "profile" && (
						<div className="space-y-6">
							<div>
								<h3 className="text-lg font-medium text-gray-900">
									Profile Information
								</h3>
								<p className="text-sm text-gray-600">
									Update your personal information
								</p>
							</div>

							<form
								onSubmit={profileForm.handleSubmit(
									handleProfileUpdate,
								)}
								className="space-y-4"
							>
								<div className="grid grid-cols-2 gap-4">
									<FormInput
										{...profileForm.register("firstName")}
										label="First name"
										type="text"
										placeholder="Enter your first name"
										error={
											profileForm.formState.errors
												.firstName?.message
										}
										disabled={isUpdating}
									/>

									<FormInput
										{...profileForm.register("lastName")}
										label="Last name"
										type="text"
										placeholder="Enter your last name"
										error={
											profileForm.formState.errors
												.lastName?.message
										}
										disabled={isUpdating}
									/>
								</div>

								<div className="flex items-center space-x-2">
									<Mail className="h-4 w-4 text-gray-400" />
									<span className="text-sm text-gray-600">
										Email: {user?.email}
										{user?.isEmailVerified ? (
											<span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
												Verified
											</span>
										) : (
											<span className="ml-2 inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
												Unverified
											</span>
										)}
									</span>
								</div>

								<div className="pt-4">
									<Button type="submit" disabled={isUpdating}>
										{isUpdating ? (
											<>
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
												Saving...
											</>
										) : (
											<>
												<Save className="mr-2 h-4 w-4" />
												Save Changes
											</>
										)}
									</Button>
								</div>
							</form>
						</div>
					)}

					{activeTab === "password" && (
						<div className="space-y-6">
							<div>
								<h3 className="text-lg font-medium text-gray-900">
									Change Password
								</h3>
								<p className="text-sm text-gray-600">
									Update your password to keep your account
									secure
								</p>
							</div>

							<form
								onSubmit={passwordForm.handleSubmit(
									handlePasswordChange,
								)}
								className="max-w-md space-y-4"
							>
								<PasswordInput
									{...passwordForm.register(
										"currentPassword",
									)}
									label="Current password"
									placeholder="Enter your current password"
									error={
										passwordForm.formState.errors
											.currentPassword?.message
									}
									disabled={isChangingPassword}
								/>

								<PasswordInput
									{...passwordForm.register("newPassword")}
									label="New password"
									placeholder="Enter your new password"
									error={
										passwordForm.formState.errors
											.newPassword?.message
									}
									disabled={isChangingPassword}
									showStrengthIndicator
									value={
										passwordForm.watch("newPassword") || ""
									}
								/>

								<PasswordInput
									{...passwordForm.register(
										"confirmPassword",
									)}
									label="Confirm new password"
									placeholder="Confirm your new password"
									error={
										passwordForm.formState.errors
											.confirmPassword?.message
									}
									disabled={isChangingPassword}
								/>

								<div className="pt-4">
									<Button
										type="submit"
										disabled={isChangingPassword}
									>
										{isChangingPassword ? (
											<>
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
												Changing Password...
											</>
										) : (
											"Change Password"
										)}
									</Button>
								</div>

								<div className="rounded-md bg-amber-50 p-3 text-sm text-amber-600">
									<strong>Note:</strong> Changing your
									password will log you out from all devices.
									You'll need to sign in again with your new
									password.
								</div>
							</form>
						</div>
					)}

					{activeTab === "sessions" && (
						<div className="space-y-6">
							<div>
								<h3 className="text-lg font-medium text-gray-900">
									Active Sessions
								</h3>
								<p className="text-sm text-gray-600">
									Manage where you're signed in
								</p>
							</div>

							<div className="py-12 text-center">
								<Smartphone className="mx-auto h-12 w-12 text-gray-400" />
								<h3 className="mt-2 text-sm font-medium text-gray-900">
									Session management
								</h3>
								<p className="mt-1 text-sm text-gray-500">
									Session management features will be
									available here
								</p>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
