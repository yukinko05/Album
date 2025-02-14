"use client";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import { deleteAlbum } from "@/services/albumService";
import { useRouter } from "next/navigation";
import type { PhotosProps } from "@/types/photoTypes";
import { useState } from "react";

export default function AlbumDeleteButton({ albumId, photos }: PhotosProps) {
	const dispatch = useDispatch<AppDispatch>();
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	if (!albumId) return null;

	const handleClick = async () => {
		const isConfirmed = window.confirm(
			"このアルバムを削除してもよろしいですか？",
		);
		if (!isConfirmed) return;

		try {
			setIsLoading(true);
			await dispatch(deleteAlbum({ albumId, photos }));
			router.push("/albums");
		} catch (error) {
			console.error(error instanceof Error ? error.message : error);
			let errorMessage = "アルバムの削除中にエラーが発生しました。";
			if (error instanceof TypeError) {
				errorMessage =
					"ネットワークエラーが発生しました。接続を確認してください。";
			} else if (
				error instanceof Error &&
				error.message.includes("permission")
			) {
				errorMessage = "権限がありません。管理者に確認してください。";
			}
			alert(errorMessage);
		}
	};

	return (
		<button
			type="button"
			onClick={handleClick}
			aria-label="アルバムを削除"
			disabled={isLoading}
		>
			{isLoading ? "削除中..." : "アルバム削除"}
		</button>
	);
}
