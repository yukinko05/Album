"use client";
import React, { useEffect, useState } from "react";
import type { Photo } from "@/types/photoTypes";
import { useParams } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { usePhotoStore } from "@/stores/photoStore";
import Spinner from "@/components/Spinner";
import AlbumTitle from "@/components/AlbumEdit/AlbumTitle";
import EditMenu from "@/components/EditMenu";

export default function AlbumPhotosPage() {
	const params = useParams();
	const albumId = String(params.id);
	const searchParams = useSearchParams();
	const albumTitle = searchParams.get("albumTitle");
	const [photos, setPhotos] = useState<Photo[]>([]);
	const [loading, setLoading] = useState(true);
	const shareRoomId = searchParams.get("shareRoomId");
	const [isTitleEditing, setIsTitleEditing] = useState(false);
	const getPhotos = usePhotoStore((state) => state.getPhotos);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const photoData = await getPhotos(albumId);
				setPhotos(photoData);
			} catch (error) {
				console.error("写真データの取得に失敗しました:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [albumId, getPhotos]);

	if (albumTitle === null) return;

	const handleEnableEdit = () => {
		setIsTitleEditing(true);
	};

	const handleTitleEditComplete = () => {
		setIsTitleEditing(false);
	};

	return (
		<div className="pt-6 px-6">
			<div className="flex justify-between items-center">
				<AlbumTitle
					albumId={albumId}
					currentTitle={albumTitle}
					isEditing={isTitleEditing}
					onEditComplete={handleTitleEditComplete}
				/>
				<div className="flex items-center gap-4">
					<Link
						href={`/rooms/${shareRoomId}`}
						className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600 transition-colors"
					>
						ルームに戻る
					</Link>
					<EditMenu
						albumId={albumId}
						photos={photos}
						albumTitle={albumTitle}
						onEditTitle={handleEnableEdit}
					/>
				</div>
			</div>
			{!loading && (
				<div className="flex flex-wrap gap-8 mt-8 px-6">
					{photos.map((photo) => (
						<img
							key={photo.photoId}
							src={photo.photoUrl}
							alt={`${albumTitle}のアルバム内の写真`}
							className="rounded-2xl w-[300px] h-[300px] object-cover"
						/>
					))}
				</div>
			)}

			{loading && (
				<div className="flex justify-center pt-24">
					<Spinner />
				</div>
			)}
		</div>
	);
}
