"use client";
import NavigationBar from "@/components/Header";
import type { RootState } from "@/store/store";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/store/store";
import { getAlbums } from "@/services/albumService";
import { authContext } from "@/features/auth/AuthProvider";
import SideBar from "@/components/SideBar/SideBar";
import Spinner from "@/components/Spinner";

export default function Albums() {
	const [loading, setLoading] = useState(true);
	const albums = useSelector((state: RootState) => state.albums.albums);
	const { currentUser } = useContext(authContext);
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
				const albums = await dispatch(getAlbums(userId)).unwrap();
				return albums;
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
									<div className="text-xs text-gray-500 px-4 pb-4">{album.createdAt}</div>
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
