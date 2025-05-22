"use client";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "next/navigation";
import SideBar from "@/components/common/SideBar";
import type { User as AppUser } from "@/types/userTypes";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function ProtectedLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const router = useRouter();
	const currentUser = useAuthStore((state) => state.currentUser);
	const isAuthStateChecking = useAuthStore(
		(state) => state.isAuthStateChecking,
	);
	const getUser = useUserStore((state) => state.getUser);

	const [userData, setUserData] = useState<AppUser | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// 認証状態のチェックとユーザーデータの取得
	useEffect(() => {
		if (!isAuthStateChecking && !currentUser) {
			router.push("/login");
		}

		const fetchUserData = async () => {
			if (!currentUser) {
				router.push("/login");
				return;
			}

			try {
				setIsLoading(true);
				const user = await getUser(currentUser.uid);
				setUserData(user);
			} catch (error) {
				console.error("ユーザー情報の取得に失敗しました:", error);
				router.push("/login");
			} finally {
				setIsLoading(false);
			}
		};

		if (currentUser && !isAuthStateChecking) {
			fetchUserData();
		}
	}, [currentUser, isAuthStateChecking, getUser]);

	if (!currentUser || !userData) {
		return null;
	}

	// ユーザーデータ取得中はローディング表示
	if (isLoading || isAuthStateChecking) {
		return (
			<div className="flex justify-center items-center py-12">
				<LoadingSpinner size="md" />
			</div>
		);
	}

	return (
		<div>
			{/* サイドバー */}
			<SideBar userData={userData} />
			{/* メインコンテンツ */}
			<main className="py-6 lg:pl-72">{children}</main>
		</div>
	);
}
