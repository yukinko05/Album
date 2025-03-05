"use client";

import ShareRoomSidebarList from "@/components/ShareRoom/ShareRoomSidebarList";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { authContext } from "@/features/auth/AuthProvider";
import { useRouter } from "next/navigation";
import SignOut from "@/app/signout/signout";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import { getUser } from "@/services/userService";
import Image from "next/image";

export default function SideBar() {
	const { currentUser } = useContext(authContext);
	const userId = currentUser?.uid;
	const router = useRouter();
	const dispatch = useDispatch<AppDispatch>();
	const [userName, setUserName] = useState<string>("");
	const [iconImg, setIconImg] = useState<string | null>(null);

	useEffect(() => {
		if (!userId) {
			router.push("/login");
		}
	}, [userId, router]);

	useEffect(() => {
		if (!userId) return;

		const fetchUserData = async () => {
			try {
				const response = await dispatch(getUser(userId)).unwrap();

				setUserName(response.userName);
				setIconImg(response.iconImg);
			} catch (error) {
				console.log("ユーザーデータの取得に失敗しました: ", error);
			}
		};

		fetchUserData();
	}, [userId, dispatch]);

	return (
		<div className="fixed left-0 top-20 h-[calc(100vh-4rem)] w-64 bg-gradient-to-r from-[#A8CAF0] to-[#E9F0FA] shadow-lg">
			<nav className="flex h-full flex-col p-4">
				<div className="flex-1">
					<ShareRoomSidebarList />
				</div>
				<div className="border-t pt-4">
					<Link
						href={{
							pathname: "/createShareForm",
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
							pathname: "/shareRoomJoinForm",
						}}
						className="block rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-500 transition-colors"
						aria-label="既存の共有ルームに参加"
					>
						ルーム参加
					</Link>
				</div>

				<div className="flex items-center gap-2 border-t py-4">
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
					{userId && (
						<div className="flex justify-center">
							<SignOut />
						</div>
					)}
				</div>
			</nav>
		</div>
	);
}
