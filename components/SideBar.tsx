"use client";

import ShareRoomSidebarList from "@/components/ShareRoom/ShareRoomSidebarList";
import Link from "next/link";

export default function SideBar() {
	return (
		<>
			<ShareRoomSidebarList />
			<Link
				href={{
					pathname: "/createShareForm",
				}}
			>
				ルーム作成
			</Link>
			{/* TODO：ユーザー情報 */}
			{/* TODO:ログアウトボタン */}
		</>
	);
}
