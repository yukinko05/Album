"use client";
import { useState } from "react";
import { usePhotoStore } from "@/stores/photoStore";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import { compressMultipleImagesToBase64 } from "@/utils/imageCompressor";
import { motion } from "framer-motion";
import { FiX, FiCheck, FiUpload, FiImage } from "react-icons/fi";

type AddPhotosProps = {
	albumId: string;
	onClose: () => void;
};

export default function AddPhotos({ albumId, onClose }: AddPhotosProps) {
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
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.3 }}
			className="fixed inset-0 h-screen bg-gradient-to-b from-orange-50 to-amber-50 z-50 overflow-y-auto"
		>
			<div className="p-6 max-w-4xl mx-auto">
				<div className="flex justify-between items-center mb-8 border-b border-amber-200 pb-4">
					<h2 className="text-2xl font-medium text-orange-800">写真を追加</h2>
					<button
						onClick={onClose}
						className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 text-orange-800 hover:bg-orange-200 transition-colors"
						aria-label="閉じる"
					>
						<FiX size={20} />
					</button>
				</div>
				<form className="flex flex-col gap-4">
					<div className="mb-8">
						{photoData.length === 0 ? (
							<div className="relative border-2 border-dashed border-amber-200 bg-amber-50 rounded-lg p-8 flex flex-col items-center justify-center">
								<FiImage className="text-orange-300 mb-4" size={48} />
								<p className="text-orange-800 mb-4 text-center">
									写真をドラッグ&ドロップするか、ファイルを選択してください
								</p>
								<label className="relative inline-flex items-center justify-center px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors cursor-pointer font-medium text-sm">
									<FiUpload className="mr-2" />
									写真を選択する
									<input
										type="file"
										accept="image/*"
										multiple
										onChange={handleFileChange}
										disabled={isLoading || status === "loading"}
										className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
									/>
								</label>
							</div>
						) : (
							<div className="p-6 bg-white rounded-lg shadow-sm">
								<div className="flex justify-between items-center mb-4">
									<div className="flex items-center">
										<span className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mr-3">
											<FiImage size={18} />
										</span>
										<span className="text-orange-800 font-medium">
											{photoData.length}枚の写真が選択されています
										</span>
									</div>
									<label className="inline-flex items-center justify-center px-4 py-1.5 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors cursor-pointer text-xs font-medium">
										<FiUpload className="mr-1" size={14} />
										写真を追加
										<input
											type="file"
											accept="image/*"
											multiple
											onChange={handleFileChange}
											disabled={isLoading || status === "loading"}
											className="absolute opacity-0"
										/>
									</label>
								</div>

								<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
									{photoData.map((photo, index) => (
										<div
											key={index}
											className="relative aspect-square rounded-lg overflow-hidden border border-amber-200 transition-all hover:shadow-md hover:scale-[0.98]"
										>
											<Image
												src={photo}
												alt={`アップロード予定の写真 ${index + 1}`}
												fill
												sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
												className="object-cover"
											/>
											<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent p-2">
												<span className="text-white text-xs font-medium">
													写真 {index + 1}
												</span>
											</div>
										</div>
									))}
								</div>
							</div>
						)}
					</div>

					<div className="flex justify-between mt-8 border-t border-amber-200 pt-4">
						<button
							type="button"
							onClick={onClose}
							className="px-6 py-2 bg-white border border-amber-300 text-orange-700 rounded-lg hover:bg-amber-50 transition-colors"
						>
							キャンセル
						</button>
						<button
							type="button"
							onClick={handleUpload}
							disabled={
								isLoading || status === "loading" || photoData.length === 0
							}
							className="px-8 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
						>
							{isLoading || status === "loading" ? (
								<>
									<span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
									アップロード中...
								</>
							) : (
								<>
									<FiCheck size={18} />
									アップロード
								</>
							)}
						</button>
					</div>
				</form>
			</div>
		</motion.div>
	);
}
