"use client";

import AlbumForm, { FormFields } from "@/components/AlbumForm/AlbumForm";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import type { Album, AlbumUpdateInput } from "@/types/albumTypes";
import { updateAlbum } from "@/services/albumService";
import { useRouter } from "next/navigation";
import { authContext } from "@/features/auth/AuthProvider";
import { useContext, useEffect, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { Button } from "@nextui-org/react";
import { useParams } from "next/navigation";
import { getAlbums } from "@/services/albumService";
import styles from "./page.module.css";
import { Spinner } from "@nextui-org/spinner";

export default function EditAlbumPage() {
	const params = useParams();
	const albumId = params.id;
	const { currentUser } = useContext(authContext);
	const uid = currentUser?.uid;
	const dispatch = useDispatch<AppDispatch>();
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [albumData, setAlbumData] = useState<Album | undefined>();

	if (!uid) return;

	useEffect(() => {
		const fetchAlbumsData = async () => {
			try {
				const albums = await dispatch(getAlbums(uid)).unwrap();
				const albumData = albums.find((album) => album.albumId === albumId);
				setAlbumData(albumData);
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
	}, [uid, albumId]);

	return (
		<>
			{loading ? (
				<div className={styles.loading}>
					<Spinner />
				</div>
			) : (
				<div>
					{albumData && (
						<AlbumForm
							onSubmit={onSubmit}
							formTitle="アルバム編集"
							submitButtonText="更新"
							initialTitle={albumData?.title}
							initialCoverPhotoUrl={albumData?.coverPhotoUrl}
						/>
					)}
				</div>
			)}
		</>
	);
}
