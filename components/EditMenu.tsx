"use client";

import { useState } from "react";
import type { Photo } from "@/types/photoTypes";
import { AnimatePresence, motion } from "framer-motion";
import ChangeCoverPhoto from "@/components/AlbumEdit/ChangeCoverPhoto";
import {
	FiMenu,
	FiX,
	FiImage,
	FiEdit,
	FiTrash2,
	FiPlusCircle,
	FiLink,
} from "react-icons/fi";

type EditMode =
	| ""
	| "coverPhoto"
	| "title"
	| "delete"
	| "link"
	| "addPhoto"
	| "deletePhotos";

export default function EditMenu({
	albumId,
	photos,
	albumTitle,
}: { albumId: string; photos: Photo[]; albumTitle: string }) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [editMode, setEditMode] = useState<EditMode>("");

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
			<button onClick={toggleMenu}>
				{isMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
			</button>
			<AnimatePresence>
				{isMenuOpen && (
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.2 }}
						className="absolute top-16 right-0 bg-white shadow-lg rounded-lg overflow-hidden z-40 border border-amber-200"
					>
						<div className="py-2">
							<button
								onClick={() => setEditMode("coverPhoto")}
								className="w-full text-left px-4 py-3 hover:bg-orange-50 flex items-center gap-2 text-orange-800"
							>
								カバー写真を変更
							</button>
							<button
								onClick={() => setEditMode("title")}
								className="w-full text-left px-4 py-3 hover:bg-orange-50 flex items-center gap-2 text-orange-800"
							>
								タイトルを変更
							</button>
							<button
								onClick={() => setEditMode("addPhoto")}
								className="w-full text-left px-4 py-3 hover:bg-orange-50 flex items-center gap-2 text-orange-800"
							>
								写真を追加
							</button>
							<button
								onClick={() => setEditMode("deletePhotos")}
								className="w-full text-left px-4 py-3 hover:bg-orange-50 flex items-center gap-2 text-orange-800"
							>
								写真を削除
							</button>
							<button
								onClick={() => setEditMode("delete")}
								className="w-full text-left px-4 py-3 hover:bg-orange-50 flex items-center gap-2 text-orange-800"
							>
								アルバムを削除
							</button>
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
		</div>
	);
}
