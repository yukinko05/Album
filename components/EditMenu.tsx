"use client";

import { useState, useEffect } from "react";
import type { Photo } from "@/types/photoTypes";
import { AnimatePresence, motion } from "framer-motion";
import ChangeCoverPhoto from "@/components/AlbumEdit/ChangeCoverPhoto";
import AddPhotos from "@/components/AlbumEdit/AddPhoto";
import PhotoSelectDelete from "@/components/AlbumEdit/PhotoSelectDelete";
import AlbumDeleteButton from "@/components/AlbumEdit/DeleteAlbumButton";
import {
	PencilIcon,
	TrashIcon,
	PhotoIcon,
	Cog6ToothIcon,
	XMarkIcon,
	PlusIcon,
} from "@heroicons/react/24/outline";

type EditMode =
	| ""
	| "coverPhoto"
	| "title"
	| "delete"
	| "link"
	| "addPhoto"
	| "deletePhotos";

type EditMenuProps = {
	albumId: string;
	photos: Photo[];
	albumTitle: string;
	onEditTitle: () => void;
};

export default function EditMenu({
	albumId,
	photos,
	albumTitle,
	onEditTitle,
}: EditMenuProps) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [editMode, setEditMode] = useState<EditMode>("");

	//編集モードが有効なときはbodyのスクロールを無効化
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

	const closeEditMode = () => {
		setEditMode("");
		setIsMenuOpen(false);
	};

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	const handleTitleEdit = () => {
		onEditTitle();
		setIsMenuOpen(false);
	};

	if (albumTitle === null) return null;

	return (
		<div className="relative z-30">
			<button
				onClick={toggleMenu}
				className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-colors shadow-sm"
				aria-label={isMenuOpen ? "メニューを閉じる" : "編集メニューを開く"}
			>
				{isMenuOpen ? (
					<XMarkIcon className="h-5 w-5" aria-hidden="true" />
				) : (
					<Cog6ToothIcon className="h-5 w-5" aria-hidden="true" />
				)}
			</button>

			<AnimatePresence>
				{isMenuOpen && (
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.95 }}
						transition={{ duration: 0.15, ease: "easeOut" }}
						className="absolute top-12 right-0 w-64 bg-white shadow-lg rounded-lg overflow-hidden z-40 border border-amber-200"
					>
						<div className="py-1 px-1">
							<div className="p-3 border-b border-amber-100">
								<h3 className="text-xs uppercase font-semibold text-orange-800/70 mb-1">
									アルバム管理
								</h3>
							</div>

							<button
								onClick={() => setEditMode("coverPhoto")}
								className="w-full text-left px-3 py-2 rounded-md hover:bg-orange-50 flex items-center gap-2.5 text-orange-800 my-1"
							>
								<span className="p-1.5 rounded-md bg-orange-100 text-orange-600">
									<PhotoIcon className="h-5 w-5" aria-hidden="true" />
								</span>
								<span>カバー写真を変更</span>
							</button>

							<button
								onClick={handleTitleEdit}
								className="w-full text-left px-3 py-2 rounded-md hover:bg-orange-50 flex items-center gap-2.5 text-orange-800 my-1"
							>
								<span className="p-1.5 rounded-md bg-orange-100 text-orange-600">
									<PencilIcon className="h-5 w-5" aria-hidden="true" />
								</span>
								<span>タイトルを変更</span>
							</button>

							<div className="p-3 border-b border-t border-amber-100 mt-1">
								<h3 className="text-xs uppercase font-semibold text-orange-800/70 mb-1">
									写真管理
								</h3>
							</div>

							<button
								onClick={() => setEditMode("addPhoto")}
								className="w-full text-left px-3 py-2 rounded-md hover:bg-orange-50 flex items-center gap-2.5 text-orange-800 my-1"
							>
								<span className="p-1.5 rounded-md bg-orange-100 text-orange-600">
									<PlusIcon className="h-5 w-5" aria-hidden="true" />
								</span>
								<span>写真を追加</span>
							</button>

							<button
								onClick={() => setEditMode("deletePhotos")}
								className="w-full text-left px-3 py-2 rounded-md hover:bg-orange-50 flex items-center gap-2.5 text-orange-800 my-1"
							>
								<span className="p-1.5 rounded-md bg-orange-100 text-orange-600">
									<TrashIcon className="h-5 w-5" aria-hidden="true" />
								</span>
								<span>写真を削除</span>
							</button>

							<div className="p-3 border-t border-amber-100 mt-1 mb-1">
								<AlbumDeleteButton
									albumId={albumId}
									photos={photos}
									classNames="w-full text-left py-2 rounded-md hover:bg-red-50 flex items-center gap-2.5 text-red-600"
								>
									<div className="flex items-center gap-2.5 w-full">
										<span className="p-1.5 rounded-md bg-red-100 text-red-500">
											<TrashIcon className="h-5 w-5" aria-hidden="true" />
										</span>
										<span>アルバムを削除</span>
									</div>
								</AlbumDeleteButton>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			<AnimatePresence>
				{editMode === "coverPhoto" && (
					<ChangeCoverPhoto
						albumId={albumId}
						photos={photos}
						onClose={closeEditMode}
					/>
				)}
			</AnimatePresence>

			<AnimatePresence>
				{editMode === "addPhoto" && (
					<AddPhotos albumId={albumId} onClose={closeEditMode} />
				)}
			</AnimatePresence>

			<AnimatePresence>
				{editMode === "deletePhotos" && (
					<PhotoSelectDelete
						albumId={albumId}
						photos={photos}
						onClose={closeEditMode}
					/>
				)}
			</AnimatePresence>
		</div>
	);
}
