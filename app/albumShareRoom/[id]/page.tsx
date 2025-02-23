"use client";

import NavigationBar from "@/components/NavigationBar";
import ShareRoomSidebarList from "@/components/ShareRoom/ShareRoomSidebarList";
import { useParams, useSearchParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import { getAlbums } from "@/services/albumService";
import { authContext } from "@/features/auth/AuthProvider";
import { Button } from "@nextui-org/react";
import type { Album } from "@/types/albumTypes";
import styles from "./styles.module.css";
import Link from "next/link";
import { Spinner } from "@nextui-org/spinner";

export default function AlbumShareRoomPage() {
	const params = useParams();
	const shareRoomId = String(params.id);
	const searchParams = useSearchParams();
	const sharedRoomTitle = searchParams.get("sharedRoomTitle");
	const { currentUser } = useContext(authContext);
	const [albums, setAlbums] = useState<Album[] | undefined>([]);
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
				const albums = await dispatch(getAlbums(userId)).unwrap();
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
		<div>
			<NavigationBar>{sharedRoomTitle}</NavigationBar>
			<ShareRoomSidebarList />
			<div className={styles.btnWrap}>
				<Button
					className={styles.uploadBtn}
					as={Link}
					color="primary"
					variant="flat"
					href="/albums/create"
				>
					アルバム追加
				</Button>
			</div>
			{loading ? (
				<div className={styles.loading}>
					<Spinner />
				</div>
			) : (
				<div className={styles.wrap}>
					{albums?.map((album) => (
						<Link
							href={{
								pathname: `/albums/${album.albumId}`,
								query: { albumTitle: album.title },
							}}
							key={album.albumId}
						>
							<div className={styles.card}>
								<h2 className={styles.cardTitle}>{album.title}</h2>
								<time className={styles.cardDate}>{album.createdAt}</time>
								<img
									className={styles.cardImg}
									src={album.coverPhotoUrl ?? undefined}
									alt={`${album.title} のアルバムカバー画像`}
								/>
							</div>
						</Link>
					))}
				</div>
			)}
		</div>
	);
}
