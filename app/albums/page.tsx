"use client";
import styles from "./styles.module.css";
import React, { useEffect, useState } from "react";
import { Spinner } from "@nextui-org/spinner";
import NavigationBar from "@/components/NavigationBar/NavigationBar";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setAlbums } from "@/features/albums/albumsSlice";
import { Button } from "@nextui-org/react";
import { db } from "@/firebase";
import {
	getDocs,
	collection,
	query,
	orderBy,
	limit,
} from "@firebase/firestore";
import dayjs from "dayjs";
import { Album } from "@/types/type";

export default function Albums() {
	const [loading, setLoading] = useState(true);
	const albums = useSelector((state: RootState) => state.albums.albums);
	const uid = useSelector((state: RootState) => state.user.user.uid);
	const dispatch = useDispatch();

	useEffect(() => {
		const fetchAlbumsDate = async () => {
			try {
				const ALBUMS_PER_PAGE = 10;
				const col = collection(db, "users", uid, "albums");
				const q = query(
					col,
					orderBy("createdAt", "desc"),
					limit(ALBUMS_PER_PAGE),
				);
				const snapshot = await getDocs(q);

				if (snapshot.empty) {
					console.log("アルバムのデータはありません。");
					setLoading(false);
					return [];
				}

				const albums: Album[] = snapshot.docs.map((doc) => {
					const data = doc.data();
					const createdAt =
						data.createdAt && "toDate" in data.createdAt
							? data.createdAt.toDate().toISOString()
							: null;
					const formattedCreatedAt = createdAt
						? dayjs(createdAt).format("YYYY-MM-DD")
						: null;
					return {
						...data,
						id: doc.id,
						createdAt: formattedCreatedAt,
					} as Album;
				});

				dispatch(setAlbums(albums));
			} catch (error) {
				console.error(error);
				alert("アルバムデータ取得に失敗しました");
			} finally {
				setLoading(false);
			}
		};
		fetchAlbumsDate();
	}, [uid, dispatch]);

	console.log(albums);
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
