"use client";

import AlbumForm from "@/components/AlbumEdit/AlbumCreateForm/AlbumForm";
import type { AppDispatch } from "@/store/store";
import { useRouter } from "next/navigation";
import type { SubmitHandler } from "react-hook-form";
import { useDispatch } from "react-redux";
import { createAlbum } from "@/services/albumService";
import { useEffect, useContext } from "react";
import { FormFields } from "@/components/AlbumEdit/AlbumCreateForm/AlbumForm";
import Compressor from "compressorjs";
import { authContext } from "@/features/auth/AuthProvider";
import { useSearchParams } from "next/navigation";

export default function CreatePage() {
	const { currentUser } = useContext(authContext);
	const userId = currentUser?.uid;
	const dispatch = useDispatch<AppDispatch>();
	const router = useRouter();
	const searchParams = useSearchParams();
	const shareRoomId = searchParams.get("shareRoomId");
	const sharedRoomTitle = searchParams.get("sharedRoomTitle");

	useEffect(() => {
		if (!userId) {
			return;
		}
	}, []);

	const onSubmit: SubmitHandler<FormFields> = async (data) => {
		try {
			if (!userId || shareRoomId === null) {
				throw new Error("ユーザーIDまたはルームが見つかりません");
			}

			const fileList = data.file;
			const files = Array.from(fileList);

			if (!files || files.length === 0) return;

			const compressedFiles = await Promise.all(
				files.map((file) => {
					if (file instanceof File) {
						return new Promise<string | null>((resolve, reject) => {
							let quality;
							if (file.size > 5 * 1024 * 1024) {
								quality = 0.4;
							} else if (file.size < 2 * 1024 * 1024) {
								quality = 0.6;
							} else {
								quality = 0.8;
							}

							new Compressor(file, {
								quality,
								success: (compressedFile) => {
									const reader = new FileReader();
									reader.readAsDataURL(compressedFile);

									reader.onloadend = (evt) => {
										if (evt.target !== null) {
											resolve(evt.target.result as string);
										} else {
											resolve(null);
										}
									};
								},
								error: (err) => {
									console.error("Compression failed:", err);
									reject(err);
								},
							});
						});
					} else {
						return Promise.resolve(null);
					}
				}),
			);

			const albumData = {
				title: data.title,
				photos: compressedFiles as string[],
			};

			await dispatch(createAlbum({ albumData, userId, shareRoomId })).unwrap();
			router.push(
				`/albumShareRoom/${shareRoomId}?sharedRoomTitle=${sharedRoomTitle}`,
			);
		} catch (error) {
			console.error(error instanceof Error ? error.message : error);
			alert("エラーが発生しました。再度お試しください。");
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
