import { Timestamp } from "firebase/firestore";

export interface Album {
  id: string;
  title: string;
  createdAt: string | null;
  coverImg: string;
}

export interface AlbumCreateInputs {
  id: string | null;
  title: string;
  coverImg: string | null;
  createdAt: Timestamp;
}

export interface CreateAlbumRequest {
  data: AlbumCreateInputs;
  uid: string;
}

export interface Photos {
  id: string;
  url: string;
  albumId: string;
}

export interface AlbumsProps {
  albums: Album[];
  basePath: string;
}

export interface User {
  email: string | null;
  uid: string | null;
}

export interface UserInput {
  email: string;
  password: string;
}
