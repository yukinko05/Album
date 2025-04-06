import { ReactNode } from "react";
import { Button } from "./Button";

interface IconButtonProps {
	onClick: () => void;
	icon: ReactNode;
	variant?: "primary" | "secondary" | "danger" | "ghost";
	size?: "sm" | "md" | "lg";
	className?: string;
	"aria-label": string;
	disabled?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({
	onClick,
	icon,
	variant = "primary",
	size = "md",
	className,
	"aria-label": ariaLabel,
	disabled = false,
}) => {
	return (
		<Button
			onClick={onClick}
			variant={variant}
			size={size}
			className={`p-2 ${className || ""}`}
			aria-label={ariaLabel}
			disabled={disabled}
		>
			{icon}
		</Button>
	);
};
