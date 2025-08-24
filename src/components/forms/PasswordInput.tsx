import { forwardRef, useId, useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface PasswordInputProps
	extends Omit<React.ComponentProps<"input">, "type"> {
	label?: string;
	error?: string;
	helperText?: string;
	showStrengthIndicator?: boolean;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
	(
		{
			label = "Password",
			error,
			helperText,
			showStrengthIndicator = false,
			className,
			...props
		},
		ref,
	) => {
		const id = useId();
		const [isVisible, setIsVisible] = useState(false);

		const toggleVisibility = () => setIsVisible((prevState) => !prevState);

		const getPasswordStrength = (
			password: string,
		): { score: number; label: string; color: string } => {
			if (!password) return { score: 0, label: "", color: "" };

			let score = 0;
			if (password.length >= 8) score++;
			if (/[a-z]/.test(password)) score++;
			if (/[A-Z]/.test(password)) score++;
			if (/\d/.test(password)) score++;
			if (/[@$!%*?&]/.test(password)) score++;

			const labels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
			const colors = [
				"bg-red-500",
				"bg-orange-500",
				"bg-yellow-500",
				"bg-blue-500",
				"bg-green-500",
			];

			return {
				score: Math.min(score, 5),
				label: labels[score - 1] || "",
				color: colors[score - 1] || "bg-gray-200",
			};
		};

		const strength =
			showStrengthIndicator && props.value
				? getPasswordStrength(String(props.value))
				: null;

		return (
			<div className="space-y-2">
				<Label htmlFor={id} className={error ? "text-destructive" : ""}>
					{label}
				</Label>
				<div className="relative">
					<Input
						id={id}
						ref={ref}
						className={cn(
							"pe-9",
							error
								? "border-destructive focus-visible:ring-destructive/20"
								: "",
							className,
						)}
						type={isVisible ? "text" : "password"}
						aria-invalid={!!error}
						aria-describedby={
							error
								? `${id}-error`
								: helperText
									? `${id}-helper`
									: undefined
						}
						{...props}
					/>
					<button
						className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-colors outline-none focus:z-10 focus-visible:ring-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
						type="button"
						onClick={toggleVisibility}
						aria-label={
							isVisible ? "Hide password" : "Show password"
						}
						aria-pressed={isVisible}
						tabIndex={-1}
					>
						{isVisible ? (
							<EyeOffIcon size={16} aria-hidden="true" />
						) : (
							<EyeIcon size={16} aria-hidden="true" />
						)}
					</button>
				</div>

				{showStrengthIndicator && strength && strength.score > 0 && (
					<div className="space-y-1">
						<div className="flex space-x-1">
							{[...Array(5)].map((_, i) => (
								<div
									key={i}
									className={cn(
										"h-2 flex-1 rounded-full transition-colors",
										i < strength.score
											? strength.color
											: "bg-gray-200",
									)}
								/>
							))}
						</div>
						<p className="text-muted-foreground text-xs">
							Password strength:{" "}
							<span className="font-medium">
								{strength.label}
							</span>
						</p>
					</div>
				)}

				{error && (
					<p id={`${id}-error`} className="text-destructive text-sm">
						{error}
					</p>
				)}
				{helperText && !error && (
					<p
						id={`${id}-helper`}
						className="text-muted-foreground text-sm"
					>
						{helperText}
					</p>
				)}
			</div>
		);
	},
);

PasswordInput.displayName = "PasswordInput";
