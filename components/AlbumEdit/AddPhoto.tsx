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

		const FILE_SIZE = {
			LARGE: 5 * 1024 * 1024, // 5MB
			SMALL: 2 * 1024 * 1024, // 2MB
		};

		const COMPRESSION_QUALITY = {
			HIGH: 0.8,
			MEDIUM: 0.6,
			LOW: 0.4,
		};

		const compressedFiles = await Promise.all(
			files.map((file) => {
				if (file instanceof File) {
					return new Promise<string | null>((resolve, reject) => {
						let quality: number;

						if (file.size > FILE_SIZE.LARGE) {
							quality = COMPRESSION_QUALITY.LOW;
						} else if (file.size < FILE_SIZE.SMALL) {
							quality = COMPRESSION_QUALITY.MEDIUM;
						} else {
							quality = COMPRESSION_QUALITY.HIGH;
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
								console.error("画像の圧縮に失敗しました:", err);
								alert(
									"画像の圧縮に失敗しました。別の画像を試すか、サイズの小さい画像を選択してください。",
								);
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
		const [isLoading, setIsLoading] = useState(false);

		try {
			setIsLoading(true);
			await dispatch(addPhotos({ photosList: photoData, albumId, uid }));
			alert("写真のアップロードが完了しました");
		} catch (error) {
			console.error("写真の追加に失敗しました:", error);
			alert("写真のアップロードに失敗しました。もう一度お試しください。");
		} finally {
			setIsLoading(false);
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
