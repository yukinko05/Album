import { db } from "@/lib/firebase";
import type { AlbumCreateInputs, Album } from "@/types/type";
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
} from "@firebase/firestore";
import { Timestamp } from "firebase/firestore";

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
