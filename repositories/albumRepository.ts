import { db } from "@/lib/firebase";
import type { Album, CreateAlbumRequest, AlbumRequest } from "@/types/type";
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
} from "@firebase/firestore";
import type { Timestamp } from "firebase/firestore";

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
      coverImg: data.coverImg,
    } as AlbumDocument;
  },
};

export const albumRepository = {
  async fetchAlbums(uid: string): Promise<QuerySnapshot<AlbumDocument>> {
    const ALBUMS_PER_PAGE = 10;
    const col = collection(db, "users", uid, "albums").withConverter(
      albumConverter
    );
    const q = query(col, orderBy("createdAt", "desc"), limit(ALBUMS_PER_PAGE));
    const albumsSnapshot = await getDocs(q);

    return albumsSnapshot;
  },

  async createAlbum({ data, uid }: CreateAlbumRequest) {
    const documentData = {
      coverImg: data.coverImg,
      createdAt: serverTimestamp(),
      title: data.title,
    };

    const albumId = crypto.randomUUID();
    const albumRef = doc(db, "users", uid, "albums", albumId);
    await setDoc(albumRef, documentData);
  },

  async updateAlbum({ data, uid, id }: AlbumRequest) {
    if (!id) throw new Error("アルバムIDが指定されていません");

    const albumRef = doc(db, "users", uid, "albums", id);
    const documentData = {
      coverImg: data.coverImg,
      title: data.title,
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
