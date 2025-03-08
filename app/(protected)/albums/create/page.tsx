"use client";

import AlbumForm from "@/components/AlbumEdit/AlbumCreateForm/AlbumForm";
import { useRouter } from "next/navigation";
import type { SubmitHandler } from "react-hook-form";
import { useAlbumStore } from "@/stores/albumStore";
import { usePhotoStore } from "@/stores/photoStore";
import { useEffect, useState } from "react";
import { FormFields } from "@/components/AlbumEdit/AlbumCreateForm/AlbumForm";
import Compressor from "compressorjs";
import { useAuth } from "@/hooks/useAuth";
import { useSearchParams } from "next/navigation";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

export default function CreatePage() {
	const { currentUser } = useAuth();
	const userId = currentUser?.uid;
	const createAlbum = useAlbumStore((state) => state.createAlbum);
	const addPhotos = usePhotoStore((state) => state.addPhotos);
	const router = useRouter();
	const searchParams = useSearchParams();
	const shareRoomId = searchParams.get("shareRoomId");
	const sharedRoomTitle = searchParams.get("sharedRoomTitle");
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (!userId) {
			return;
		}
	}, [userId]);

	const onSubmit: SubmitHandler<FormFields> = async (data) => {
		if (!userId || !shareRoomId) {
			console.error("ユーザーIDまたは共有ルームIDが不足しています");
			return;
		}

		setIsLoading(true);
		try {
			const file = data.file[0];

			// 画像圧縮処理
			const compressedFile = await new Promise<File>((resolve, reject) => {
				new Compressor(file, {
					quality: 0.8,
					maxWidth: 1000,
					success: (result) => {
						resolve(result as File);
					},
					error: (err) => {
						reject(err);
					},
				});
			});

			// 画像をBase64に変換
			const reader = new FileReader();
			const base64Image = await new Promise<string>((resolve) => {
				reader.onloadend = () => resolve(reader.result as string);
				reader.readAsDataURL(compressedFile);
			});

			// アルバムデータを作成
			const albumData = {
				albumData: {
					title: data.title,
					photos: [base64Image],
				},
				userId,
				shareRoomId,
			};

			// アルバムを作成
			await createAlbum(albumData);

			router.push(`/rooms/${shareRoomId}?sharedRoomTitle=${sharedRoomTitle}`);
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
