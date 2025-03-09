import React from "react";

type SpinnerProps = {
	size?: "sm" | "md" | "lg";
};

export default function Spinner({ size = "md" }: SpinnerProps) {
	const sizeClass = {
		sm: "w-4 h-4",
		md: "w-8 h-8",
		lg: "w-12 h-12",
	};

	return (
		<div className="flex justify-center items-center">
			<div
				className={`${sizeClass[size]} border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin`}
			></div>
		</div>
	);
}
