"use client";

import { useState, useEffect } from "react";
import type { Photo } from "@/types/photoTypes";
import { AnimatePresence, motion } from "framer-motion";
import ChangeCoverPhoto from "@/components/AlbumEdit/ChangeCoverPhoto";
import AddPhotos from "@/components/AlbumEdit/AddPhoto";
import {
	FiX,
	FiImage,
	FiEdit,
	FiTrash2,
	FiPlusCircle,
	FiSettings,
} from "react-icons/fi";

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
				{isMenuOpen ? <FiX size={20} /> : <FiSettings size={20} />}
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
									<FiImage size={16} />
								</span>
								<span>カバー写真を変更</span>
							</button>

							<button
								onClick={handleTitleEdit}
								className="w-full text-left px-3 py-2 rounded-md hover:bg-orange-50 flex items-center gap-2.5 text-orange-800 my-1"
							>
								<span className="p-1.5 rounded-md bg-orange-100 text-orange-600">
									<FiEdit size={16} />
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
									<FiPlusCircle size={16} />
								</span>
								<span>写真を追加</span>
							</button>

							<button
								onClick={() => setEditMode("deletePhotos")}
								className="w-full text-left px-3 py-2 rounded-md hover:bg-orange-50 flex items-center gap-2.5 text-orange-800 my-1"
							>
								<span className="p-1.5 rounded-md bg-orange-100 text-orange-600">
									<FiTrash2 size={16} />
								</span>
								<span>写真を削除</span>
							</button>

							<div className="p-3 border-t border-amber-100 mt-1 mb-1">
								<button
									onClick={() => setEditMode("delete")}
									className="w-full text-left px-3 py-2 rounded-md hover:bg-red-50 flex items-center gap-2.5 text-red-600"
								>
									<span className="p-1.5 rounded-md bg-red-100 text-red-500">
										<FiTrash2 size={16} />
									</span>
									<span>アルバムを削除</span>
								</button>
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
		</div>
	);
}
