import { Button } from "./Button";
import { ReactNode } from "react";

interface CircleButtonProps {
	onClick: () => void;
	size?: "sm" | "md" | "lg";
	className?: string;
	"aria-label": string;
	children: ReactNode;
}

export const CircleCancelButton: React.FC<CircleButtonProps> = ({
	onClick,
	size = "md",
	className,
	"aria-label": ariaLabel,
	children,
}) => {
	return (
		<Button
			onClick={onClick}
			variant="circle"
			size={size}
			className={className}
			aria-label={ariaLabel}
		>
			{children}
		</Button>
	);
};
