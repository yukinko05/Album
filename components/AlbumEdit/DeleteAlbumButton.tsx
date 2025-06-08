"use client";
import { useRouter } from "next/navigation";
import type { Photo } from "@/types/photoTypes";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAlbumStore } from "@/stores/albumStore";
import { LoadingIndicator } from "@/components/common/LoadingIndicator";

type AlbumDeleteButtonProps = {
	albumId: string;
	photos: Photo[];
	classNames?: string;
	children?: React.ReactNode;
};

export default function AlbumDeleteButton({
	albumId,
	photos,
	classNames,
	children,
}: AlbumDeleteButtonProps) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const searchParams = useSearchParams();
	const sharegroupId = searchParams.get("sharegroupId");
	const deleteAlbum = useAlbumStore((state) => state.deleteAlbum);
	const status = useAlbumStore((state) => state.status);

	if (!albumId) return null;

	const handleClick = async () => {
		const isConfirmed = window.confirm(
			"このアルバムを削除してもよろしいですか？\nアルバム内のすべての写真も削除されます。",
		);
		if (!isConfirmed) return;

		try {
			setIsLoading(true);
			await deleteAlbum({ albumId, photos });

			// 共有ルームIDがある場合はそのルームページに、なければダッシュボードに遷移
			if (sharegroupId) {
				router.push(`/groups/${sharegroupId}`);
			} else {
				router.push("/dashboard");
			}
		} catch (error) {
			console.error("アルバムの削除に失敗しました:", error);
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
			disabled={isLoading || status === "loading"}
			className={classNames}
		>
			{isLoading || status === "loading" ? (
				<>
					<LoadingIndicator color="orange" size="sm" className="mr-1.5" />
					削除中...
				</>
			) : (
				children || "アルバムを削除"
			)}
		</button>
	);
}
