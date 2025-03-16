"use client";

import React, { useEffect, useState } from "react";
import type { ShareRooms } from "@/types/shareTypes";
import Link from "next/link";
import { useShareStore } from "@/stores/shareStore";
import { useAuth } from "@/hooks/useAuth";

export default function ShareRoomSidebarList() {
	const { currentUser, isAuthenticated } = useAuth();
	const [shareRooms, setShareRooms] = useState<ShareRooms[]>([]);
	const getShareRooms = useShareStore((state) => state.getShareRooms);

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
			<h2 className="text-lg text-white font-semibold mb-2 px-4">共有ルーム</h2>
			<ul className="space-y-1">
				{shareRooms.length === 0 ? (
					<li className="px-4 py-2 text-white">共有ルームがありません</li>
				) : (
					shareRooms.map((room) => (
						<li key={room.shareRoomId}>
							<Link
								href={`/rooms/${room.shareRoomId}?sharedRoomTitle=${room.sharedRoomTitle}`}
								className="block px-4 py-2 text-white hover:bg-gray-100 hover:text-blue-500 rounded-md transition-colors"
							>
								{room.sharedRoomTitle}
							</Link>
						</li>
					))
				)}
			</ul>
		</div>
	);
}
