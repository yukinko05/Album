"use client";

import Header from "@/components/Header";
import { useParams, useSearchParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import { getAlbums } from "@/services/albumService";
import { authContext } from "@/features/auth/AuthProvider";
import type { Album } from "@/types/albumTypes";
import Link from "next/link";
import { Spinner } from "@nextui-org/spinner";
import SideBar from "@/components/SideBar/SideBar";
import Image from "next/image";

export default function AlbumShareRoomPage() {
	const params = useParams();
	const shareRoomId = String(params.id);
	const searchParams = useSearchParams();
	const sharedRoomTitle = searchParams.get("sharedRoomTitle");
	const { currentUser } = useContext(authContext);
	const [albums, setAlbums] = useState<Album[]>([]);
	const [loading, setLoading] = useState(true);
	const userId = currentUser?.uid;
	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		if (!userId) {
			setLoading(false);
			console.log("ユーザーが未認証です");
			return;
		}

		const fetchAlbumsData = async () => {
			try {
				const albums = await dispatch(getAlbums(shareRoomId)).unwrap();
				return setAlbums(albums);
			} catch (error) {
				console.error(error);
				if (error instanceof Error) {
					alert(`アルバムデータの取得に失敗しました: ${error.message}`);
				} else {
					alert(
						"予期せぬエラーが発生しました。しばらく時間をおいて再度お試しください。",
					);
				}
			} finally {
				setLoading(false);
			}
		};

		fetchAlbumsData();
	}, [userId, dispatch]);

	return (
		<div className="min-h-screen">
			<Header>{sharedRoomTitle}</Header>
			<div className="hidden md:block">
				<SideBar />
			</div>
			{loading ? (
				<div className="flex items-center justify-center h-full">
					<Spinner />
				</div>
			) : (
				<main className="md:ml-64 px-4 md:px-6 pt-20 md:pt-4">
					<div className="my-4 text-end mt-[80px] sm:mt-[25px] md:mt-[90px]">
						<Link
							href={{
								pathname: "/albums/create",
								query: {
									sharedRoomTitle: sharedRoomTitle,
									shareRoomId: shareRoomId,
								},
							}}
							className="inline-block rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-md"
						>
							アルバム作成
						</Link>
					</div>
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
						{albums?.map((album) => (
							<Link
								href={{
									pathname: `/albums/${album.albumId}`,
									query: { albumTitle: album.title, shareRoomId: shareRoomId },
								}}
								key={album.albumId}
								className="block hover:opacity-60 transition-opacity"
							>
								<article className="bg-white rounded-lg shadow-md overflow-hidden">
									<div className="relative aspect-[1]">
										<Image
											src={album.coverPhotoUrl ?? "/default-album.jpg"}
											alt={`${album.title} のアルバムカバー画像`}
											fill
											className="object-cover"
											priority={true}
										/>
									</div>
									<div className="p-4">
										<h2 className="font-medium text-gray-900 text-sm md:text-base mb-1 md:mb-2 truncate">
											{album.title}
										</h2>
										<time className="text-xs md:text-sm text-gray-500">
											{album.createdAt}
										</time>
									</div>
								</article>
							</Link>
						))}
					</div>
				</main>
			)}
		</div>
	);
}
