import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useUserStore } from "@/stores/userStore";

export function useAuth() {
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();
	const currentUser = useAuthStore((state) => state.currentUser);
	const isAuthStateChecking = useAuthStore(
		(state) => state.isAuthStateChecking,
	);
	const initialize = useAuthStore((state) => state.initialize);
	const getUser = useUserStore((state) => state.getUser);

	useEffect(() => {
		const initAuth = async () => {
			await initialize();
			setIsLoading(false);
		};

		initAuth();
	}, [initialize]);

	useEffect(() => {
		if (isAuthStateChecking && !isLoading) {
			if (currentUser) {
				// ユーザーが認証されている場合、ユーザー情報を取得
				try {
					getUser(currentUser.uid);
				} catch (error) {
					console.error("ユーザー情報の取得に失敗しました:", error);
				}
			} else {
				// ユーザーが認証されていない場合、ログインページにリダイレクト
				router.push("/login");
			}
		}
	}, [currentUser, isAuthStateChecking, isLoading, getUser, router]);

	return {
		isAuthenticated: !!currentUser,
		isLoading: isLoading || !isAuthStateChecking,
		currentUser,
	};
}
