"use client";
import NavigationBar from "@/components/NavigationBar";
import React, { useEffect, useState } from "react";
import { Spinner } from "@nextui-org/spinner";
import styles from "./page.module.css";
import { getPhotos } from "@/services/photoService";
import type { Photo } from "@/types/photoTypes";
import { useParams } from "next/navigation";
import { useSearchParams } from "next/navigation";
import EditLinkButton from "@/app/albums/[id]/edit/albumEditButton";
import AlbumDeleteButton from "@/components/AlbumEdit/DeleteAlbumButton";
import EditAlbumTitle from "@/components/AlbumEdit/EditAlbumTitle";
import ChangeCoverPhoto from "@/components/AlbumEdit/ChangeCoverPhoto";
import AddPhoto from "@/components/AlbumEdit/AddPhoto";
import PhotoSelectDelete from "@/components/AlbumEdit/PhotoSelectDelete";

export default function AlbumPhotosPage() {
	const params = useParams();
	const albumId = String(params.id);
	const searchParams = useSearchParams();
	const albumTitle = searchParams.get("albumTitle");
	const [photos, setPhotos] = useState<Photo[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await getPhotos(albumId);
				setPhotos(response);
			} catch (error) {
				console.log("写真の取得に失敗しました: ", error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [albumId, params]);

	if (albumTitle === null) return;

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
					<EditAlbumTitle albumId={albumId} currentTitle={albumTitle} />
					<AlbumDeleteButton albumId={albumId} photos={photos} />
					<EditLinkButton albumId={albumId} />
					<ChangeCoverPhoto albumId={albumId} photos={photos} />
					<AddPhoto albumId={albumId} />
					<PhotoSelectDelete albumId={albumId} photos={photos} />
					<div>
						{photos.map((photo) => (
							<img
								key={photo.photoId}
								className={styles.cardImg}
								src={photo.photoUrl}
								alt={`${albumTitle}のアルバム内の写真`}
								width={100}
								onError={(e) => {
									e.currentTarget.src = "/placeholder.png";
									console.error(
										`画像の読み込みに失敗しました: ${photo.photoUrl}`,
									);
								}}
							/>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
