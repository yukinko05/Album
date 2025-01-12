export interface Album {
	id: string;
	title: string;
	createdAt: string | null;
	coverImg: string;
}

export interface AlbumCreateInputs {
	title: string;
	coverImg: string | null;
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
	uid: string;
}
