"use client";
import { useState } from "react";
import { usePhotoStore } from "@/stores/photoStore";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import { compressMultipleImagesToBase64 } from "@/utils/imageCompressor";

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

		try {
			setIsLoading(true);
			const compressedImages = await compressMultipleImagesToBase64(files);
			setPhotoData(compressedImages);
		} catch (error) {
			console.error("画像の圧縮に失敗しました:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleUpload = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();

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
			<form>
				<h2>写真を追加</h2>
				<label>
					写真を選択:
					<input
						type="file"
						accept="image/*"
						multiple
						onChange={handleFileChange}
						disabled={isLoading || status === "loading"}
					/>
				</label>
				<button
					type="button"
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
								<div key={index} className="relative w-[100px] h-[100px]">
									<Image
										src={photo}
										alt={`プレビュー ${index + 1}`}
										fill
										sizes="100px"
										style={{ objectFit: "cover" }}
									/>
								</div>
							))}
						</div>
					</div>
				)}
			</form>
		</div>
	);
}
