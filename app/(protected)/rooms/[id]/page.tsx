"use client";

import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import type { Album } from "@/types/albumTypes";
import Link from "next/link";
import { useAlbumStore } from "@/stores/albumStore";
import AlbumCard from "@/components/AlbumCard";
import {
	BookOpenIcon,
	PlusCircleIcon,
	CameraIcon,
} from "@heroicons/react/24/outline";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function RoomPage() {
	const params = useParams();
	const shareRoomId = String(params.id);
	const searchParams = useSearchParams();
	const sharedRoomTitle = searchParams.get("sharedRoomTitle");
	const [loading, setLoading] = useState(true);
	const [albums, setAlbums] = useState<Album[]>([]);
	const getAlbums = useAlbumStore((state) => state.getAlbums);
	const { currentUser } = useAuth();
	const userId = currentUser?.uid;

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
		<>
			<div className="container mx-auto px-4">
				<div className="flex justify-between items-center mb-8 border-b border-amber-200 pb-4">
					<h1 className="text-2xl font-medium text-orange-800 flex items-center">
						<BookOpenIcon className="h-5 w-5 mr-2" />
						{sharedRoomTitle}
					</h1>
					{albums && albums.length > 0 && (
						<Link
							href={{
								pathname: "/albums/create",
								query: {
									shareRoomId,
									sharedRoomTitle,
								},
							}}
							className="inline-flex items-center px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors shadow-sm"
						>
							<PlusCircleIcon className="h-5 w-5 mr-2" />
							アルバム作成
						</Link>
					)}
				</div>

				{loading ? (
					<div className="flex justify-center items-center py-12">
						<LoadingSpinner size="md" />
					</div>
				) : albums && albums.length > 0 ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
						{albums.map((album) => (
							<AlbumCard
								key={album.albumId}
								album={album}
								shareRoomId={shareRoomId}
								sharedRoomTitle={sharedRoomTitle || ""}
							/>
						))}
					</div>
				) : (
					<div className="bg-white rounded-lg shadow-md p-8 text-center">
						<div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<CameraIcon className="text-orange-500 h-12 w-12" />
						</div>
						<p className="text-orange-800 mb-4 text-lg font-medium">
							アルバムがありません
						</p>
						<Link
							href={{
								pathname: "/albums/create",
								query: {
									shareRoomId,
									sharedRoomTitle,
								},
							}}
							className="inline-flex items-center px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors shadow-sm"
						>
							<PlusCircleIcon className="h-5 w-5 mr-2" />
							アルバム作成
						</Link>
					</div>
				)}
			</div>
		</>
	);
}
