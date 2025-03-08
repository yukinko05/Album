"use client";

import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import { getShareRooms } from "@/services/shareService";
import React, { useContext, useEffect, useState } from "react";
import type { ShareRooms } from "@/types/shareTypes";
import { authContext } from "@/features/auth/AuthProvider";
import Link from "next/link";

export default function ShareRoomSidebarList() {
	const { currentUser } = useContext(authContext);
	const userId = currentUser?.uid;
	const [shareRooms, setShareRooms] = useState<ShareRooms[]>([]);
	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		const fetchShareRoomData = async () => {
			try {
				if (!userId) {
					return;
				}
				const response = await dispatch(getShareRooms(userId));
				if (response.payload) {
					setShareRooms(response.payload as ShareRooms[]);
				}
			} catch (error) {
				console.log("シェアルームデータの取得に失敗しました: ", error);
			}
		};

		fetchShareRoomData();
	}, [userId]);

	if (!userId) {
		return <div>ログインが必要です</div>;
	}

	return (
		<div>
			{shareRooms.map((room) => (
				<div key={room.shareRoomId} className="border-b">
					<Link
						href={{
							pathname: `/rooms/${room.shareRoomId}`,
							query: { sharedRoomTitle: room.sharedRoomTitle },
						}}
						aria-label={`シェアルーム: ${room.sharedRoomTitle}`}
						className="flex items-center gap-2 rounded-lg px-4 py-4 text-gray-700 hover:bg-gray-100 hover:text-blue-500 transition-colors"
					>
						{room.sharedRoomTitle}
					</Link>
				</div>
			))}
		</div>
	);
}
