"use client";

import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import type { Album } from "@/types/albumTypes";
import Link from "next/link";
import Spinner from "@/components/Spinner";
import { useAlbumStore } from "@/stores/albumStore";
import AlbumCard from "@/components/AlbumCard";

export default function RoomPage() {
	const params = useParams();
	const shareRoomId = String(params.id);
	const searchParams = useSearchParams();
	const sharedRoomTitle = searchParams.get("sharedRoomTitle");
	const { currentUser } = useAuth();
	const [albums, setAlbums] = useState<Album[]>([]);
	const [loading, setLoading] = useState(true);
	const userId = currentUser?.uid;
	const getAlbums = useAlbumStore((state) => state.getAlbums);

	useEffect(() => {
		if (!userId) {
			setLoading(false);
			console.log("ユーザーが未認証です");
			return;
		}

		const fetchAlbumsData = async () => {
			try {
				const albumsData = await getAlbums(shareRoomId);
				setAlbums(albumsData);
			} catch (error) {
				console.error("アルバムデータの取得に失敗しました:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchAlbumsData();
	}, [userId, shareRoomId, getAlbums]);

	return (
		<div>
			<div className="mb-6">
				<h1 className="text-2xl font-bold mb-2">{sharedRoomTitle}</h1>
			</div>

			<div className="my-4 text-end">
				<Link
					href={{
						pathname: "/albums/create",
						query: {
							sharedRoomTitle: sharedRoomTitle,
							shareRoomId: shareRoomId,
						},
					}}
					className="inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-md"
				>
					アルバム作成
				</Link>
			</div>

			{loading ? (
				<div className="flex items-center justify-center h-64">
					<Spinner size="lg" />
				</div>
			) : (
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
					{albums?.length === 0 ? (
						<div className="col-span-full bg-white rounded-lg shadow-md p-6 text-center">
							<p className="text-gray-500 mb-4">
								このルームにはまだアルバムがありません
							</p>
						</div>
					) : (
						albums?.map((album) => (
							<AlbumCard
								key={album.albumId}
								album={album}
								shareRoomId={shareRoomId}
							/>
						))
					)}
				</div>
			)}
		</div>
	);
}
