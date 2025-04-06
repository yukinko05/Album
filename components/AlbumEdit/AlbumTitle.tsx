"use client";

import { useState, useRef, useEffect } from "react";
import { useAlbumStore } from "@/stores/albumStore";
import { FiBook } from "react-icons/fi";
import { Button } from "@/components/common/Button/Button";
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
						minLength={1}
						maxLength={100}
						disabled={isLoading || status === "loading"}
						className={`flex-1 px-4 py-1 border rounded-lg bg-amber-50 focus:ring-2 focus:outline-none ${title.trim().length === 0 ? "border-red-500 focus:ring-red-200" : "border-amber-200 focus:ring-orange-200"}`}
					/>

					<Button
						disabled={
							isLoading || status === "loading" || title.trim().length === 0
						}
						onClick={handleClickUpdate}
						className={"ml-2"}
					>
						{isLoading || status === "loading" ? "更新中..." : "変更"}
					</Button>
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
