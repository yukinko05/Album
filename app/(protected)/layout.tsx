"use client";
import { useState, useEffect, createContext } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import SideBar from "@/components/common/SideBar";
import { Button } from "@/components/common/Button/Button";
import { FiMenu, FiX } from "react-icons/fi";
import type { User as AppUser } from "@/types/userTypes";
import LoadingSpinner from "@/components/LoadingSpinner";

// サイドバーの状態を共有するコンテキストを作成
export const SidebarContext = createContext<{
	sideBarOpen: boolean;
	setSideBarOpen: (value: boolean) => void;
}>({
	sideBarOpen: false,
	setSideBarOpen: () => {},
});

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
	const [sideBarOpen, setSideBarOpen] = useState(false);
	const [isMobile, setIsMobile] = useState(false);

	// 画面サイズの監視
	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);

		return () => {
			window.removeEventListener("resize", checkMobile);
		};
	}, []);

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

	const toggleSideBar = () => {
		setSideBarOpen(!sideBarOpen);
	};

	return (
		<SidebarContext.Provider value={{ sideBarOpen, setSideBarOpen }}>
			<div className="flex min-h-screen">
				{/* モバイル用ハンバーガーメニュー */}
				{isMobile && (
					<div className="fixed top-8 right-3 z-50">
						<Button
							onClick={toggleSideBar}
							variant="circle"
							size="md"
							className="p-2 bg-white border-2 border-orange-500 hover:bg-orange-50"
						>
							{sideBarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
						</Button>
					</div>
				)}

				{/* サイドバー */}
				<AnimatePresence>
					{(!isMobile || sideBarOpen) && (
						<motion.div
							initial={isMobile ? { opacity: 0, x: -300 } : { opacity: 0 }}
							animate={isMobile ? { opacity: 1, x: 0 } : { opacity: 1 }}
							exit={isMobile ? { opacity: 0, x: -300 } : { opacity: 0 }}
							transition={{ duration: 0.3 }}
							className={`${
								isMobile
									? "fixed top-0 left-0 h-full shadow-lg z-40"
									: "w-64 shadow-sm"
							}`}
						>
							<div className="h-full">
								<SideBar
									currentUser={currentUser.uid}
									isAuthenticated={true}
									userData={userData}
								/>
							</div>
						</motion.div>
					)}
				</AnimatePresence>

				{/* メインコンテンツ */}
				<div
					className={`flex-1 ${isMobile && sideBarOpen ? "ml-[255px]" : ""}`}
				>
					{children}
				</div>
			</div>
		</SidebarContext.Provider>
	);
}
