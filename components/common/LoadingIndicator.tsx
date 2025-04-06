interface LoadingIndicatorProps {
	size?: "sm" | "md" | "lg";
	className?: string;
	color?: "white" | "orange";
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
	size = "md",
	className = "",
	color = "white",
}) => {
	const sizeClass = {
		sm: "w-3 h-3",
		md: "w-4 h-4",
		lg: "w-5 h-5",
	}[size];

	const colorClass = {
		white: "border-white border-t-transparent",
		orange: "border-orange-500 border-t-transparent",
	}[color];

	return (
		<span
			className={`inline-block ${sizeClass} border-2 ${colorClass} rounded-full animate-spin ${className}`}
		/>
	);
};
