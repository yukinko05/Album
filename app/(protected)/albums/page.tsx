"use client";
import NavigationBar from "@/components/Header";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAlbumStore } from "@/stores/albumStore";
import SideBar from "@/components/SideBar/SideBar";
import Spinner from "@/components/Spinner";

export default function Albums() {
	const [loading, setLoading] = useState(true);
	const { currentUser } = useAuth();
	const userId = currentUser?.uid;
	const albums = useAlbumStore((state) => state.albums);
	const getAlbums = useAlbumStore((state) => state.getAlbums);

	useEffect(() => {
		if (!userId) {
			setLoading(false);
			console.log("ユーザーが未認証です");
			return;
		}

		const fetchAlbumsData = async () => {
			try {
				await getAlbums(userId);
			} catch (error) {
				console.error("アルバムデータの取得に失敗しました:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchAlbumsData();
	}, [userId, getAlbums]);

	return (
		<div>
			<NavigationBar />
			<SideBar />
			{loading ? (
				<div className="flex justify-center pt-24">
					<Spinner size="lg" />
				</div>
			) : (
				<>
					<div className="text-right">
						<Link href="/albums/create" className="inline-block m-6">
							アルバム作成
						</Link>
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-8 mb-8 px-6">
						{albums && albums.length > 0 ? (
							albums.map((album) => (
								<Link
									key={album.albumId}
									href={`/albums/${album.albumId}?albumTitle=${album.title}`}
									className="shadow-md rounded-2xl w-auto h-[400px]"
								>
									<div className="text-xl font-bold p-4">{album.title}</div>
									<div className="w-full h-[300px] relative border-t border-gray-200 p-4 mt-2">
										{album.coverPhotoUrl && (
											<img
												src={album.coverPhotoUrl}
												alt={`${album.title}のカバー画像`}
												className="w-full h-full object-cover"
											/>
										)}
									</div>
									<div className="text-xs text-gray-500 px-4 pb-4">
										{album.createdAt}
									</div>
								</Link>
							))
						) : (
							<p>アルバムがありません</p>
						)}
					</div>
				</>
			)}
		</div>
	);
}
