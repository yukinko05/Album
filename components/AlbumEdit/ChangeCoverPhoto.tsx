import { useState, useEffect } from "react";
import { Photo } from "@/types/photoTypes";
import { useAlbumStore } from "@/stores/albumStore";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import { motion } from "framer-motion";
import { XMarkIcon, CheckIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { CircleCancelButton } from "@/components/common/Button/CircleCancelButton";
import { CancelButton } from "@/components/common/Button/CancelButton";
import { SubmitButton } from "@/components/common/Button/SubmitButton";

type ChangeCoverPhoto = {
	albumId: string;
	photos: Photo[];
	onClose: () => void;
};

export default function ChangeCoverPhoto({
	albumId,
	photos,
	onClose,
}: ChangeCoverPhoto) {
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
			onClose();
		} catch (error) {
			console.error("カバー写真の更新に失敗しました:", error);
			alert("カバー写真の更新に失敗しました");
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
						<PhotoIcon className="mr-2 h-5 w-5" aria-hidden="true" />
						カバー写真を選択
					</h2>
					<CircleCancelButton onClick={onClose} aria-label="閉じる">
						<XMarkIcon className="h-5 w-5" aria-hidden="true" />
					</CircleCancelButton>
				</div>

				{photos.length === 0 ? (
					<div className="bg-white rounded-lg shadow-sm p-8 text-center">
						<div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<PhotoIcon
								className="text-orange-500 h-7 w-7"
								aria-hidden="true"
							/>
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
									<PhotoIcon className="h-5 w-5" aria-hidden="true" />
								</span>
								<span className="text-orange-800 font-medium">
									カバー写真として使用する写真を選択してください
								</span>
							</div>
						</div>

						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
							{photos.map((photo) => (
								<div
									key={photo.photoId}
									className={`relative aspect-square cursor-pointer rounded-lg overflow-hidden border ${
										selectedPhoto === photo.photoUrl
											? "border-orange-400 ring-2 ring-orange-400"
											: "border-amber-200 hover:border-orange-300"
									} transition-all`}
									onClick={() => setSelectedPhoto(photo.photoUrl)}
								>
									<div className="relative w-full h-full">
										<Image
											src={photo.photoUrl}
											alt="アルバム写真"
											fill
											sizes="(max-width: 640px) 40vw, (max-width: 768px) 30vw, (max-width: 1024px) 20vw, 16vw"
											className="object-cover"
										/>
										{selectedPhoto === photo.photoUrl && (
											<div className="absolute inset-0 bg-orange-500 bg-opacity-30 flex items-center justify-center">
												<div className="bg-white rounded-full p-1">
													<CheckIcon
														className="text-orange-500 h-5 w-5"
														aria-hidden="true"
													/>
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
					<CancelButton onClick={onClose} className="px-6 py-2" />

					<SubmitButton
						type="button"
						onClick={handleUpdate}
						disabled={
							isLoading ||
							status === "loading" ||
							!selectedPhoto ||
							photos.length === 0
						}
						isLoading={isLoading || status === "loading"}
						icon={<CheckIcon className="h-5 w-5" aria-hidden="true" />}
					>
						更新する
					</SubmitButton>
				</div>
			</div>
		</motion.div>
	);
}
