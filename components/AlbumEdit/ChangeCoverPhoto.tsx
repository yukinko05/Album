import { useState, useEffect, useContext } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Photo } from "@/types/photoTypes";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import { getAlbums } from "@/services/albumService";
import { authContext } from "@/features/auth/AuthProvider";

type Props = {
	albumId: string;
	photos: Photo[];
};

export default function ChangeCoverPhoto({ albumId, photos }: Props) {
	const [selectedPhoto, setSelectedPhoto] = useState("");
	const dispatch = useDispatch<AppDispatch>();
	const { currentUser } = useContext(authContext);
	const userId = currentUser?.uid;

	useEffect(() => {
		if (!albumId) {
			console.log("ユーザーが未認証です");
			return;
		}

		const fetchAlbumsData = async () => {
			if (!userId) return;
			try {
				const albums = await dispatch(getAlbums(userId)).unwrap();
				const albumData = albums.find((album) => album.albumId === albumId);
				if (albumData) {
					setSelectedPhoto(albumData?.coverPhotoUrl);
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
			}
		};

		fetchAlbumsData();
	}, [albumId, dispatch]);

	const handleUpdate = async () => {
		try {
			await updateDoc(doc(db, "albums", albumId), {
				coverPhotoUrl: selectedPhoto,
			});
		} catch (error) {
			console.error("カバー写真の更新に失敗しました:", error);
		}
	};

	return (
		<div role="region" aria-label="カバー写真選択">
			<h2>カバー写真を選択</h2>
			<fieldset>
				<legend>利用可能な写真</legend>
				{photos.map((photo) => (
					<label key={photo.photoId}>
						<input
							type="radio"
							name="coverPhoto"
							value={photo.photoUrl}
							checked={selectedPhoto === photo.photoUrl}
							onChange={() => setSelectedPhoto(photo.photoUrl)}
						/>
						<img
							src={photo.photoUrl}
							alt={`カバー写真候補 - ${photo.photoId}`}
							width={100}
						/>
					</label>
				))}
			</fieldset>
			<button onClick={handleUpdate} aria-label="カバー写真を更新">
				変更
			</button>
		</div>
	);
}
