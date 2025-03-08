"use client";

import Header from "@/components/Header";
import SideBar from "@/components/SideBar/SideBar";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { currentUser, isAuthenticated } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!isAuthenticated) {
			router.push("/login");
		}
	}, [isAuthenticated, router]);

	if (!isAuthenticated) {
		return null; // ログインページにリダイレクト中は何も表示しない
	}

	return (
		<div className="min-h-screen">
			<div className="hidden md:block">
				<SideBar />
			</div>
			<main className="md:ml-64 px-8 pt-8">{children}</main>
		</div>
	);
}
