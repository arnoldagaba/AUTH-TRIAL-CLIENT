import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

import { FormInput, PasswordInput } from "@/components/forms";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";

export function LoginPage() {
	const navigate = useNavigate();
	const { login, isAuthenticated, isLoading } = useAuthStore();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
	});

	// Redirect if already authenticated
	if (isAuthenticated) {
		return <Navigate to="/dashboard" replace />;
	}

	const onSubmit = async (data: LoginFormData) => {
		setIsSubmitting(true);
		try {
			const result = await login(data);

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
						Sign in to your account
					</h2>
					<p className="mt-2 text-center text-sm text-gray-600">
						Or{" "}
						<Link
							to="/register"
							className="text-primary hover:text-primary/80 font-medium"
						>
							create a new account
						</Link>
					</p>
				</div>

				<div className="rounded-lg bg-white p-8 shadow-md">
					<form
						className="space-y-6"
						onSubmit={handleSubmit(onSubmit)}
					>
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
							placeholder="Enter your password"
							error={errors.password?.message}
							disabled={isSubmitting || isLoading}
						/>

						<div className="flex items-center justify-between">
							<div className="text-sm">
								<Link
									to="/forgot-password"
									className="text-primary hover:text-primary/80 font-medium"
								>
									Forgot your password?
								</Link>
							</div>
						</div>

						<Button
							type="submit"
							className="w-full"
							disabled={isSubmitting || isLoading}
						>
							{isSubmitting || isLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Signing in...
								</>
							) : (
								"Sign in"
							)}
						</Button>
					</form>
				</div>
			</div>
		</div>
	);
}
