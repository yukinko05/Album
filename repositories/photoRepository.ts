import { db, storage } from "@/lib/firebase";
import {
	collection,
	getDocs,
	limit,
	query,
	where,
	serverTimestamp,
	addDoc,
	deleteDoc,
	doc,
	getDoc,
	updateDoc,
} from "@firebase/firestore";
import {
	ref,
	uploadString,
	getDownloadURL,
	deleteObject,
} from "firebase/storage";
import type {
	AddPhotosRequest,
	Photo,
	PhotoSelectDeleteRequest,
} from "@/types/photoTypes";

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

	async addPhotos({ photosList, albumId, userId }: AddPhotosRequest) {
		let photos: string[] = [];

		if (photosList) {
			photos = await Promise.all(
				photosList.map(async (photo) => {
					const photoId = crypto.randomUUID();
					const storageRef = ref(
						storage,
						`photos/${userId}/${albumId}/${photoId}`,
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
						userId,
						photoUrl: photoUrl,
						createdAt: serverTimestamp(),
					};

					await addDoc(collection(db, "photos"), photosDocumentData);
				}),
			);
		}
	},

	async photoSelectDelete({
		photosToDelete,
		albumId,
	}: PhotoSelectDeleteRequest): Promise<void> {
		try {
			const albumRef = doc(db, "albums", albumId);
			const albumDoc = await getDoc(albumRef);

			if (!albumDoc.exists()) {
				throw new Error("アルバムが見つかりませんでした");
			}

			const albumData = albumDoc.data();
			const currentCoverPhotoUrl = albumData.coverPhotoUrl;

			// カバー写真が削除対象に含まれているかチェック
			const isCoverPhotoDeleted = photosToDelete.some(
				(photo) => photo.photoUrl === currentCoverPhotoUrl,
			);

			const deleteTasks = photosToDelete.map(async (photo) => {
				const photoRef = ref(storage, photo.photoUrl);
				await deleteObject(photoRef);

				const photosQuery = query(
					collection(db, "photos"),
					where("photoUrl", "==", photo.photoUrl),
					where("albumId", "==", albumId),
				);

				const photosDocs = await getDocs(photosQuery);

				const deletePhotoTasks = photosDocs.docs.map((doc) =>
					deleteDoc(doc.ref),
				);

				await Promise.all(deletePhotoTasks);
			});

			await Promise.all(deleteTasks);

			if (isCoverPhotoDeleted) {
				const remainingPhotosSnapshot = await getDocs(
					query(
						collection(db, "photos"),
						where("albumId", "==", albumId),
						limit(1),
					),
				);

				if (!remainingPhotosSnapshot.empty) {
					const newCoverPhoto = remainingPhotosSnapshot.docs[0].data();
					await updateDoc(albumRef, {
						coverPhotoUrl: newCoverPhoto.photoUrl,
						updatedAt: serverTimestamp(),
					});
				} else {
					await updateDoc(albumRef, {
						coverPhotoUrl: null,
						updatedAt: serverTimestamp(),
					});
				}
			}

			console.log("写真の削除に成功しました");
		} catch (error) {
			console.error("写真の削除に失敗しました", error);
			throw new Error("写真の削除に失敗しました");
		}
	},
};
