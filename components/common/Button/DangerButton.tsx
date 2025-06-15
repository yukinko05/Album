import { ReactNode } from "react";
import { Button } from "./Button";
import { TrashIcon } from "@heroicons/react/24/outline";
import { LoadingIndicator } from "@/components/common/LoadingIndicator";

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
	icon = <TrashIcon className="h-5 w-5" aria-hidden="true" />,
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
