import { useState } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

import { FormInput } from "@/components/forms";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";
import {
	forgotPasswordSchema,
	type ForgotPasswordFormData,
} from "@/lib/validations/auth";

export function ForgotPasswordPage() {
	const { forgotPassword } = useAuthStore();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ForgotPasswordFormData>({
		resolver: zodResolver(forgotPasswordSchema),
	});

	const onSubmit = async (data: ForgotPasswordFormData) => {
		setIsSubmitting(true);
		try {
			const result = await forgotPassword(data);

			if (result.success) {
				setIsSubmitted(true);
				toast.success(result.message);
			} else {
				toast.error(result.message);
			}
		} catch (error) {
			toast.error("An unexpected error occurred");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isSubmitted) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
				<div className="w-full max-w-md space-y-8">
					<div className="text-center">
						<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
							<Mail className="h-6 w-6 text-green-600" />
						</div>
						<h2 className="mt-6 text-3xl font-extrabold text-gray-900">
							Check your email
						</h2>
						<p className="mt-2 text-sm text-gray-600">
							We've sent a password reset link to your email
							address.
						</p>
					</div>

					<div className="space-y-4 rounded-lg bg-white p-8 text-center shadow-md">
						<p className="text-sm text-gray-600">
							Didn't receive the email? Check your spam folder or{" "}
							<button
								onClick={() => setIsSubmitted(false)}
								className="text-primary hover:text-primary/80 font-medium"
							>
								try again
							</button>
						</p>

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
		);
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
			<div className="w-full max-w-md space-y-8">
				<div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
						Forgot your password?
					</h2>
					<p className="mt-2 text-center text-sm text-gray-600">
						Enter your email address and we'll send you a link to
						reset your password.
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
									Sending reset link...
								</>
							) : (
								"Send reset link"
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
