"use client";

import NavigationBar from "@/components/Header";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect, useContext } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { type SubmitHandler, useForm } from "react-hook-form";
import * as zod from "zod";
import { useParams } from "next/navigation";
import { getAlbums } from "@/services/albumService";
import { authContext } from "@/features/auth/AuthProvider";
import { AppDispatch } from "@/store/store";
import type { Album, AlbumUpdateRequest } from "@/types/albumTypes";
import Spinner from "@/components/Spinner";
import Compressor from "compressorjs";
import { updateAlbum } from "@/services/albumService";

const schema = zod.object({
	title: zod.string().min(1, { message: "タイトルを入力してください" }),
	file: zod.custom<FileList>(),
});

export type FormFields = zod.infer<typeof schema>;

export default function EditAlbumPage() {
	const params = useParams();
	const albumId = params.id;
	const { currentUser } = useContext(authContext);
	const userId = currentUser?.uid;
	const dispatch = useDispatch<AppDispatch>();
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [albumData, setAlbumData] = useState<Album | undefined>();
	const [coverPhotoUrl, setCoverPhotoUrl] = useState<string | undefined>(
		albumData?.coverPhotoUrl,
	);
	const [shareRoomId, setShareRoomId] = useState<string | undefined>(
		albumData?.shareRoomId,
	);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	if (!userId) return;

	useEffect(() => {
		const fetchAlbumsData = async () => {
			try {
				const albums = await dispatch(getAlbums(userId)).unwrap();
				const albumData = albums.find((album) => album.albumId === albumId);
				setAlbumData(albumData);
				setCoverPhotoUrl(albumData?.coverPhotoUrl);
				setShareRoomId(albumData?.shareRoomId);
				if (albumData) {
					setValue("title", albumData.title);
				}

				return albums;
			} catch (error) {
				console.error(error);
				if (error instanceof Error) {
					alert(`アルバムデータの取得に失敗しました: ${error.message}`);
				} else {
					alert(
						"予期せぬエラーが発生しました。しばらく時間をおいて再度お試しください。",
					);
				}
			} finally {
				setLoading(false);
			}
		};

		fetchAlbumsData();
	}, [userId, albumId]);

	useEffect(() => {
		if (albumData?.coverPhotoUrl) {
			setCoverPhotoUrl(albumData.coverPhotoUrl);
		}
	}, [albumData]);

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<FormFields>({
		resolver: zodResolver(schema),
		defaultValues: {
			title: albumData?.title,
		},
	});

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const fileList = event.target.files;
		const file = fileList?.[0];

		if (file) {
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
							const compressedImg = evt.target.result as string;
							setCoverPhotoUrl(compressedImg);
							setValue("file", fileList);
						}
					};
				},
			});
		}
	};

	const onSubmit: SubmitHandler<FormFields> = async (data) => {
		if (coverPhotoUrl === undefined) return;
		if (albumData?.albumId === undefined) return;

		try {
			const requestData: AlbumUpdateRequest = {
				data: {
					title: data.title,
					coverPhotoUrl: coverPhotoUrl,
				},
				albumId: albumData.albumId,
			};

			await dispatch(
				updateAlbum({
					data: requestData.data,
					albumId: albumData.albumId,
				}),
			).unwrap();

			// 共有ルームIDがある場合はそのルームページに、なければダッシュボードに遷移
			if (albumData.shareRoomId) {
				router.push(`/rooms/${albumData.shareRoomId}?albumTitle=${data.title}`);
			} else {
				router.push("/dashboard");
			}
		} catch (error) {
			console.error(error);
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
				albumData && (
					<div className="h-[calc(100vh-65px)] flex items-center justify-center bg-black bg-opacity-70">
						<form onSubmit={handleSubmit(onSubmit)} className="w-[560px] rounded-2xl p-16 bg-white flex flex-col gap-4">
							<h1 className="text-4xl font-bold text-center">アルバム編集</h1>
							<div className="flex flex-col gap-1">
								<label className="text-xs text-gray-700 mt-2" htmlFor="title">
									アルバム名
								</label>
								<input
									{...register("title")}
									className={`bg-gray-200 bg-opacity-20 rounded-2xl h-[42px] px-3 ${errors.title ? "outline-red-500" : "outline-gray-900"
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
								{coverPhotoUrl && (
									<img
										className="h-[100px] w-[100px]"
										src={coverPhotoUrl}
										alt="選択中のカバー写真"
									/>
								)}
							</div>
							<button
								type="submit"
								className="bg-gray-900 text-white rounded-2xl py-2 mt-1 h-12"
								disabled={isLoading}
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
