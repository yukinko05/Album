"use client";

import { useState, useEffect } from "react";
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
	if (albumTitle === null) return;

	return (
		<div>
			<button
				onClick={toggleMenu}
				className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-colors"
			>
				<div className="relative z-30">
					{isMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
				</div>
			</button>
			<AnimatePresence>
				{isMenuOpen && (
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.2 }}
						className="absolute top-12 right-0 w-64 bg-white shadow-lg rounded-lg overflow-hidden z-40 border border-amber-200"
					>
						<div className="py-2">
							<button
								onClick={() => setEditMode("coverPhoto")}
								className="w-full text-left px-4 py-3 hover:bg-orange-50 flex items-center gap-2 text-orange-800"
							>
								<FiImage className="text-orange-500" />
								カバー写真を変更
							</button>
							<button
								onClick={handleTitleEdit}
								className="w-full text-left px-4 py-3 hover:bg-orange-50 flex items-center gap-2 text-orange-800"
							>
								<FiEdit className="text-orange-500" />
								タイトルを変更
							</button>
							<button
								onClick={() => setEditMode("addPhoto")}
								className="w-full text-left px-4 py-3 hover:bg-orange-50 flex items-center gap-2 text-orange-800"
							>
								<FiPlusCircle className="text-orange-500" />
								写真を追加
							</button>
							<button
								onClick={() => setEditMode("deletePhotos")}
								className="w-full text-left px-4 py-3 hover:bg-orange-50 flex items-center gap-2 text-orange-800"
							>
								<FiTrash2 className="text-orange-500" />
								写真を削除
							</button>
							<hr className="my-2 border-amber-100" />
							<button
								onClick={() => setEditMode("delete")}
								className="w-full text-left px-4 py-3 hover:bg-orange-50 flex items-center gap-2 text-orange-800"
							>
								<FiTrash2 className="text-red-500" />
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
