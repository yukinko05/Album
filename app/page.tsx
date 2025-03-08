"use client";

import { useContext, useEffect } from "react";
import { authContext } from "@/features/auth/AuthProvider";
import { useRouter } from "next/navigation";

export default function HomePage() {
	const { currentUser } = useContext(authContext);
	const router = useRouter();

	useEffect(() => {
		if (currentUser) {
			router.push("/dashboard");
		} else {
			router.push("/login");
		}
	}, [currentUser, router]);

	// リダイレクト中は何も表示しない
	return null;
}
