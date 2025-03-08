"use client";

import { useState } from "react";
import { useAlbumStore } from "@/stores/albumStore";

type Props = {
	albumId: string;
	currentTitle: string;
};

export default function EditAlbumTitle({ albumId, currentTitle }: Props) {
	const editAlbumTitle = useAlbumStore((state) => state.editAlbumTitle);
	const status = useAlbumStore((state) => state.status);
	const [newTitle, setNewTitle] = useState<string>(currentTitle);
	const [isLoading, setIsLoading] = useState(false);

	const handleUpdate = async () => {
		try {
			setIsLoading(true);
			await editAlbumTitle({
				title: newTitle,
				albumId,
			});
		} catch (error) {
			console.error("タイトルの更新に失敗しました:", error);
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				handleUpdate();
			}}
		>
			<label htmlFor="albumTitle">アルバムタイトル</label>
			<input
				type="text"
				id="albumTitle"
				value={newTitle}
				onChange={(e) => setNewTitle(e.target.value)}
				required
				maxLength={100}
				disabled={isLoading || status === "loading"}
			/>
			<button type="submit" disabled={isLoading || status === "loading"}>
				{isLoading || status === "loading" ? "更新中..." : "送信"}
			</button>
		</form>
	);
}
