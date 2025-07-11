"use client";

import AlbumForm from "@/components/AlbumEdit/AlbumCreateForm/AlbumForm";
import { useRouter } from "next/navigation";
import type { SubmitHandler } from "react-hook-form";
import { useAlbumStore } from "@/stores/albumStore";
import { usePhotoStore } from "@/stores/photoStore";
import { useEffect, useState } from "react";
import { FormFields } from "@/components/AlbumEdit/AlbumCreateForm/AlbumForm";
import { useAuth } from "@/hooks/useAuth";
import { useSearchParams } from "next/navigation";
import { compressMultipleImagesToBase64 } from "@/utils/imageCompressor";

export default function CreatePage() {
	const { currentUser } = useAuth();
	const userId = currentUser?.uid;
	const createAlbum = useAlbumStore((state) => state.createAlbum);
	const addPhotos = usePhotoStore((state) => state.addPhotos);
	const router = useRouter();
	const searchParams = useSearchParams();
	const sharegroupId = searchParams.get("sharegroupId");
	const sharedgroupTitle = searchParams.get("sharedgroupTitle");
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (!userId) {
			return;
		}
	}, [userId]);

	const onSubmit: SubmitHandler<FormFields> = async (data) => {
		if (!userId || !sharegroupId) {
			console.error("ユーザーIDまたは共有グループIDが不足しています");
			return;
		}

		setIsLoading(true);
		try {
			// 全ての選択された写真を取得
			const files = Array.from(data.file);

			// 画像圧縮処理
			const compressedFiles = await compressMultipleImagesToBase64(files);

			// アルバムデータを作成
			const albumData = {
				albumData: {
					title: data.title,
					photos: compressedFiles,
				},
				userId,
				sharegroupId,
			};

			// アルバムを作成
			await createAlbum(albumData);

			router.push(
				`/groups/${sharegroupId}?sharedgroupTitle=${sharedgroupTitle}`,
			);
		} catch (error) {
			console.error("アルバム作成に失敗しました:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div>
			<AlbumForm
				onSubmit={onSubmit}
				formTitle="アルバム作成"
				submitButtonText="作成"
			/>
		</div>
	);
}
