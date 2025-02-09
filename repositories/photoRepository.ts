import { db, storage } from "@/lib/firebase";
import {
	collection,
	getDocs,
	limit,
	query,
	where,
	serverTimestamp,
	addDoc,
} from "@firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import type { AddPhotosRequest } from "@/types/photoTypes";

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

	async addPhotos({ photosList, albumId, uid }: AddPhotosRequest) {
		let photos: string[] = [];

		if (photosList) {
			photos = await Promise.all(
				photosList.map(async (photo) => {
					const photoId = crypto.randomUUID();
					const storageRef = ref(
						storage,
						`photos/${uid}/${albumId}/${photoId}`,
					);
					const photosSnapshot = await uploadString(
						storageRef,
						photo,
						"data_url",
					);
					return await getDownloadURL(photosSnapshot.ref);
				}),
			);

			await Promise.all(
				photos.map(async (photoUrl) => {
					const photosDocumentData = {
						albumId: albumId,
						userId: uid,
						photoUrl: photoUrl,
						createdAt: serverTimestamp(),
					};

					await addDoc(collection(db, "photos"), photosDocumentData);
					console.log(photoUrl);
				}),
			);
		}
	},
};
