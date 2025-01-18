"use client";
import NavigationBar from "@/components/NavigationBar";
import type { RootState } from "@/store/store";
import { Button } from "@nextui-org/react";
import { Spinner } from "@nextui-org/spinner";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles.module.css";
import type { AppDispatch } from "@/store/store";
import { getAlbums } from "@/services/albumService";

export default function Albums() {
	const [loading, setLoading] = useState(true);
	const albums = useSelector((state: RootState) => state.albums.albums);
	const uid = useSelector((state: RootState) => state.user.data?.uid);
	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		const fetchAlbumsData = async () => {
			try {
				if (!uid) {
					console.log("ユーザーIDが存在しません");
					return;
				}
				const albums = await dispatch(getAlbums(uid)).unwrap();

				return albums;

			} catch (error) {
				console.error(error);
				alert("アルバムデータ取得に失敗しました");
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
						<Link href={`/albums/${album.id}`} key={album.id}>
							<div className={styles.card}>
								<h2 className={styles.cardTitle}>{album.title}</h2>
								<time className={styles.cardDate}>{album.createdAt}</time>
								<img
									className={styles.cardImg}
									src={album.coverImg}
									alt={`${album.title}のアルバムカバー画像`}
								/>
							</div>
						</Link>
					))}
				</div>
			)}
		</div>
	);
}
