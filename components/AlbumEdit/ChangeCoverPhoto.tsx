import { useState, useEffect } from "react";
import { Photo } from "@/types/photoTypes";
import { useAlbumStore } from "@/stores/albumStore";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiX, FiCheck } from "react-icons/fi";

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
					<h2 className="text-2xl font-medium text-orange-800">
						カバー写真を選択
					</h2>
					<button
						onClick={onClose}
						className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 text-orange-800 hover:bg-orange-200 transition-colors"
						aria-label="閉じる"
					>
						<FiX size={20} />
					</button>
				</div>
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
					{photos.length === 0 ? (
						<p className="text-orange-600 col-span-full text-center py-8">
							写真がありません。まずは写真を追加してください。
						</p>
					) : (
						photos.map((photo) => (
							<div
								key={photo.photoId}
								className={`relative aspect-square cursor-pointer rounded-lg overflow-hidden border border-amber-200 transition-all ${
									selectedPhoto === photo.photoUrl
										? "ring-4 ring-orange-400 scale-[0.97]"
										: "hover:scale-[0.97]"
								}`}
								onClick={() => setSelectedPhoto(photo.photoUrl)}
							>
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
											<FiCheck className="text-orange-500" size={24} />
										</div>
									</div>
								)}
							</div>
						))
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
						onClick={handleUpdate}
						disabled={isLoading || status === "loading" || !selectedPhoto}
						className="px-8 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
					>
						{isLoading || status === "loading" ? (
							<>
								<span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
								更新中...
							</>
						) : (
							<>
								<FiCheck size={18} />
								更新する
							</>
						)}
					</button>
				</div>
			</div>
		</motion.div>
	);
}
