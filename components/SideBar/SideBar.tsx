"use client";

import ShareRoomSidebarList from "@/components/ShareRoom/ShareRoomSidebarList";
import Link from "next/link";
import SignOut from "@/app/signout/signout";
import Image from "next/image";
import type { User } from "firebase/auth";
import type { User as AppUser } from "@/types/userTypes";
import { FaCircleUser } from "react-icons/fa6";

interface SideBarProps {
	currentUser?: User | null;
	isAuthenticated?: boolean;
	userData?: AppUser | null;
}

export default function SideBar({
	currentUser,
	isAuthenticated = false,
	userData = null,
}: SideBarProps) {
	// ユーザーデータがない場合は何も表示しない
	if (!isAuthenticated || !currentUser) {
		return null;
	}

	return (
		<div className="fixed left-0 h-full w-64 shadow-lg bg-gradient-to-b from-amber-100 to-orange-200">
			<nav className="flex h-full flex-col p-4">
				<Link
					href="/dashboard"
					className="text-4xl font-bold text-orange-800 hover:text-orange-600 font-cherry text-center"
				>
					ALBUM
				</Link>
				<Link
					href="/profile"
					className="flex items-center gap-2 p-2 bg-white/40 hover:bg-white/60 rounded-full mt-8"
				>
					{userData?.iconImg ? (
						<div className="relative w-[30px] h-[30px]">
							<Image
								src={userData.iconImg}
								alt={`${userData.userName}のプロフィールアイコン`}
								fill
								sizes="30px"
								className="object-cover rounded-full"
							/>
						</div>
					) : (
						<FaCircleUser className="text-orange-800" size={30} />
					)}
					<p className="text-orange-900">{userData?.userName}</p>
				</Link>
				<div className="flex-1 overflow-y-auto scrollbar-hide">
					<ShareRoomSidebarList />
				</div>
				<div className="border-t border-orange-300 mt-4 pt-4 bg-white/30 rounded-lg">
					<p className="text-sm font-medium text-orange-900 mb-2 pl-4">
						ルーム操作
					</p>
					<div className="pt-2">
						<Link
							href={{
								pathname: "/rooms/create",
							}}
							aria-label="新しい共有ルームを作成"
							className="block rounded-lg px-4 py-2 text-orange-800 hover:bg-white/40 transition-colors"
						>
							ルーム作成
						</Link>
					</div>
					<div className="pt-2">
						<Link
							href={{
								pathname: "/rooms/join",
							}}
							className="block rounded-lg px-4 py-2 text-orange-800 hover:bg-white/40 transition-colors"
							aria-label="既存の共有ルームに参加"
						>
							ルーム参加
						</Link>
					</div>
				</div>
				<div className="border-t border-orange-300 py-4">
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
