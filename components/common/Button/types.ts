export const BUTTON_VARIANTS = {
	primary: "primary",
	secondary: "secondary",
	danger: "danger",
	ghost: "ghost",
} as const;

export const BUTTON_SIZES = {
	sm: "sm",
	md: "md",
	lg: "lg",
} as const;

export type ButtonVariant = keyof typeof BUTTON_VARIANTS;
export type ButtonSize = keyof typeof BUTTON_SIZES;

export interface BaseButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	size?: ButtonSize;
	isLoading?: boolean;
	isFullWidth?: boolean;
	leftIcon?: React.ReactNode;
	rightIcon?: React.ReactNode;
}

export interface ActionButtonProps extends BaseButtonProps {
	type: "button";
	onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface SubmitButtonProps extends BaseButtonProps {
	type: "submit";
	onClick?: never; // submitボタンではonClickを使用しない
}

export type ButtonProps = ActionButtonProps | SubmitButtonProps;
