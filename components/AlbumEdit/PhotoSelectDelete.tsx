import { useState, useEffect, useContext } from "react";
import { Photo } from "@/types/photoTypes";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import { getAlbums } from "@/services/albumService";
import { authContext } from "@/features/auth/AuthProvider";
import { photoSelectDelete } from "@/services/photoService";
import { PhotosProps } from "@/types/photoTypes";

export default function PhotoSelectDelete({ albumId, photos }: PhotosProps) {
	const [selectedPhoto, setSelectedPhoto] = useState<string[]>([]);
	const dispatch = useDispatch<AppDispatch>();
	const { currentUser } = useContext(authContext);
	const userId = currentUser?.uid;
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (!albumId) {
			console.log("ユーザーが未認証です");
			return;
		}

		const fetchAlbumsData = async () => {
			if (!userId) return;
			try {
				const albums = await dispatch(getAlbums(userId)).unwrap();
				albums.find((album) => album.albumId === albumId);
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
			}
		};

		fetchAlbumsData();
	}, [albumId, dispatch, userId]);

	const handleCheckboxChange = (photoUrl: string) => {
		setSelectedPhoto((prevSelected) =>
			prevSelected.includes(photoUrl)
				? prevSelected.filter((url) => url !== photoUrl)
				: [...prevSelected, photoUrl],
		);
	};

	const handleUpdate = async () => {
		setIsLoading(true);
		const photosToDelete: Photo[] = photos.filter((photo) =>
			selectedPhoto.includes(photo.photoUrl),
		);

		if (photosToDelete.length === 0) {
			console.error("削除対象の写真が見つかりません");
			return;
		}

		try {
			await dispatch(photoSelectDelete(photosToDelete));
		} catch (error) {
			alert(
				"アルバムの削除中にエラーが発生しました。" +
					"ネットワーク接続を確認して再度お試しください。",
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div>
			<h2>削除する写真を選択</h2>
			{photos.map((photo) => (
				<label key={photo.photoId}>
					<input
						type="checkbox"
						name="coverPhoto"
						checked={selectedPhoto.includes(photo.photoUrl)}
						onChange={() => handleCheckboxChange(photo.photoUrl)}
					/>
					<img src={photo.photoUrl} alt="削除する写真" width={100} />
				</label>
			))}
			<button
				type="button"
				onClick={handleUpdate}
				aria-label="選択した写真を削除"
				disabled={isLoading}
			>
				{isLoading ? "削除中..." : "アルバム削除"}
			</button>
		</div>
	);
}
