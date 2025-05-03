import { Button } from "./Button";

interface CancelButtonProps {
	onClick: () => void;
	size?: "sm" | "md" | "lg";
	className?: string;
	"aria-label"?: string;
	isFullWidth?: boolean;
	disabled?: boolean;
}

export const CancelButton: React.FC<CancelButtonProps> = ({
	onClick,
	size = "md",
	className,
	"aria-label": ariaLabel = "キャンセル",
	isFullWidth = false,
	disabled = false,
}) => {
	return (
		<Button
			onClick={onClick}
			variant="secondary"
			size={size}
			className={className}
			aria-label={ariaLabel}
			isFullWidth={isFullWidth}
			disabled={disabled}
		>
			キャンセル
		</Button>
	);
};
