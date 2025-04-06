import { useState, useEffect } from "react";
import { PhotoSelectDeleteProps } from "@/types/photoTypes";
import { useAlbumStore } from "@/stores/albumStore";
import { usePhotoStore } from "@/stores/photoStore";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { FiX, FiTrash2 } from "react-icons/fi";
import Image from "next/image";
import { CircleCancelButton } from "@/components/common/Button/CircleCancelButton";
import { CancelButton } from "@/components/common/Button/CancelButton";
import { DangerButton } from "@/components/common/Button/DangerButton";

export default function PhotoSelectDelete({
	albumId,
	photos,
	onClose,
}: PhotoSelectDeleteProps) {
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

			await deletePhotos({
				photosToDelete,
				albumId,
			});
			setSelectedPhotoIds([]);
			alert("選択した写真を削除しました");
			// ページをリロードして最新の状態を表示
			window.location.reload();
			onClose();
		} catch (error) {
			console.error("写真の削除に失敗しました:", error);
			alert("写真の削除に失敗しました");
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
						<FiTrash2 className="mr-2" size={24} />
						写真を選択して削除
					</h2>
					<CircleCancelButton onClick={onClose} aria-label="閉じる">
						<FiX size={20} />
					</CircleCancelButton>
				</div>

				{photos.length === 0 ? (
					<div className="bg-white rounded-lg shadow-sm p-8 text-center">
						<div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<FiTrash2 className="text-orange-500" size={28} />
						</div>
						<p className="text-orange-800 mb-4 text-lg font-medium">
							写真がありません
						</p>
						<p className="text-orange-600 mb-6">
							まずは写真を追加してください。
						</p>
					</div>
				) : (
					<div className="bg-white rounded-lg shadow-sm p-6">
						<div className="flex justify-between items-center mb-4">
							<div className="flex items-center">
								<span className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mr-3">
									<FiTrash2 size={18} />
								</span>
								<span className="text-orange-800 font-medium">
									削除する写真を選択してください
								</span>
							</div>
							<div className="text-sm text-orange-600">
								{selectedPhotoIds.length}枚選択中
							</div>
						</div>

						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
							{photos.map((photo) => (
								<div
									key={photo.photoId}
									className={`relative aspect-square cursor-pointer rounded-lg overflow-hidden border ${
										selectedPhotoIds.includes(photo.photoId)
											? "border-red-400 ring-2 ring-red-400"
											: "border-amber-200 hover:border-red-300"
									} transition-all`}
									onClick={() => handleCheckboxChange(photo.photoId)}
								>
									<div className="relative w-full h-full">
										<Image
											src={photo.photoUrl}
											alt="アルバム写真"
											fill
											sizes="(max-width: 640px) 40vw, (max-width: 768px) 30vw, (max-width: 1024px) 20vw, 16vw"
											className="object-cover"
										/>
										{selectedPhotoIds.includes(photo.photoId) && (
											<div className="absolute inset-0 bg-red-500 bg-opacity-30 flex items-center justify-center">
												<div className="bg-white rounded-full p-1">
													<FiTrash2 className="text-red-500" size={24} />
												</div>
											</div>
										)}
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				<div className="flex justify-between mt-8 border-t border-amber-200 pt-4">
					<CancelButton onClick={onClose} />

					<DangerButton
						onClick={handleDelete}
						disabled={
							isLoading ||
							status === "loading" ||
							selectedPhotoIds.length === 0 ||
							photos.length === 0
						}
						isLoading={isLoading || status === "loading"}
						icon={<FiTrash2 size={18} />}
					>
						{selectedPhotoIds.length}枚の写真を削除
					</DangerButton>
				</div>
			</div>
		</motion.div>
	);
}
