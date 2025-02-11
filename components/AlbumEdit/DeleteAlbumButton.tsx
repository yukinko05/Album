"use client";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import { deleteAlbum } from "@/services/albumService";
import { useRouter } from "next/navigation";
import type { PhotosProps } from "@/types/photoTypes";

export default function AlbumDeleteButton({ albumId, photos }: PhotosProps) {
	const dispatch = useDispatch<AppDispatch>();
	const router = useRouter();

	if (!albumId) return null;

	const handleClick = async () => {
		const isConfirmed = window.confirm("このアルバムを削除してもよろしいですか？");
		if (!isConfirmed) return;

		try {
			await dispatch(deleteAlbum({ albumId, photos }));
			router.push("/albums");
		} catch (error) {
			console.error(error instanceof Error ? error.message : error);
			alert("エラーが発生しました。再度お試しください。");
		}
	};

	return (
		<button type="submit" onClick={handleClick}>
			アルバム削除
		</button>
	);
}
