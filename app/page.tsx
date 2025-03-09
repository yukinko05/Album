"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function HomePage() {
	const { currentUser, isAuthenticated } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (isAuthenticated) {
			router.push("/dashboard");
		} else {
			console.log("ログインしていません");
			router.push("/login");
		}
	}, [isAuthenticated, router]);

	// リダイレクト中は何も表示しない
	return null;
}
