"use client";

import Header from "@/components/Header";
import SideBar from "@/components/SideBar/SideBar";
import { authContext } from "@/features/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

export default function ProtectedLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { currentUser } = useContext(authContext);
	const router = useRouter();

	useEffect(() => {
		if (!currentUser) {
			router.push("/login");
		}
	}, [currentUser, router]);

	if (!currentUser) {
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
