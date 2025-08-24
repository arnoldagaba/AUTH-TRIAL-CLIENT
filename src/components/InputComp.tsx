import { useId } from "react";
import { type LucideIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type InputProps = {
	label: string;
	icon: LucideIcon;
	type: string;
};

export default function InputComp({ label, icon: Icon, type }: InputProps) {
	const id = useId();
	return (
		<div className="*:not-first:mt-2">
			<Label htmlFor={id}>{label}</Label>
			<div className="relative">
				<Input
					id={id}
					className="peer pe-9"
					placeholder={label}
					type={type}
				/>
				<div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50">
					<Icon size={16} aria-hidden="true" />
				</div>
			</div>
		</div>
	);
}
