"use client";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import { deleteAlbum } from "@/services/albumService";
import { useRouter } from "next/navigation";
import type { PhotosProps } from "@/types/photoTypes";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function AlbumDeleteButton({ albumId, photos }: PhotosProps) {
	const dispatch = useDispatch<AppDispatch>();
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const searchParams = useSearchParams();
	const shareRoomId = searchParams.get("shareRoomId");

	if (!albumId) return null;

	const handleClick = async () => {
		const isConfirmed = window.confirm(
			"このアルバムを削除してもよろしいですか？",
		);
		if (!isConfirmed) return;

		try {
			setIsLoading(true);
			await dispatch(deleteAlbum({ albumId, photos }));

			// 共有ルームIDがある場合はそのルームページに、なければダッシュボードに遷移
			if (shareRoomId) {
				router.push(`/rooms/${shareRoomId}`);
			} else {
				router.push("/dashboard");
			}
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
