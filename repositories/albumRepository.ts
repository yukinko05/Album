import { db, storage } from "@/lib/firebase";
import type {
	AlbumCreateInputs,
	AlbumUpdateRequest,
	EditAlbumTitleRequest,
	EditAlbumCoverPhotoRequest,
} from "@/types/albumTypes";
import {
	collection,
	doc,
	getDocs,
	limit,
	orderBy,
	query,
	serverTimestamp,
	setDoc,
	updateDoc,
	where,
	addDoc,
	deleteDoc,
} from "@firebase/firestore";
import {
	ref,
	uploadString,
	getDownloadURL,
	deleteObject,
} from "firebase/storage";
import type { DeleteAlbumRequest } from "@/types/albumTypes";

export const albumRepository = {
	async fetchAlbums(sharegroupId: string) {
		const ALBUMS_PER_PAGE = 10;
		const col = collection(db, "albums");
		const q = query(
			col,
			where("sharegroupId", "==", sharegroupId),
			orderBy("createdAt", "desc"),
			limit(ALBUMS_PER_PAGE),
		);

		const albumsSnapshot = await getDocs(q);
		return albumsSnapshot;
	},

	async createAlbum({ albumData, userId, sharegroupId }: AlbumCreateInputs) {
		const albumId = crypto.randomUUID();
		let photos: string[] = [];

		if (albumData.photos) {
			photos = await Promise.all(
				albumData.photos.map(async (photo) => {
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

			const albumDocumentData = {
				title: albumData.title,
				createdAt: serverTimestamp(),
				updatedAt: serverTimestamp(),
				coverPhotoUrl: photos[0],
				userId,
				sharegroupId,
			};

			const albumRef = doc(db, "albums", albumId);
			await setDoc(albumRef, albumDocumentData);

			await Promise.all(
				photos.map(async (photoUrl) => {
					const photosDocumentData = {
						albumId: albumRef.id,
						userId,
						photoUrl: photoUrl,
						createdAt: serverTimestamp(),
						sharegroupId,
					};

					await addDoc(collection(db, "photos"), photosDocumentData);
				}),
			);
		}
	},

	async updateAlbum({ data, albumId }: AlbumUpdateRequest) {
		if (!albumId) throw new Error("アルバムIDが指定されていません");

		const albumRef = doc(db, "albums", albumId);
		const documentData = {
			title: data.title,
			coverPhotoUrl: data.coverPhotoUrl,
			updatedAt: serverTimestamp(),
		};

		try {
			await updateDoc(albumRef, documentData);
			console.log("アルバムが更新されました！");
		} catch (error) {
			console.error("アルバムの更新に失敗しました", error);
			throw new Error(
				`アルバムの更新に失敗しました - アルバムID: ${albumId}, エラー: ${
					error instanceof Error ? error.message : "不明なエラー"
				}`,
			);
		}
	},

	async editAlbumTitle({ title, albumId }: EditAlbumTitleRequest) {
		if (!albumId) throw new Error("アルバムIDが指定されていません");

		const albumRef = doc(db, "albums", albumId);
		const documentData = {
			title: title,
			updatedAt: serverTimestamp(),
		};

		try {
			await updateDoc(albumRef, documentData);
			console.log("アルバムが更新されました！");
		} catch (error) {
			console.error("アルバムの更新に失敗しました", error);
			throw new Error(
				`アルバムの更新に失敗しました - アルバムID: ${albumId}, エラー: ${
					error instanceof Error ? error.message : "不明なエラー"
				}`,
			);
		}
	},

	async editAlbumCover({ coverPhotoUrl, albumId }: EditAlbumCoverPhotoRequest) {
		const albumRef = doc(db, "albums", albumId);
		const documentData = {
			coverPhotoUrl: coverPhotoUrl,
			updatedAt: serverTimestamp(),
		};

		try {
			await updateDoc(albumRef, documentData);
		} catch (error) {
			console.error("カバー写真の更新に失敗しました", error);
			throw new Error(
				`カバー写真の更新に失敗しました - アルバムID: ${albumId}, エラー: ${
					error instanceof Error ? error.message : "不明なエラー"
				}`,
			);
		}
	},

	async deleteAlbum({ albumId, photos }: DeleteAlbumRequest) {
		try {
			await deleteDoc(doc(db, "albums", albumId));
			const deletePhotoTasks = photos.map(async (photo) => {
				await deleteDoc(doc(db, "photos", photo.photoId));

				const photoRef = ref(storage, photo.photoUrl);
				await deleteObject(photoRef);
			});
			await Promise.all(deletePhotoTasks);
		} catch (error) {
			console.error("アルバムの削除に失敗しました", error);
			throw new Error(
				`アルバムの削除に失敗しました - アルバムID: ${albumId}, エラー: ${
					error instanceof Error ? error.message : "不明なエラー"
				}`,
			);
		}
	},
};
