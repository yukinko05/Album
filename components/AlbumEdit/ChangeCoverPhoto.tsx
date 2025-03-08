import { useState, useEffect } from "react";
import { Photo } from "@/types/photoTypes";
import { useAlbumStore } from "@/stores/albumStore";
import { useAuth } from "@/hooks/useAuth";

type Props = {
	albumId: string;
	photos: Photo[];
};

export default function ChangeCoverPhoto({ albumId, photos }: Props) {
	const [selectedPhoto, setSelectedPhoto] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const { currentUser } = useAuth();
	const getAlbums = useAlbumStore((state) => state.getAlbums);
	const editAlbumCoverPhoto = useAlbumStore(
		(state) => state.editAlbumCoverPhoto,
	);
	const status = useAlbumStore((state) => state.status);

	useEffect(() => {
		if (!albumId) {
			console.log("アルバムIDが不足しています");
			return;
		}

		const fetchAlbumsData = async () => {
			if (!currentUser) return;
			try {
				await getAlbums(currentUser.uid);
			} catch (error) {
				console.error("アルバムデータの取得に失敗しました:", error);
			}
		};

		fetchAlbumsData();
	}, [albumId, currentUser, getAlbums]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSelectedPhoto(e.target.value);
	};

	const handleUpdate = async () => {
		if (!selectedPhoto) {
			alert("カバー写真を選択してください");
			return;
		}

		try {
			setIsLoading(true);
			await editAlbumCoverPhoto({
				coverPhotoUrl: selectedPhoto,
				albumId,
			});
			alert("カバー写真を更新しました");
		} catch (error) {
			console.error("カバー写真の更新に失敗しました:", error);
			alert("カバー写真の更新に失敗しました");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div>
			<h2>カバー写真を変更</h2>
			<div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
				{photos.map((photo) => (
					<label key={photo.photoId} style={{ cursor: "pointer" }}>
						<input
							type="radio"
							name="coverPhoto"
							value={photo.photoUrl}
							onChange={handleChange}
							checked={selectedPhoto === photo.photoUrl}
							disabled={isLoading || status === "loading"}
						/>
						<img
							src={photo.photoUrl}
							alt="アルバム写真"
							style={{
								width: "100px",
								height: "100px",
								objectFit: "cover",
								border:
									selectedPhoto === photo.photoUrl ? "2px solid blue" : "none",
							}}
						/>
					</label>
				))}
			</div>
			<button
				onClick={handleUpdate}
				disabled={isLoading || status === "loading" || !selectedPhoto}
			>
				{isLoading || status === "loading" ? "更新中..." : "カバー写真を更新"}
			</button>
		</div>
	);
}
