import { db } from "@/lib/firebase";
import {
	getDocs,
	collection,
	query,
	orderBy,
	limit,
} from "@firebase/firestore";

export const albumRepository = {
	async fetchAlbums(uid: string) {
		const ALBUMS_PER_PAGE = 10;
		const col = collection(db, "users", uid, "albums");
		const q = query(col, orderBy("createdAt", "desc"), limit(ALBUMS_PER_PAGE));
		const snapshot = await getDocs(q);

		return snapshot;
	},
};
