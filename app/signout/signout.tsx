"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";

export default function SignOut() {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const logout = useAuthStore((state) => state.logout);

	const handleSubmit = async () => {
		setIsLoading(true);

		try {
			await logout();
			router.push("/login");
		} catch (error) {
			alert("ログアウトに失敗しました。もう一度お試しください。");
			console.error("Sign out error:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<button
			type="button"
			onClick={handleSubmit}
			className="w-full py-2 mt-4 text-center bg-white/10 text-white rounded hover:bg-white/20 transition-colors"
		>
			{isLoading ? "ログアウト中..." : "ログアウト"}
		</button>
	);
}
