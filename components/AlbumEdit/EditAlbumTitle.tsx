"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import { editAlbumTitle } from "@/services/albumService";

type Props = {
	albumId: string;
	currentTitle: string;
};

export default function EditAlbumTitle({ albumId, currentTitle }: Props) {
	const dispatch = useDispatch<AppDispatch>();
	const [newTitle, setNewTitle] = useState<string>(currentTitle);
	const [isLoading, setIsLoading] = useState(false);

	const handleUpdate = async () => {
		try {
			setIsLoading(true);
			await dispatch(
				editAlbumTitle({
					title: newTitle,
					albumId,
				}),
			);
		} catch (error) {
			console.error(error);
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
				disabled={isLoading}
			/>
			<button type="submit" disabled={isLoading}>
				{isLoading ? "更新中..." : "送信"}
			</button>
		</form>
	);
}
