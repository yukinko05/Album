import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Photo } from "@/types/photoTypes";

type Props = {
	albumId: string;
	photos: Photo[];
};

export default function ChangeCoverPhoto({ albumId, photos }: Props) {
	const [selectedPhoto, setSelectedPhoto] = useState(photos[0]?.photoUrl || "");

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
		<div>
			<h2>カバー写真を選択</h2>
			{photos.map((photo) => (
				<label key={photo.photoId}>
					<input
						type="radio"
						name="coverPhoto"
						value={photo.photoUrl}
						checked={selectedPhoto === photo.photoUrl}
						onChange={() => setSelectedPhoto(photo.photoUrl)}
					/>
					<img src={photo.photoUrl} alt="カバー写真候補" width={100} />
				</label>
			))}
			<button onClick={handleUpdate}>変更</button>
		</div>
	);
}
