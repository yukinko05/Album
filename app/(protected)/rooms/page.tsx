"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useShareStore } from "@/stores/shareStore";
import type { ShareRooms } from "@/types/shareTypes";
import Link from "next/link";
import Spinner from "@/components/Spinner";

export default function RoomsPage() {
	const { currentUser } = useAuth();
	const userId = currentUser?.uid;
	const [shareRooms, setShareRooms] = useState<ShareRooms[]>([]);
	const [loading, setLoading] = useState(true);
	const getShareRooms = useShareStore((state) => state.getShareRooms);

	useEffect(() => {
		if (!userId) return;

		const fetchShareRoomData = async () => {
			setLoading(true);
			try {
				const rooms = await getShareRooms(userId);
				setShareRooms(rooms);
			} catch (error) {
				console.error("シェアルームデータの取得に失敗しました:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchShareRoomData();
	}, [userId, getShareRooms]);

	if (loading) {
		return (
			<div className="flex items-center justify-center h-64">
				<Spinner />
			</div>
		);
	}

	return (
		<div className="py-8">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">共有ルーム</h1>
				<div className="flex space-x-2">
					<Link
						href="/rooms/create"
						className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
					>
						ルーム作成
					</Link>
					<Link
						href="/rooms/join"
						className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors"
					>
						ルーム参加
					</Link>
				</div>
			</div>

			{shareRooms.length === 0 ? (
				<div className="bg-white rounded-lg shadow-md p-6 text-center">
					<p className="text-gray-500 mb-4">
						参加している共有ルームはありません
					</p>
					<p className="text-gray-600">
						新しいルームを作成するか、既存のルームに参加してみましょう
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{shareRooms.map((room) => (
						<Link
							key={room.shareRoomId}
							href={`/rooms/${room.shareRoomId}?sharedRoomTitle=${room.sharedRoomTitle}`}
							className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
						>
							<h2 className="text-xl font-semibold mb-2 text-gray-800">
								{room.sharedRoomTitle}
							</h2>
							<p className="text-gray-500 text-sm">
								{room.createdAt
									? new Date(room.createdAt).toLocaleDateString()
									: "日付なし"}
							</p>
						</Link>
					))}
				</div>
			)}
		</div>
	);
}
