"use client";
import NavigationBar from "@/components/NavigationBar";
import React, { useEffect, useState } from "react";
import { Spinner } from "@nextui-org/spinner";
import styles from "./page.module.css";
import { getPhotos } from "@/services/photoService";

export default function AlbumPhotosPage({
	params,
}: { params: { id: string } }) {
	const albumId = params.id;
	const [photos, setPhotos] = useState<string[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await getPhotos(albumId);
				const photoUrls = response.map((photo) => photo.photoUrl);
				setPhotos(photoUrls);
				setLoading(false);
			} catch (error) {
				console.log("Fetchに失敗しました: ", error);
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
				<div className={styles.warp}>
					{photos.map((photo, index) => (
						<img
							//TODO:keyはphotoIdを設定
							key={index}
							className={styles.cardImg}
							src={photo}
							//TODO:alt設定
						/>
					))}
				</div>
			)}
		</div>
	);
}
