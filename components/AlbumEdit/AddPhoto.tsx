import { useState, useContext } from "react";
import Compressor from "compressorjs";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { addPhotos } from "@/services/photoService";
import { authContext } from "@/features/auth/AuthProvider";

type Props = {
	albumId: string;
};

export default function AddPhotos({ albumId }: Props) {
	const { currentUser } = useContext(authContext);
	const uid = currentUser?.uid;
	const [photoData, setPhotoData] = useState<string[]>([]);
	const dispatch = useDispatch<AppDispatch>();

	const handleFileChange = async (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		const fileList = event.target.files;

		if (!fileList) return;
		const files = Array.from(fileList);

		if (!files || files.length === 0) return;

		const compressedFiles = await Promise.all(
			files.map((file) => {
				if (file instanceof File) {
					return new Promise<string | null>((resolve, reject) => {
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
										resolve(evt.target.result as string);
									} else {
										resolve(null);
									}
								};
							},
							error: (err) => {
								console.error("Compression failed:", err);
								reject(err);
							},
						});
					});
				} else {
					return Promise.resolve(null);
				}
			}),
		);

		setPhotoData(compressedFiles.filter((file) => file !== null) as string[]);
	};

	const handleUpload = async () => {
		if (uid === undefined) return;

		try {
			await dispatch(addPhotos({ photosList: photoData, albumId, uid }));
		} catch (error) {
			console.error("写真の追加に失敗しました:", error);
		}
	};

	return (
		<div className="modal">
			<input
				type="file"
				accept="image/*"
				onChange={handleFileChange}
				multiple
			/>
			{photoData.map((photo, index) => (
				<img src={photo} key={index} alt="選択写真プレビュー" width={100} />
			))}
			<button onClick={handleUpload}>送信</button>
		</div>
	);
}
