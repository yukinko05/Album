"use client";
import NavigationBar from "@/components/NavigationBar";
import React, { useEffect, useState } from "react";
import { Spinner } from "@nextui-org/spinner";
import styles from "./page.module.css";
import { getPhotos } from "@/services/photoService";
import { Photo } from "@/types/photoTypes";
import { useSearchParams } from "next/navigation";

export default function AlbumPhotosPage({
	params,
}: { params: { id: string } }) {
	const searchParams = useSearchParams();
	const albumId = params.id;
	const [photos, setPhotos] = useState<Photo[]>([]);
	const [loading, setLoading] = useState(true);
	const albumTitle = searchParams.get("albumTitle");

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await getPhotos(albumId);
				setPhotos(response);
				setLoading(false);
			} catch (error) {
				console.log("写真の取得に失敗しました: ", error);
				setLoading(false);
			}
		};

		fetchData();
	}, [albumId]);

	return (
		<div>
			<NavigationBar />
			{loading ? (
				<div className={styles.loading}>
					<Spinner />
				</div>
			) : (
				<div className={styles.warp}>
					<div>
						<h1>{albumTitle}</h1>
					</div>
					<div>
						{photos.map((photo) => (
							<img
								key={photo.photoId}
								className={styles.cardImg}
								src={photo.photoUrl}
								alt={`アルバム内の写真${photo.photoId}`}
							/>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
