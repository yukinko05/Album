import { db, storage } from "@/lib/firebase";
import type {
	Album,
	AlbumCreateInputs,
	AlbumUpdataRequest,
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
	QuerySnapshot,
	FirestoreDataConverter,
	updateDoc,
	where,
	addDoc,
} from "@firebase/firestore";
import type { Timestamp } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

export type AlbumDocument = Omit<Album, "id"> & {
	createdAt: Timestamp | null;
};

const albumConverter: FirestoreDataConverter<AlbumDocument> = {
	toFirestore: (album) => album,
	fromFirestore: (snapshot, options) => {
		const data = snapshot.data(options);
		return {
			title: data.title,
			createdAt: data.createdAt,
			coverPhotoUrl: data.coverPhotoUrl,
			userId: data.userId,
			sharedWith: data.sharedWith,
		} as AlbumDocument;
	},
};

export const albumRepository = {
	async fetchAlbums(uid: string): Promise<QuerySnapshot<AlbumDocument>> {
		const ALBUMS_PER_PAGE = 10;
		const col = collection(db, "albums").withConverter(albumConverter);
		const q = query(
			col,
			where("userId", "==", uid),
			orderBy("createdAt", "desc"),
			limit(ALBUMS_PER_PAGE),
		);

		const albumsSnapshot = await getDocs(q);
		return albumsSnapshot;
	},

	async createAlbum({ albumData, uid }: AlbumCreateInputs) {
		const albumId = crypto.randomUUID();
		let photos: string[] = [];
		console.log(albumData.photos);
		if (albumData.photos) {
			photos = await Promise.all(
				albumData.photos.map(async (photo) => {
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

			const albumDocumentData = {
				title: albumData.title,
				createdAt: serverTimestamp(),
				coverPhotoUrl: photos[0],
				userId: uid,
				sharedWith: null,
			};

			const albumRef = doc(db, "albums", albumId);
			await setDoc(albumRef, albumDocumentData);

			await Promise.all(
				photos.map(async (photoUrl) => {
					const photosDocumentData = {
						albumId: albumRef.id,
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

	async updateAlbum({ data, id }: AlbumUpdataRequest) {
		if (!id) throw new Error("アルバムIDが指定されていません");

		const albumRef = doc(db, "albums", id);
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
			throw new Error("アルバムの更新に失敗しました");
		}
	},
};
