"use client";

import NavigationBar from "@/components/Header";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/react";
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
import styles from "./page.module.css";
import { Spinner } from "@nextui-org/spinner";
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

	if (!userId) return;

	useEffect(() => {
		const fetchAlbumsData = async () => {
			try {
				const albums = await dispatch(getAlbums(userId)).unwrap();
				const albumData = albums.find((album) => album.albumId === albumId);
				setAlbumData(albumData);
				setCoverPhotoUrl(albumData?.coverPhotoUrl);
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
			router.push("/albums");
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div>
			<NavigationBar />
			{loading ? (
				<div className={styles.loading}>
					<Spinner />
				</div>
			) : (
				albumData && (
					<div className={styles.wrap}>
						<form
							onSubmit={handleSubmit((data) => onSubmit(data))}
							className={styles.editForm}
						>
							<h1 className={styles.title}>アルバム編集</h1>
							<div className={styles.inputWrap}>
								<label className={styles.label} htmlFor="title">
									アルバム名
								</label>
								<input
									{...register("title")}
									className={errors.title ? styles.inputError : styles.input}
									type="text"
								/>
								{errors.title && (
									<span className={styles.errorMessage}>
										{errors.title.message}
									</span>
								)}
							</div>

							<div className={styles.inputWrap}>
								<label className={styles.label} htmlFor="photo">
									アルバム画像
								</label>
								<input
									type="file"
									id="photo"
									{...register("file")}
									accept="image/*"
									onChange={handleFileChange}
									className={styles.coverPhotoUrl}
								/>
								{coverPhotoUrl && (
									<img
										className={styles.viewImg}
										src={coverPhotoUrl}
										alt="選択中のカバー写真"
									/>
								)}
							</div>
							<Button type="submit" className={styles.button}>
								更新
							</Button>
						</form>
					</div>
				)
			)}
		</div>
	);
}
