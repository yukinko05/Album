"use client";

import React, { useEffect, useState } from "react";
import type { ShareRooms } from "@/types/shareTypes";
import Link from "next/link";
import { useShareStore } from "@/stores/shareStore";
import { useAuth } from "@/hooks/useAuth";
import { usePathname, useSearchParams } from "next/navigation";

export default function ShareRoomSidebarList() {
	const { currentUser, isAuthenticated } = useAuth();
	const [shareRooms, setShareRooms] = useState<ShareRooms[]>([]);
	const getShareRooms = useShareStore((state) => state.getShareRooms);
	const pathname = usePathname();
	const currentRoomId = pathname.includes("/rooms/")
		? pathname.split("/rooms/")[1]
		: null;

	useEffect(() => {
		const fetchShareRoomData = async () => {
			try {
				if (!currentUser) {
					return;
				}
				const rooms = await getShareRooms(currentUser.uid);
				setShareRooms(rooms);
			} catch (error) {
				console.error("シェアルームデータの取得に失敗しました:", error);
			}
		};

		fetchShareRoomData();
	}, [currentUser, getShareRooms]);

	if (!isAuthenticated) {
		return null;
	}

	return (
		<div className="mt-4">
			<h2 className="text-lg text-stone-800/80 font-semibold mb-2 px-4">
				共有ルーム
			</h2>
			<ul className="space-y-1">
				{shareRooms.length === 0 ? (
					<li className="px-4 py-2 text-stone-800/70">
						共有ルームがありません
					</li>
				) : (
					shareRooms.map((room) => {
						const isActive = room.shareRoomId === currentRoomId;
						return (
							<li key={room.shareRoomId}>
								<Link
									href={`/rooms/${room.shareRoomId}?sharedRoomTitle=${room.sharedRoomTitle}`}
									className={`block px-4 py-2 rounded-md transition-colors
										${
											isActive
												? "bg-white/40 text-orange-900 font-medium border-l-4 border-orange-500"
												: "text-stone-800/70 hover:bg-white/40 hover:text-orange-600"
										}`}
								>
									{room.sharedRoomTitle}
								</Link>
							</li>
						);
					})
				)}
			</ul>
		</div>
	);
}
