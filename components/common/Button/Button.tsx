import clsx from "clsx";
import { BaseButtonProps } from "./types";
import { LoadingSpinner } from "../LoadingSpinner";

export const Button: React.FC<BaseButtonProps> = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  isFullWidth = false,
  leftIcon,
  rightIcon,
  className,
  children,
  disabled,
  ...props
}) => {
  const buttonClasses = clsx(
    //ベースクラス
    "inline-flex items-center justify-center rounded-md font-medium",
    "transition-colors duration-200",
    "focus:outline-none focus:ring-2 focus:ring-offset-2",
    "disabled:opacity-50 disabled:cursor-not-allowed",

    //バリアント
    {
      // Primary
      "bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 focus:ring-orange-500":
        variant === "primary",

      // Secondary
      "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-orange-500":
        variant === "secondary",

      // Danger
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500":
        variant === "danger",

      // Ghost
      "bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-500":
        variant === "ghost",
    },

    //サイズ
    {
      "px-3 py-2 text-sm": size === "sm",
      "px-4 py-2 text-base": size === "md",
      "px-6 py-3 text-lg": size === "lg",
    },

    //幅
    {
      "w-full": isFullWidth,
    },

    //カスタムクラス
    className,
  );

  return (
    <button
      className={buttonClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <LoadingSpinner
          className={clsx("mr-2", {
            "w-4 h-4": size === "sm",
            "w-5 h-5": size === "md",
            "w-6 h-6": size === "lg",
          })}
        />
      )}
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};
