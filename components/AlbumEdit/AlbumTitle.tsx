"use client";

import { useState } from "react";
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

	const handleUpdate = async () => {
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
		}
	};
	return (
		<div className="p-6 max-w-4xl mx-auto">
			<div className="flex justify-between items-center mb-8 border-b border-amber-200 pb-4">
				{isEditing ? (
					<div>
						<input
							type="text"
							id="albumTitle"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							required
							maxLength={100}
							disabled={isLoading || status === "loading"}
						/>
						<button
							type="button"
							disabled={isLoading || status === "loading"}
							onClick={handleUpdate}
						>
							{isLoading || status === "loading" ? "更新中..." : "送信"}
						</button>
					</div>
				) : (
					<h1 onClick={() => setEditing(true)}>{title}</h1>
				)}
			</div>
		</div>
	);
}
