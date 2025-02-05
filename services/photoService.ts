import { photoRepository } from "@/repositories/photoRepository";
import type { Photo } from "@/types/photoTypes";
import dayjs from "dayjs";

export const getPhotos = async (albumId: string) => {
	try {
		const photosSnapshot = await photoRepository.fetchPhotos(albumId);
		return photosSnapshot.docs
			.map((doc) => {
				const photoData = doc.data();

				if (!photoData?.createdAt || !photoData?.photoUrl) {
					console.warn(`Invalid photo data found: ${doc.id}`);
					return null;
				}

				const createdAt = photoData.createdAt.toDate().toISOString();
				const formattedCreatedAt = createdAt
					? dayjs(createdAt).format("YYYY-MM-DD")
					: null;

				if (!formattedCreatedAt) {
					console.warn(`Invalid date format: ${doc.id}`);
					return null;
				}

				return {
					photoId: doc.id,
					...photoData,
					createdAt: formattedCreatedAt,
				};
			})
			.filter((photo): photo is Photo => photo !== null);
	} catch (error) {
		if (error instanceof Error) {
			console.error(`写真の取得中にエラーが発生しました: ${error.message}`);
			throw new Error(
				`アルバム(${albumId})の写真取得に失敗しました: ${error.message}`,
			);
		}
		console.error("予期せぬエラーが発生しました:", error);
		throw new Error(`予期せぬエラーが発生しました`);
	}
};
