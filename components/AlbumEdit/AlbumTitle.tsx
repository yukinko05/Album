"use client";

import { useState, useRef, useEffect } from "react";
import { useAlbumStore } from "@/stores/albumStore";
import { FiBook } from "react-icons/fi";

type AlbumTitle = {
	albumId: string;
	currentTitle: string;
	isEditing: boolean;
	onEditComplete: () => void;
};

export default function AlbumTitle({
	albumId,
	currentTitle,
	isEditing,
	onEditComplete,
}: AlbumTitle) {
	const editAlbumTitle = useAlbumStore((state) => state.editAlbumTitle);
	const status = useAlbumStore((state) => state.status);
	const [title, setTitle] = useState<string>(currentTitle);
	const [localEditing, setLocalEditing] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const inputRef = useRef<HTMLInputElement>(null);

	// 編集モードがローカルまたはハンバーガーメニュー項目から選択されているかを確認
	useEffect(() => {
		if ((localEditing || isEditing) && inputRef.current) {
			inputRef.current.focus();
		}
	}, [localEditing, isEditing]);

	//ハンバーガーメニュー項目からタイトルを変更された場合、内部のステートも更新
	useEffect(() => {
		setTitle(currentTitle);
	}, [currentTitle]);

	const handleClickUpdate = async () => {
		try {
			setIsLoading(true);
			await editAlbumTitle({
				title,
				albumId,
			});
			onEditComplete();
		} catch (error) {
			console.error("タイトルの更新に失敗しました:", error);
		} finally {
			setIsLoading(false);
			setLocalEditing(false);
		}
	};

	const handleKeyDownUpdate = async (
		e: React.KeyboardEvent<HTMLInputElement>,
	) => {
		if (e.key === "Enter") {
			try {
				setIsLoading(true);
				await editAlbumTitle({
					title,
					albumId,
				});
				onEditComplete();
			} catch (error) {
				console.error("タイトルの更新に失敗しました:", error);
			} finally {
				setIsLoading(false);
				setLocalEditing(false);
			}
		}
	};

	const isInEditMode = localEditing || isEditing;

	return (
		<div className="max-w-4xl text-2xl">
			{isInEditMode ? (
				<div className="flex items-center">
					<input
						ref={inputRef}
						type="text"
						id="albumTitle"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						onKeyDown={handleKeyDownUpdate}
						required
						maxLength={100}
						disabled={isLoading || status === "loading"}
						className="text-stone-700 border-b border-amber-200"
					/>

					<button
						type="button"
						disabled={isLoading || status === "loading"}
						onClick={handleClickUpdate}
						className="text-sm px-4 py-2 ml-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
					>
						{isLoading || status === "loading" ? "更新中..." : "変更"}
					</button>
				</div>
			) : (
				<div className="flex items-center">
					<FiBook className="mr-2 text-orange-800" size={24} />
					<h1 onClick={() => setLocalEditing(true)} className="text-orange-800">
						{title}
					</h1>
				</div>
			)}
		</div>
	);
}
