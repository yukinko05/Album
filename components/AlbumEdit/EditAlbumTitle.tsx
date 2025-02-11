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

	const handleUpdate = async () => {
		try {
			await dispatch(
				editAlbumTitle({
					title: newTitle,
					albumId,
				}),
			);
		} catch (error) {
			console.error(error);
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
			/>
			<button type="submit">送信</button>
		</form>
	);
}
