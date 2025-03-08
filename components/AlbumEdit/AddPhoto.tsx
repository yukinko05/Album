import { useState } from "react";
import Compressor from "compressorjs";
import { usePhotoStore } from "@/stores/photoStore";
import { useAuth } from "@/hooks/useAuth";

type Props = {
	albumId: string;
};

export default function AddPhotos({ albumId }: Props) {
	const { currentUser } = useAuth();
	const [photoData, setPhotoData] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const addPhotos = usePhotoStore((state) => state.addPhotos);
	const status = usePhotoStore((state) => state.status);

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

		const compressedFiles = await Promise.all(
			files.map((file) => {
				if (file instanceof File) {
					return new Promise<string | null>((resolve, reject) => {
						let quality;
						if (file.size > FILE_SIZE.LARGE) {
							quality = 0.4;
						} else if (file.size < FILE_SIZE.SMALL) {
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

		const validFiles = compressedFiles.filter(
			(file): file is string => file !== null,
		);
		setPhotoData(validFiles);
	};

	const handleUpload = async () => {
		if (!currentUser || !albumId) {
			console.error("ユーザーIDまたはアルバムIDが不足しています");
			return;
		}

		if (photoData.length === 0) {
			alert("アップロードする写真を選択してください");
			return;
		}

		try {
			setIsLoading(true);
			await addPhotos({
				photosList: photoData,
				albumId,
				userId: currentUser.uid,
			});
			setPhotoData([]);
			alert("写真のアップロードが完了しました");
		} catch (error) {
			console.error("写真のアップロードに失敗しました:", error);
			alert("写真のアップロードに失敗しました");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div>
			<h2>写真を追加</h2>
			<input
				type="file"
				accept="image/*"
				multiple
				onChange={handleFileChange}
				disabled={isLoading || status === "loading"}
			/>
			<button
				onClick={handleUpload}
				disabled={isLoading || status === "loading" || photoData.length === 0}
			>
				{isLoading || status === "loading"
					? "アップロード中..."
					: "アップロード"}
			</button>
			{photoData.length > 0 && (
				<div>
					<p>{photoData.length}枚の写真が選択されています</p>
					<div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
						{photoData.map((photo, index) => (
							<img
								key={index}
								src={photo}
								alt={`プレビュー ${index + 1}`}
								style={{ width: "100px", height: "100px", objectFit: "cover" }}
							/>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
