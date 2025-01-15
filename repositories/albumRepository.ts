import { db } from "@/lib/firebase";
import {
	getDocs,
	collection,
	query,
	orderBy,
	limit,
	serverTimestamp,
	doc,
	setDoc,
} from "@firebase/firestore";
import { AlbumCreateInputs } from "@/types/type";

export const albumRepository = {
	async fetchAlbums(uid: string) {
		const ALBUMS_PER_PAGE = 10;
		const col = collection(db, "users", uid, "albums");
		const q = query(col, orderBy("createdAt", "desc"), limit(ALBUMS_PER_PAGE));
		const snapshot = await getDocs(q);

		return snapshot;
	},

	async createAlbum(data: AlbumCreateInputs, uid: string) {
		const documentData: any = {
			coverImg: data.coverImg,
			createdAt: serverTimestamp(),
			title: data.title,
		};

		const albumId = crypto.randomUUID();
		const albumRef = doc(db, "users", uid, "albums", albumId);
		const newAlbum = await setDoc(albumRef, documentData);

		return newAlbum;
	},
};
