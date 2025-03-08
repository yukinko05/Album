"use client";

import NavigationBar from "@/components/Header";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { type SubmitHandler, useForm } from "react-hook-form";
import * as zod from "zod";
import { useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import type { Album, AlbumUpdateRequest } from "@/types/albumTypes";
import Spinner from "@/components/Spinner";
import Compressor from "compressorjs";
import { useAlbumStore } from "@/stores/albumStore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

const schema = zod.object({
	title: zod.string().min(1, { message: "タイトルを入力してください" }),
	file: zod.custom<FileList>(),
});

export type FormFields = zod.infer<typeof schema>;

export default function EditAlbumPage() {
	const params = useParams();
	const albumId = String(params.id);
	const { currentUser } = useAuth();
	const userId = currentUser?.uid;
	const router = useRouter();
	const getAlbums = useAlbumStore((state) => state.getAlbums);
	const updateAlbum = useAlbumStore((state) => state.updateAlbum);
	const [album, setAlbum] = useState<Album | null>(null);
	const [loading, setLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<FormFields>({
		resolver: zodResolver(schema),
	});

	useEffect(() => {
		if (!userId) return;

		const fetchAlbumData = async () => {
			try {
				const albums = await getAlbums(userId);
				const foundAlbum = albums.find((album) => album.albumId === albumId);

				if (foundAlbum) {
					setAlbum(foundAlbum);
					setValue("title", foundAlbum.title);
					setPreviewUrl(foundAlbum.coverPhotoUrl);
				} else {
					console.error("アルバムが見つかりません");
					router.push("/albums");
				}
			} catch (error) {
				console.error("アルバムデータの取得に失敗しました:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchAlbumData();
	}, [userId, albumId, getAlbums, setValue, router]);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		new Compressor(file, {
			quality: 0.8,
			maxWidth: 1000,
			success: (compressedFile) => {
				const reader = new FileReader();
				reader.readAsDataURL(compressedFile);
				reader.onloadend = () => {
					setPreviewUrl(reader.result as string);
				};
			},
			error: (err) => {
				console.error("画像の圧縮に失敗しました:", err);
			},
		});
	};

	const onSubmit: SubmitHandler<FormFields> = async (data) => {
		if (!userId || !albumId || !album) {
			console.error("必要な情報が不足しています");
			return;
		}

		setIsSubmitting(true);
		try {
			let coverPhotoUrl = album.coverPhotoUrl;

			// 新しい画像がアップロードされた場合
			if (data.file && data.file.length > 0) {
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

				// Storageに画像をアップロード
				const storageRef = ref(
					storage,
					`photos/${userId}/${albumId}/${Date.now()}`,
				);
				await uploadString(storageRef, base64Image, "data_url");
				coverPhotoUrl = await getDownloadURL(storageRef);
			}

			// アルバムを更新
			await updateAlbum({
				data: {
					title: data.title,
					coverPhotoUrl,
				},
				albumId,
			});

			router.push(`/albums/${albumId}?albumTitle=${data.title}`);
		} catch (error) {
			console.error("アルバムの更新に失敗しました:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div>
			<NavigationBar />
			{loading ? (
				<div className="flex items-center justify-center">
					<Spinner size="lg" />
				</div>
			) : (
				album && (
					<div className="h-[calc(100vh-65px)] flex items-center justify-center bg-black bg-opacity-70">
						<form
							onSubmit={handleSubmit(onSubmit)}
							className="w-[560px] rounded-2xl p-16 bg-white flex flex-col gap-4"
						>
							<h1 className="text-4xl font-bold text-center">アルバム編集</h1>
							<div className="flex flex-col gap-1">
								<label className="text-xs text-gray-700 mt-2" htmlFor="title">
									アルバム名
								</label>
								<input
									{...register("title")}
									className={`bg-gray-200 bg-opacity-20 rounded-2xl h-[42px] px-3 ${
										errors.title ? "outline-red-500" : "outline-gray-900"
									}`}
									type="text"
								/>
								{errors.title && (
									<span className="text-red-500 text-xs">
										{errors.title.message}
									</span>
								)}
							</div>

							<div className="flex flex-col gap-1">
								<label className="text-xs text-gray-700 mt-2" htmlFor="photo">
									アルバム画像
								</label>
								<input
									type="file"
									id="photo"
									{...register("file")}
									accept="image/*"
									onChange={handleFileChange}
									className="text-xs"
								/>
								{previewUrl && (
									<img
										className="h-[100px] w-[100px]"
										src={previewUrl}
										alt="選択中のカバー写真"
									/>
								)}
							</div>
							<button
								type="submit"
								className="bg-gray-900 text-white rounded-2xl py-2 mt-1 h-12"
								disabled={isSubmitting}
							>
								更新
							</button>
						</form>
					</div>
				)
			)}
		</div>
	);
}
