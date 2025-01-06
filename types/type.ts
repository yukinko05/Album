export interface Album {
  id: string;
  title: string;
  createdAt: string | null;
  coverImg: string;
  userId: string;
}
export interface Photos {
  id: string;
  url: string;
  albumId: string;
  altText: string;
}

export interface AlbumsProps {
  albums: Album[];
  basePath: string;
}

export interface User {
  email: string | null;
  uid: string;
}
