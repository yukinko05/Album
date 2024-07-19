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

export default function Albums() {
	const [loading, setLoading] = useState(true);
	const albums = useSelector((state: RootState) => state.albums.albums);
	const dispatch = useDispatch();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch("http://localhost:3000/albums");
				const data = await response.json();
				dispatch(setAlbums(data));
				setLoading(false);
			} catch (error) {
				console.error("Fetchに失敗しました: ", error);
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	return (
		<div>
			<NavigationBar />
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
									alt={album.altText}
								/>
							</div>
						</Link>
					))}
				</div>
			)}
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
	);
}
