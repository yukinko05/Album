"use client";
import NavigationBar from "@/components/NavigationBar";
import type { RootState } from "@/store/store";
import { Button } from "@nextui-org/react";
import { Spinner } from "@nextui-org/spinner";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles.module.css";
import type { AppDispatch } from "@/store/store";
import { getAlbums } from "@/services/albumService";
import { authContext } from "@/features/auth/AuthProvider";

export default function Albums() {
	const [loading, setLoading] = useState(true);
	const albums = useSelector((state: RootState) => state.albums.albums);
	const { currentUser } = useContext(authContext);
	const uid = currentUser?.uid;
	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		if (!uid) {
			setLoading(false);
			console.log("ユーザーが未認証です");
			return;
		}

		const fetchAlbumsData = async () => {
			try {
				const albums = await dispatch(getAlbums(uid)).unwrap();
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
	}, [uid, dispatch]);

	return (
		<div>
			<NavigationBar />
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
					{albums.map((album) => (
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
