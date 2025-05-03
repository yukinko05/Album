import clsx from "clsx";
import { BaseButtonProps } from "./types";
import LoadingSpinner from "../../LoadingSpinner";

export const Button: React.FC<BaseButtonProps> = ({
	variant = "primary",
	size = "md",
	type = "button",
	isLoading = false,
	isFullWidth = false,
	leftIcon,
	rightIcon,
	className,
	children,
	disabled,
	onClick,
	...props
}) => {
	const buttonClasses = clsx(
		//ベースクラス
		"inline-flex items-center justify-center font-medium",
		"transition-colors duration-200",
		"focus:outline-none focus:ring-2 focus:ring-offset-2",
		"disabled:opacity-50 disabled:cursor-not-allowed",
		{ "rounded-md": variant !== "circle" },

		//バリアント
		{
			// Primary
			"bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 focus:ring-orange-500":
				variant === "primary",

			// Secondary
			"bg-white border border-amber-300 text-orange-700 rounded-lg hover:bg-amber-50 transition-colors":
				variant === "secondary",

			// Danger
			"bg-red-600 text-white hover:bg-red-700 focus:ring-red-500":
				variant === "danger",

			// Ghost
			"bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-500":
				variant === "ghost",

			// Circle
			"rounded-full bg-orange-100 text-orange-800 hover:bg-orange-200 hover:rounded-full transition-colors":
				variant === "circle",
		},

		//サイズ
		{
			"w-8 h-8": size === "sm" && variant === "circle",
			"w-10 h-10": size === "md" && variant === "circle",
			"w-12 h-12": size === "lg" && variant === "circle",
			"px-3 py-2 text-sm": size === "sm" && variant !== "circle",
			"px-4 py-2 text-base": size === "md" && variant !== "circle",
			"px-6 py-3 text-lg": size === "lg" && variant !== "circle",
		},

		//幅
		{
			"w-full": isFullWidth && variant !== "circle",
		},

		//カスタムクラス
		className,
	);

	return (
		<button
			type={type}
			className={buttonClasses}
			disabled={disabled || isLoading}
			onClick={onClick}
			{...props}
		>
			{isLoading && <LoadingSpinner size={size} className={"mr-2"} />}
			{leftIcon && <span className="mr-2">{leftIcon}</span>}
			{children}
			{rightIcon && <span className="ml-2">{rightIcon}</span>}
		</button>
	);
};
