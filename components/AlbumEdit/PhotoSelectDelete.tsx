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
	const uid = currentUser?.uid;

	console.log(photos);
	useEffect(() => {
		if (!albumId) {
			console.log("ユーザーが未認証です");
			return;
		}

		const fetchAlbumsData = async () => {
			if (!uid) return;
			try {
				const albums = await dispatch(getAlbums(uid)).unwrap();
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
	}, [albumId, dispatch]);

	const handleCheckboxChange = (photoUrl: string) => {
		setSelectedPhoto((prevSelected) =>
			prevSelected.includes(photoUrl)
				? prevSelected.filter((url) => url !== photoUrl)
				: [...prevSelected, photoUrl],
		);
	};

	const handleUpdate = async () => {
		const photosToDelete: Photo[] = photos.filter((photo) =>
			selectedPhoto.includes(photo.photoUrl),
		);

		console.log(photoSelectDelete);
		if (photosToDelete.length === 0) {
			console.error("削除対象の写真が見つかりません");
			return;
		}

		try {
			await dispatch(photoSelectDelete(photosToDelete));
		} catch (error) {
			console.error("カバー写真の更新に失敗しました:", error);
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
			<button onClick={handleUpdate}>削除</button>
		</div>
	);
}
