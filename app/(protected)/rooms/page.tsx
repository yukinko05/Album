"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useShareStore } from "@/stores/shareStore";
import type { ShareRooms } from "@/types/shareTypes";
import Link from "next/link";
import {
	PlusCircleIcon,
	UsersIcon,
	ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/outline";

import LoadingSpinner from "@/components/LoadingSpinner";

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

	return (
		<>
			<div className="container mx-auto px-4 py-8">
				<div className="flex justify-between items-center mb-8 border-b border-amber-200 pb-4">
					<h1 className="text-2xl font-medium text-orange-800 flex items-center">
						<UsersIcon className="mr-2 size-6" aria-hidden="true" />
						共有ルーム
					</h1>
					<div className="flex space-x-3">
						<Link
							href="/rooms/create"
							className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors shadow-sm"
						>
							<PlusCircleIcon className="mr-2 size-5" aria-hidden="true" />
							ルーム作成
						</Link>
						<Link
							href="/rooms/join"
							className="flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors shadow-sm"
						>
							<ArrowRightStartOnRectangleIcon
								className="mr-2 size-5"
								aria-hidden="true"
							/>
							ルーム参加
						</Link>
					</div>
				</div>

				{loading ? (
					<div className="flex justify-center items-center py-12">
						<LoadingSpinner size="md" />
					</div>
				) : shareRooms.length === 0 ? (
					<div className="bg-white rounded-lg shadow-md p-8 text-center">
						<div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<UsersIcon
								className="text-orange-500 size-10"
								aria-hidden="true"
							/>
						</div>
						<p className="text-orange-800 mb-4 text-lg font-medium">
							参加している共有ルームはありません
						</p>
						<p className="text-orange-600 mb-6">
							新しいルームを作成するか、既存のルームに参加してみましょう
						</p>
						<div className="flex space-x-4 justify-center">
							<Link
								href="/rooms/create"
								className="inline-flex items-center px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors shadow-sm"
							>
								<PlusCircleIcon className="mr-2 size-5" aria-hidden="true" />
								ルーム作成
							</Link>
							<Link
								href="/rooms/join"
								className="inline-flex items-center px-6 py-2.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors shadow-sm"
							>
								<ArrowRightStartOnRectangleIcon
									className="mr-2 size-5"
									aria-hidden="true"
								/>
								ルーム参加
							</Link>
						</div>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{shareRooms.map((room) => (
							<Link
								key={room.shareRoomId}
								href={`/rooms/${room.shareRoomId}?sharedRoomTitle=${room.sharedRoomTitle}`}
								className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all border border-amber-100 hover:border-amber-200 hover:-translate-y-1"
							>
								<h2 className="text-xl font-semibold mb-2 text-orange-800">
									{room.sharedRoomTitle}
								</h2>
								<p className="text-amber-600 text-sm">
									{room.createdAt
										? new Date(room.createdAt).toLocaleDateString()
										: "日付なし"}
								</p>
							</Link>
						))}
					</div>
				)}
			</div>
		</>
	);
}
