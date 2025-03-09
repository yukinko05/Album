"use client";

import Header from "@/components/Header";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const router = useRouter();
	const currentUser = useAuthStore((state) => state.currentUser);
	const isAuthStateChecking = useAuthStore((state) => state.isAuthStateChecking);

	// ログイン済みの場合はdashboardにリダイレクト
	useEffect(() => {
		if (isAuthStateChecking && currentUser) {
			router.push("/dashboard");
		}
	}, [currentUser, isAuthStateChecking, router]);

	return (
		<div className="min-h-screen">
			<Header currentUser={currentUser} isAuthenticated={!!currentUser} />
			<main className="pt-16">{children}</main>
		</div>
	);
}
