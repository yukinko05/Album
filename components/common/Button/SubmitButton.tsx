import { ReactNode } from "react";
import { Button } from "./Button";
import { FiCheck } from "react-icons/fi";
import { LoadingIndicator } from "@/components/common/LoadingIndicator";

interface SubmitButtonProps {
	onClick?: (...args: any[]) => void;
	type?: "button" | "submit";
	isLoading?: boolean;
	disabled?: boolean;
	icon?: ReactNode;
	children: ReactNode;
	className?: string;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
	onClick,
	type = "submit",
	isLoading = false,
	disabled = false,
	icon = <FiCheck size={18} />,
	children,
	className,
}) => {
	return (
		<Button
			onClick={onClick}
			type={type}
			variant="primary"
			disabled={disabled || isLoading}
			className={`px-8 py-2 inline-flex items-center gap-2 ${className || ""}`}
		>
			{isLoading ? (
				<>
					<LoadingIndicator color="white" size="md" className="mr-2" />
					処理中...
				</>
			) : (
				<>
					{icon}
					{children}
				</>
			)}
		</Button>
	);
};
