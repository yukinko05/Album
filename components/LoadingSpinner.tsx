import clsx from "clsx";

interface LoadingSpinnerProps {
	className?: string;
	size?: "sm" | "md" | "lg";
}

export default function LoadingSpinner({
	className,
	size = "md",
}: LoadingSpinnerProps) {
	return (
		<svg
			className={clsx("mr-2", "animate-spin", className, {
				"w-4 h-4": size === "sm",
				"w-5 h-5": size === "md",
				"w-6 h-6": size === "lg",
			})}
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
		>
			<circle
				className="opacity-25"
				cx="12"
				cy="12"
				r="10"
				stroke="currentColor"
				strokeWidth="4"
			/>
			<path
				className="opacity-75"
				fill="currentColor"
				d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
			/>
		</svg>
	);
}
