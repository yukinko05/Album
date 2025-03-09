"use client";
import React, { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";
import type { Photo } from "@/types/photoTypes";
import { useParams } from "next/navigation";
import { useSearchParams } from "next/navigation";
import EditLinkButton from "@/components/AlbumEdit/AlbumEditButton";
import AlbumDeleteButton from "@/components/AlbumEdit/DeleteAlbumButton";
import EditAlbumTitle from "@/components/AlbumEdit/EditAlbumTitle";
import ChangeCoverPhoto from "@/components/AlbumEdit/ChangeCoverPhoto";
import AddPhoto from "@/components/AlbumEdit/AddPhoto";
import PhotoSelectDelete from "@/components/AlbumEdit/PhotoSelectDelete";
import Link from "next/link";
import { usePhotoStore } from "@/stores/photoStore";
import PhotoCard from "@/components/PhotoCard";

export default function AlbumPhotosPage() {
	const params = useParams();
	const albumId = String(params.id);
	const searchParams = useSearchParams();
	const albumTitle = searchParams.get("albumTitle");
	const [photos, setPhotos] = useState<Photo[]>([]);
	const [loading, setLoading] = useState(true);
	const shareRoomId = searchParams.get("shareRoomId");
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

	return (
		<div>
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-2xl font-bold">{albumTitle}</h1>
				<div className="flex space-x-2">
					<Link
						href={`/albums/${albumId}/edit`}
						className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
					>
						アルバム編集
					</Link>
					<Link
						href={`/rooms/${shareRoomId}`}
						className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors"
					>
						ルームに戻る
					</Link>
				</div>
			</div>

			{loading ? (
				<div className="flex justify-center pt-24">
					<Spinner />
				</div>
			) : (
				<div>
					<div className="flex flex-wrap gap-8 mt-8 px-6">
						{photos.map((photo) => (
							<PhotoCard
								key={photo.photoId}
								photo={photo}
								albumTitle={albumTitle}
							/>
						))}
					</div>
					<div className="mt-8 px-6">
						<EditAlbumTitle albumId={albumId} currentTitle={albumTitle} />
						<AlbumDeleteButton albumId={albumId} photos={photos} />
						<EditLinkButton albumId={albumId} />
						<ChangeCoverPhoto albumId={albumId} photos={photos} />
						<AddPhoto albumId={albumId} />
						<PhotoSelectDelete albumId={albumId} photos={photos} />
					</div>
				</div>
			)}
		</div>
	);
}
