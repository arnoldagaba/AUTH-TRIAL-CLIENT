import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, User, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

import { FormInput, PasswordInput } from "@/components/forms";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";
import { registerSchema, type RegisterFormData } from "@/lib/validations/auth";

export function RegisterPage() {
	const navigate = useNavigate();
	const {
		register: registerUser,
		isAuthenticated,
		isLoading,
	} = useAuthStore();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm<RegisterFormData>({
		resolver: zodResolver(registerSchema),
	});

	const password = watch("password");

	// Redirect if already authenticated
	if (isAuthenticated) {
		return <Navigate to="/dashboard" replace />;
	}

	const onSubmit = async (data: RegisterFormData) => {
		setIsSubmitting(true);
		try {
			const result = await registerUser(data);

			if (result.success) {
				toast.success(result.message);
				navigate("/dashboard");
			} else {
				toast.error(result.message);
			}
		} catch (error) {
			toast.error("An unexpected error occurred");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
			<div className="w-full max-w-md space-y-8">
				<div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
						Create your account
					</h2>
					<p className="mt-2 text-center text-sm text-gray-600">
						Or{" "}
						<Link
							to="/login"
							className="text-primary hover:text-primary/80 font-medium"
						>
							sign in to your existing account
						</Link>
					</p>
				</div>

				<div className="rounded-lg bg-white p-8 shadow-md">
					<form
						className="space-y-6"
						onSubmit={handleSubmit(onSubmit)}
					>
						<div className="grid grid-cols-2 gap-4">
							<FormInput
								{...register("firstName")}
								label="First name"
								type="text"
								icon={User}
								placeholder="First name"
								error={errors.firstName?.message}
								disabled={isSubmitting || isLoading}
							/>

							<FormInput
								{...register("lastName")}
								label="Last name"
								type="text"
								icon={User}
								placeholder="Last name"
								error={errors.lastName?.message}
								disabled={isSubmitting || isLoading}
							/>
						</div>

						<FormInput
							{...register("email")}
							label="Email address"
							type="email"
							icon={Mail}
							placeholder="Enter your email"
							error={errors.email?.message}
							disabled={isSubmitting || isLoading}
						/>

						<PasswordInput
							{...register("password")}
							label="Password"
							placeholder="Create a strong password"
							error={errors.password?.message}
							disabled={isSubmitting || isLoading}
							showStrengthIndicator
							value={password || ""}
						/>

						<Button
							type="submit"
							className="w-full"
							disabled={isSubmitting || isLoading}
						>
							{isSubmitting || isLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Creating account...
								</>
							) : (
								"Create account"
							)}
						</Button>

						<div className="text-center text-xs text-gray-600">
							By creating an account, you agree to our{" "}
							<Link
								to="/terms"
								className="text-primary hover:text-primary/80"
							>
								Terms of Service
							</Link>{" "}
							and{" "}
							<Link
								to="/privacy"
								className="text-primary hover:text-primary/80"
							>
								Privacy Policy
							</Link>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
