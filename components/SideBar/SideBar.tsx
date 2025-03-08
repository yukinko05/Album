"use client";

import ShareRoomSidebarList from "@/components/ShareRoom/ShareRoomSidebarList";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SignOut from "@/app/signout/signout";
import { useUserStore } from "@/stores/userStore";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";

export default function SideBar() {
	const { currentUser, isAuthenticated, isLoading } = useAuth();
	const router = useRouter();
	const getUser = useUserStore((state) => state.getUser);
	const user = useUserStore((state) => state.user);
	const [userName, setUserName] = useState<string>("");
	const [iconImg, setIconImg] = useState<string | null>(null);

	useEffect(() => {
		if (!isAuthenticated && !isLoading) {
			router.push("/login");
		}
	}, [isAuthenticated, isLoading, router]);

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				if (!currentUser) return;
				const userData = await getUser(currentUser.uid);
				if (userData) {
					setUserName(userData.userName || "");
					setIconImg(userData.iconImg || null);
				}
			} catch (error) {
				console.error("ユーザーデータの取得に失敗しました:", error);
			}
		};

		fetchUserData();
	}, [currentUser, getUser]);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (!isAuthenticated) {
		return null;
	}

	return (
		<div className="fixed left-0 h-full w-64 bg-gradient-to-r from-[#A8CAF0] to-[#E9F0FA] shadow-lg">
			<nav className="flex h-full flex-col p-4">
				<div className="flex-1 overflow-y-auto scrollbar-hide">
					<ShareRoomSidebarList />
				</div>
				<div className="border-t-2 border-gray-300 mt-4 pt-4 bg-gray-100 rounded-lg shadow-inner">
					<p className="text-sm font-bold text-gray-600 mb-2 pl-4">
						ルーム操作
					</p>
					<div className="border-t pt-4">
						<Link
							href={{
								pathname: "/rooms/create",
							}}
							aria-label="新しい共有ルームを作成"
							className="block rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-500 transition-colors"
						>
							ルーム作成
						</Link>
					</div>
					<div className="pt-2">
						<Link
							href={{
								pathname: "/rooms/join",
							}}
							className="block rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-500 transition-colors"
							aria-label="既存の共有ルームに参加"
						>
							ルーム参加
						</Link>
					</div>
				</div>
				<div className="flex items-center gap-2 py-4">
					{iconImg && (
						<Image
							src={iconImg}
							alt={`${userName}のプロフィールアイコン`}
							width={30}
							height={30}
							className="rounded-full border-2 border-gray-200"
						/>
					)}
					<div>
						<p className="text-gray-800">{userName}</p>
					</div>
				</div>
				<div className="border-t py-4">
					{currentUser && (
						<div className="flex justify-center">
							<SignOut />
						</div>
					)}
				</div>
			</nav>
		</div>
	);
}
