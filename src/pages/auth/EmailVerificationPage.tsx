import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { Mail, CheckCircle, XCircle, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";

type VerificationState = "verifying" | "success" | "error";

export function EmailVerificationPage() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const { verifyEmail, resendVerification } = useAuthStore();
	const [state, setState] = useState<VerificationState>("verifying");
	const [isResending, setIsResending] = useState(false);

	const token = searchParams.get("token");

	useEffect(() => {
		if (!token) {
			setState("error");
			return;
		}

		const verify = async () => {
			try {
				const result = await verifyEmail(token);

				if (result.success) {
					setState("success");
					toast.success(result.message);
				} else {
					setState("error");
					toast.error(result.message);
				}
			} catch {
				setState("error");
				toast.error("Email verification failed");
			}
		};

		verify();
	}, [token, verifyEmail]);

	const handleResendVerification = async () => {
		const email = prompt("Please enter your email address:");
		if (!email) return;

		setIsResending(true);
		try {
			const result = await resendVerification(email);

			if (result.success) {
				toast.success(result.message);
			} else {
				toast.error(result.message);
			}
		} catch {
			toast.error("Failed to resend verification email");
		} finally {
			setIsResending(false);
		}
	};

	const renderContent = () => {
		switch (state) {
			case "verifying":
				return (
					<>
						<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
							<Loader2 className="h-6 w-6 animate-spin text-blue-600" />
						</div>
						<h2 className="mt-6 text-3xl font-extrabold text-gray-900">
							Verifying your email
						</h2>
						<p className="mt-2 text-sm text-gray-600">
							Please wait while we verify your email address...
						</p>
					</>
				);

			case "success":
				return (
					<>
						<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
							<CheckCircle className="h-6 w-6 text-green-600" />
						</div>
						<h2 className="mt-6 text-3xl font-extrabold text-gray-900">
							Email verified successfully
						</h2>
						<p className="mt-2 text-sm text-gray-600">
							Your email address has been verified. You can now
							access all features.
						</p>
						<div className="mt-8">
							<Button
								onClick={() => navigate("/dashboard")}
								className="w-full"
							>
								Continue to dashboard
							</Button>
						</div>
					</>
				);

			case "error":
				return (
					<>
						<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
							<XCircle className="h-6 w-6 text-red-600" />
						</div>
						<h2 className="mt-6 text-3xl font-extrabold text-gray-900">
							Email verification failed
						</h2>
						<p className="mt-2 text-sm text-gray-600">
							The verification link is invalid or has expired.
						</p>
						<div className="mt-8 space-y-4">
							<Button
								onClick={handleResendVerification}
								disabled={isResending}
								className="w-full"
							>
								{isResending ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Sending...
									</>
								) : (
									"Resend verification email"
								)}
							</Button>

							<Link
								to="/login"
								className="text-primary hover:text-primary/80 block text-center text-sm font-medium"
							>
								<ArrowLeft className="mr-2 inline h-4 w-4" />
								Back to sign in
							</Link>
						</div>
					</>
				);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
			<div className="w-full max-w-md space-y-8">
				<div className="text-center">{renderContent()}</div>
			</div>
		</div>
	);
}
