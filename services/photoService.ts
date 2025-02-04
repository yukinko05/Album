import { photoRepository } from "@/repositories/photoRepository";
import dayjs from "dayjs";

export const getPhotos = async (albumId: string) => {
	try {
		const photosSnapshot = await photoRepository.fetchPhotos(albumId);
		return photosSnapshot.docs
			.map((doc) => {
				const photoData = doc.data();

				if (!photoData.createdAt) return null;

				const createdAt = photoData.createdAt.toDate().toISOString();
				const formattedCreatedAt = createdAt
					? dayjs(createdAt).format("YYYY-MM-DD")
					: null;

				return {
					...photoData,
					createdAt: formattedCreatedAt,
				};
			})
			.filter(
				(
					photo,
				): photo is {
					createdAt: string;
					albumId: string;
					photoUrl: string;
					userId: string;
				} => photo !== undefined,
			);
	} catch (error) {
		console.log(error);
		throw error;
	}
};
