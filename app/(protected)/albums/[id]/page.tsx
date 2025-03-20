"use client";
import React, { useEffect, useState } from "react";
import type { Photo } from "@/types/photoTypes";
import { useParams } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { usePhotoStore } from "@/stores/photoStore";
import {
	FiMenu,
	FiX,
	FiImage,
	FiEdit,
	FiTrash2,
	FiPlusCircle,
	FiLink,
} from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";

type EditMode =
	| ""
	| "coverPhoto"
	| "title"
	| "delete"
	| "link"
	| "addPhoto"
	| "deletePhotos";

export default function AlbumPhotosPage() {
	const params = useParams();
	const albumId = String(params.id);
	const searchParams = useSearchParams();
	const albumTitle = searchParams.get("albumTitle");
	const [photos, setPhotos] = useState<Photo[]>([]);
	const [loading, setLoading] = useState(true);
	const [editMode, setEditMode] = useState<EditMode>("");
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const shareRoomId = searchParams.get("shareRoomId");
	const getPhotos = usePhotoStore((state) => state.getPhotos);

	// 編集モードが有効な時に、body要素にoverflow-hiddenを設定する
	useEffect(() => {
		if (editMode !== "") {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [editMode]);

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

	const closeEditMode = () => {
		setEditMode("");
		setIsMenuOpen(false);
	};

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};
	if (albumTitle === null) return;

	return (
		<div>
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-2xl font-bold">{albumTitle}</h1>
				<div className="flex space-x-2">
					<Link
						href={`/rooms/${shareRoomId}`}
						className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors"
					>
						ルームに戻る
					</Link>
					<button onClick={toggleMenu}>
						{isMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
					</button>
				</div>
			</div>
			<AnimatePresence>
				{isMenuOpen && (
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.2 }}
					>
						<div>
							<button onClick={() => setEditMode("coverPhoto")}>
								カバー写真を変更
							</button>
							<button onClick={() => setEditMode("title")}>
								タイトルを変更
							</button>
							<button onClick={() => setEditMode("addPhoto")}>
								写真を追加
							</button>
							<button onClick={() => setEditMode("deletePhotos")}>
								写真を削除
							</button>
							<button onClick={() => setEditMode("delete")}>
								アルバムを削除
							</button>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{!loading && (
				<div>
					{photos.map((photo) => (
						<img
							key={photo.photoId}
							src={photo.photoUrl}
							alt={`${albumTitle}のアルバム内の写真`}
						/>
					))}
				</div>
			)}
		</div>
	);
}
