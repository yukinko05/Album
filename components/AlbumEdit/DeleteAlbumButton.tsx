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
			alert(
				"アルバムの削除中にエラーが発生しました。" +
					"ネットワーク接続を確認して再度お試しください。",
			);
		} finally {
			setIsLoading(false);
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
