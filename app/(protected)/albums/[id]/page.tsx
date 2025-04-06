"use client";
import React, { useEffect, useState } from "react";
import type { Photo } from "@/types/photoTypes";
import { useParams } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { usePhotoStore } from "@/stores/photoStore";
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
	const sharedRoomTitle = searchParams.get("sharedRoomTitle");
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
		<div className="px-4 py-8">
			<div className="flex justify-between items-center border-b border-amber-200 pb-4">
				<AlbumTitle
					albumId={albumId}
					currentTitle={albumTitle}
					isEditing={isTitleEditing}
					onEditComplete={handleTitleEditComplete}
				/>
				<div className="flex items-center gap-4">
					<Link
						href={{
							pathname: `/rooms/${shareRoomId}`,
							query: { sharedRoomTitle: sharedRoomTitle },
						}}
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
				<div className="flex flex-wrap gap-1 mt-8">
					{photos.map((photo) => (
						<div key={photo.photoId} className="relative w-[300px] h-[300px]">
							<Image
								src={photo.photoUrl}
								alt={`${albumTitle}のアルバム内の写真`}
								fill
								sizes="300px"
								className="rounded-md object-cover"
							/>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
