import { forwardRef, useId } from "react";
import { type LucideIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormInputProps extends React.ComponentProps<"input"> {
	label: string;
	icon?: LucideIcon;
	error?: string;
	helperText?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
	({ label, icon: Icon, error, helperText, className, ...props }, ref) => {
		const id = useId();

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
							"peer",
							Icon ? "pe-9" : "",
							error
								? "border-destructive focus-visible:ring-destructive/20"
								: "",
							className,
						)}
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
					{Icon && (
						<div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50">
							<Icon size={16} aria-hidden="true" />
						</div>
					)}
				</div>
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

FormInput.displayName = "FormInput";