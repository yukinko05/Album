import { db } from "@/lib/firebase";
import { collection, getDocs, limit, query, where } from "@firebase/firestore";

export const photoRepository = {
	async fetchPhotos(albumId: string) {
		/**TODO:ページネーションに関する実装は後に行う
     https://github.com/yukinko05/Album/pull/35#discussion_r1940852370**/
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
