"use client";
import { useState } from "react";
import { usePhotoStore } from "@/stores/photoStore";
import { useAuth } from "@/hooks/useAuth";
import { compressMultipleImagesToBase64 } from "@/utils/imageCompressor";
import { motion } from "framer-motion";
import { XMarkIcon, CheckIcon, PhotoIcon } from "@heroicons/react/24/outline";
import ImageUploader from "@/components/ImageUploader";
import { CircleCancelButton } from "@/components/common/Button/CircleCancelButton";
import { CancelButton } from "@/components/common/Button/CancelButton";
import { SubmitButton } from "@/components/common/Button/SubmitButton";

type AddPhotosProps = {
	albumId: string;
	onClose: () => void;
};

export default function AddPhotos({ albumId, onClose }: AddPhotosProps) {
	const { currentUser } = useAuth();
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
	const [photoData, setPhotoData] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const addPhotos = usePhotoStore((state) => state.addPhotos);
	const status = usePhotoStore((state) => state.status);

	const handleFileSelect = async (files: File[]) => {
		if (files.length === 0) return;

		setSelectedFiles(files);

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
			setSelectedFiles([]);
			alert("写真のアップロードが完了しました");
			onClose();
		} catch (error) {
			console.error("写真のアップロードに失敗しました:", error);
			alert("写真のアップロードに失敗しました");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.3 }}
			className="fixed inset-0 h-screen bg-gradient-to-b from-orange-50 to-amber-50 z-50 overflow-y-auto"
		>
			<div className="p-6 max-w-4xl mx-auto">
				<div className="flex justify-between items-center mb-8 border-b border-amber-200 pb-4">
					<h2 className="text-2xl font-medium text-orange-800 flex items-center">
						<PhotoIcon className="mr-2 size-5" aria-hidden="true" />
						写真を追加
					</h2>
					<CircleCancelButton onClick={onClose} aria-label="閉じる">
						<XMarkIcon className="size-5" aria-hidden="true" />
					</CircleCancelButton>
				</div>
				<form className="flex flex-col gap-4">
					<div className="mb-8">
						<ImageUploader
							onFileSelect={handleFileSelect}
							isLoading={isLoading || status === "loading"}
							status={isLoading || status === "loading" ? "loading" : "idle"}
							showPreview={true}
							multiple={true}
							className="shadow-sm"
						/>
					</div>

					<div className="flex justify-between mt-8 border-t border-amber-200 pt-4">
						<CancelButton onClick={onClose} className="px-6 py-2" />
						<SubmitButton
							type="button"
							onClick={handleUpload}
							disabled={
								isLoading || status === "loading" || selectedFiles.length === 0
							}
							isLoading={isLoading || status === "loading"}
							icon={<CheckIcon className="size-5" aria-hidden="true" />}
						>
							アップロード
						</SubmitButton>
					</div>
				</form>
			</div>
		</motion.div>
	);
}
