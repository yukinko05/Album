import { db } from "@/lib/firebase";
import { collection, getDocs, limit, query, where } from "@firebase/firestore";

export const photoRepository = {
	async fetchPhotos(albumId: string) {
		const PHOTOS_PER_PAGE = 20;
		const col = collection(db, "photos");
		const q = query(
			col,
			where("albumId", "==", albumId),
			limit(PHOTOS_PER_PAGE),
		);

		const photosSnapshot = await getDocs(q);
		return photosSnapshot;
	},
};
