import { ReactNode } from "react";
import { Button } from "./Button";
import { FiTrash2 } from "react-icons/fi";

interface DangerButtonProps {
	onClick: (...args: any[]) => void;
	isLoading?: boolean;
	disabled?: boolean;
	icon?: ReactNode;
	children: ReactNode;
	className?: string;
}

export const DangerButton: React.FC<DangerButtonProps> = ({
	onClick,
	isLoading = false,
	disabled = false,
	icon = <FiTrash2 size={18} />,
	children,
	className,
}) => {
	return (
		<Button
			onClick={onClick}
			type="button"
			variant="danger"
			disabled={disabled || isLoading}
			className={`px-8 py-2 inline-flex items-center gap-2 ${className || ""}`}
		>
			{isLoading ? (
				<>
					<span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
