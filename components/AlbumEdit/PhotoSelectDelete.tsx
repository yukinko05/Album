import { useState, useEffect } from "react";
import { Photo } from "@/types/photoTypes";
import { PhotosProps } from "@/types/photoTypes";
import { useAlbumStore } from "@/stores/albumStore";
import { usePhotoStore } from "@/stores/photoStore";
import { useAuth } from "@/hooks/useAuth";

export default function PhotoSelectDelete({ albumId, photos }: PhotosProps) {
	const [selectedPhotoIds, setSelectedPhotoIds] = useState<string[]>([]);
	const { currentUser } = useAuth();
	const [isLoading, setIsLoading] = useState(false);
	const getAlbums = useAlbumStore((state) => state.getAlbums);
	const deletePhotos = usePhotoStore((state) => state.deletePhotos);
	const status = usePhotoStore((state) => state.status);

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

	const handleCheckboxChange = (photoId: string) => {
		setSelectedPhotoIds((prev) => {
			if (prev.includes(photoId)) {
				return prev.filter((id) => id !== photoId);
			} else {
				return [...prev, photoId];
			}
		});
	};

	const handleDelete = async () => {
		if (selectedPhotoIds.length === 0) {
			alert("削除する写真を選択してください");
			return;
		}

		const isConfirmed = window.confirm(
			`選択した${selectedPhotoIds.length}枚の写真を削除してもよろしいですか？`,
		);

		if (!isConfirmed) return;

		try {
			setIsLoading(true);
			const photosToDelete = photos.filter((photo) =>
				selectedPhotoIds.includes(photo.photoId),
			);

			await deletePhotos(photosToDelete);
			setSelectedPhotoIds([]);
			alert("選択した写真を削除しました");
			// ページをリロードして最新の状態を表示
			window.location.reload();
		} catch (error) {
			console.error("写真の削除に失敗しました:", error);
			alert("写真の削除に失敗しました");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div>
			<h2>写真を選択して削除</h2>
			<div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
				{photos.map((photo) => (
					<label key={photo.photoId} style={{ cursor: "pointer" }}>
						<input
							type="checkbox"
							value={photo.photoId}
							onChange={() => handleCheckboxChange(photo.photoId)}
							checked={selectedPhotoIds.includes(photo.photoId)}
							disabled={isLoading || status === "loading"}
						/>
						<img
							src={photo.photoUrl}
							alt="アルバム写真"
							style={{
								width: "100px",
								height: "100px",
								objectFit: "cover",
								border: selectedPhotoIds.includes(photo.photoId)
									? "2px solid red"
									: "none",
							}}
						/>
					</label>
				))}
			</div>
			<button
				type="button"
				onClick={handleDelete}
				disabled={
					isLoading || status === "loading" || selectedPhotoIds.length === 0
				}
			>
				{isLoading || status === "loading"
					? "削除中..."
					: `選択した${selectedPhotoIds.length}枚の写真を削除`}
			</button>
		</div>
	);
}
