"use client";

import Header from "@/components/Header";
import SideBar from "@/components/SideBar/SideBar";
import { useAuthStore } from "@/stores/authStore";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { User as AppUser } from "@/types/userTypes";

export default function ProtectedLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const currentUser = useAuthStore((state) => state.currentUser);
	const isAuthStateChecking = useAuthStore(
		(state) => state.isAuthStateChecking,
	);
	const getUser = useUserStore((state) => state.getUser);
	const router = useRouter();
	const [userData, setUserData] = useState<AppUser | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	// 認証状態とユーザーデータの処理
	useEffect(() => {
		// 認証されていない場合はログインページにリダイレクト
		if (isAuthStateChecking && !currentUser) {
			router.push("/login");
			return;
		}

		// ユーザーデータを取得
		const fetchUserData = async () => {
			try {
				if (!currentUser) return;
				setIsLoading(true);
				console.log("currentUser", currentUser.uid);
				const user = await getUser(currentUser.uid);
				setUserData(user);
			} catch (error) {
				console.error("ユーザー情報の取得に失敗しました:", error);
			} finally {
				setIsLoading(false);
			}
		};

		if (currentUser) {
			fetchUserData();
		}
	}, [currentUser, isAuthStateChecking, router, getUser]);

	// 認証状態確認中またはユーザーがnullの場合は何も表示しない
	if (!isAuthStateChecking || !currentUser) {
		return null; // ログインページにリダイレクト中は何も表示しない
	}

	// ユーザーデータ取得中はローディング表示
	if (isLoading) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				Loading...
			</div>
		);
	}

	return (
		<div className="min-h-screen">
			<div className="hidden md:block">
				<SideBar
					currentUser={currentUser}
					isAuthenticated={true}
					userData={userData}
				/>
			</div>
			<main className="md:ml-64">{children}</main>
		</div>
	);
}
