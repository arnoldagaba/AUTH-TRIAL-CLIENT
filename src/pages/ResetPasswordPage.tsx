import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import { toast } from "react-toastify";

import { PasswordInput } from "@/components/forms";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";
import {
	resetPasswordSchema,
	type ResetPasswordFormData,
} from "@/lib/validations/auth";

export function ResetPasswordPage() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const { resetPassword } = useAuthStore();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);

	const token = searchParams.get("token");

	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm<ResetPasswordFormData>({
		resolver: zodResolver(resetPasswordSchema),
	});

	const password = watch("newPassword");

	useEffect(() => {
		if (!token) {
			toast.error("Invalid reset link");
			navigate("/login");
		}
	}, [token, navigate]);

	const onSubmit = async (data: ResetPasswordFormData) => {
		if (!token) return;

		setIsSubmitting(true);
		try {
			const result = await resetPassword({
				token,
				newPassword: data.newPassword,
			});

			if (result.success) {
				setIsSuccess(true);
				toast.success(result.message);
			} else {
				toast.error(result.message);
			}
		} catch {
			toast.error("An unexpected error occurred");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isSuccess) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
				<div className="w-full max-w-md space-y-8">
					<div className="text-center">
						<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
							<CheckCircle className="h-6 w-6 text-green-600" />
						</div>
						<h2 className="mt-6 text-3xl font-extrabold text-gray-900">
							Password reset successful
						</h2>
						<p className="mt-2 text-sm text-gray-600">
							Your password has been successfully reset.
						</p>
					</div>

					<div className="rounded-lg bg-white p-8 text-center shadow-md">
						<Button
							onClick={() => navigate("/login")}
							className="w-full"
						>
							Sign in with new password
						</Button>
					</div>
				</div>
			</div>
		);
	}

	if (!token) {
		return null; // Will redirect in useEffect
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
			<div className="w-full max-w-md space-y-8">
				<div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
						Reset your password
					</h2>
					<p className="mt-2 text-center text-sm text-gray-600">
						Enter your new password below
					</p>
				</div>

				<div className="rounded-lg bg-white p-8 shadow-md">
					<form
						className="space-y-6"
						onSubmit={handleSubmit(onSubmit)}
					>
						<PasswordInput
							{...register("newPassword")}
							label="New password"
							placeholder="Enter your new password"
							error={errors.newPassword?.message}
							disabled={isSubmitting}
							showStrengthIndicator
							value={password || ""}
						/>

						<PasswordInput
							{...register("confirmPassword")}
							label="Confirm password"
							placeholder="Confirm your new password"
							error={errors.confirmPassword?.message}
							disabled={isSubmitting}
						/>

						<Button
							type="submit"
							className="w-full"
							disabled={isSubmitting}
						>
							{isSubmitting ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Resetting password...
								</>
							) : (
								"Reset password"
							)}
						</Button>
					</form>

					<div className="mt-6 text-center">
						<Link
							to="/login"
							className="text-primary hover:text-primary/80 inline-flex items-center text-sm font-medium"
						>
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to sign in
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
