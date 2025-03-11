import { useState, useEffect } from "react";
import { Photo } from "@/types/photoTypes";
import { useAlbumStore } from "@/stores/albumStore";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";

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
			<form onSubmit={handleUpdate}>
				<h2>カバー写真を変更</h2>
				<div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
					{photos.map((photo) => (
						<div
							key={photo.photoId}
							className={`relative w-24 h-24 cursor-pointer ${
								selectedPhoto === photo.photoUrl ? "ring-4 ring-blue-500" : ""
							}`}
							onClick={() => setSelectedPhoto(photo.photoUrl)}
						>
							<Image
								src={photo.photoUrl}
								alt="アルバム写真"
								fill
								sizes="96px"
								className="object-cover"
							/>
						</div>
					))}
				</div>
				<button
					type="submit"
					disabled={isLoading || status === "loading" || !selectedPhoto}
				>
					{isLoading || status === "loading" ? "更新中..." : "カバー写真を更新"}
				</button>
			</form>
		</div>
	);
}
