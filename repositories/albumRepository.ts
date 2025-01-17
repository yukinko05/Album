import { db } from "@/lib/firebase";
import type { AlbumCreateInputs } from "@/types/type";
import {
	collection,
	doc,
	getDocs,
	limit,
	orderBy,
	query,
	serverTimestamp,
	setDoc,
} from "@firebase/firestore";

export const albumRepository = {
	async fetchAlbums(uid: string) {
		const ALBUMS_PER_PAGE = 10;
		const col = collection(db, "users", uid, "albums");
		const q = query(col, orderBy("createdAt", "desc"), limit(ALBUMS_PER_PAGE));
		const snapshot = await getDocs(q);

		return snapshot;
	},

	async createAlbum(data: AlbumCreateInputs, uid: string) {
		const documentData = {
			coverImg: data.coverImg,
			createdAt: serverTimestamp(),
			title: data.title,
		};

		const albumId = crypto.randomUUID();
		const albumRef = doc(db, "users", uid, "albums", albumId);
		await setDoc(albumRef, documentData);
		return { id: albumId, ...documentData };
	},
};
