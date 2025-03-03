"use client";

import ShareRoomSidebarList from "@/components/ShareRoom/ShareRoomSidebarList";
import Link from "next/link";
import { useContext } from "react";
import { authContext } from "@/features/auth/AuthProvider";
import { useRouter } from "next/navigation";
import SignOut from "@/app/signout/signout";

export default function SideBar() {
	const { currentUser } = useContext(authContext);
	const userId = currentUser?.uid;
	const router = useRouter();

	if (!userId) {
		router.push("/login");
	}

	return (
		<>
			<ShareRoomSidebarList />
			<Link
				href={{
					pathname: "/createShareForm",
				}}
				aria-label="新しい共有ルームを作成"
			>
				ルーム作成
			</Link>
			<Link
				href={{
					pathname: "/shareRoomJoinForm",
				}}
			>
				ルーム参加
			</Link>
			{/* TODO：ユーザー情報 */}
			{userId && <SignOut />}
		</>
	);
}
