"use client";

import { useState, useRef, useEffect } from "react";
import { useAlbumStore } from "@/stores/albumStore";
type AlbumTitle = {
	albumId: string;
	currentTitle: string;
};

export default function AlbumTitle({ albumId, currentTitle }: AlbumTitle) {
	const editAlbumTitle = useAlbumStore((state) => state.editAlbumTitle);
	const status = useAlbumStore((state) => state.status);
	const [title, setTitle] = useState<string>(currentTitle);
	const [isEditing, setEditing] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (isEditing && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isEditing]);

	const handleClickUpdate = async () => {
		try {
			setIsLoading(true);
			await editAlbumTitle({
				title,
				albumId,
			});
		} catch (error) {
			console.error("タイトルの更新に失敗しました:", error);
		} finally {
			setIsLoading(false);
			setEditing(false);
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
			} catch (error) {
				console.error("タイトルの更新に失敗しました:", error);
			} finally {
				setIsLoading(false);
				setEditing(false);
			}
		}
	};

	return (
		<div className="p-6 max-w-4xl mx-auto">
			<div className="flex justify-between items-center mb-8 border-b border-amber-200 pb-4">
				{isEditing ? (
					<div>
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
						/>
						<button
							type="button"
							disabled={isLoading || status === "loading"}
							onClick={handleClickUpdate}
						>
							{isLoading || status === "loading" ? "更新中..." : "変更"}
						</button>
					</div>
				) : (
					<h1 onClick={() => setEditing(true)}>{title}</h1>
				)}
			</div>
		</div>
	);
}
