import { Timestamp } from "firebase/firestore";

export interface Album {
	albumId: string;
	title: string;
	createdAt: string;
	coverPhotoUrl: string;
	userId: string;
	sharedWith: Array<string>;
}

export interface AlbumUpdateRequest {
	data: {
		title: string;
		coverPhotoUrl: string;
	};
	id: string;
}

export interface EditAlbumTitleRequest {
	title: string;
	albumId: string;
}

export interface EditAlbumCoverPhotoRequest {
	coverPhotoUrl: string;
	albumId: string;
}

export interface CreateAlbumRequest {
	id: string | null;
	title: string;
	coverPhotoUrl: string | null;
	createdAt: Timestamp;
	photos: string[];
	uid: string;
	sharedWith: Array<string>;
}
export interface AlbumCreateInputs {
	albumData: {
		title: string;
		photos: string[];
	};
	uid: string;
}

export interface AlbumFormProps {
	title: string;
	file: FileList[];
}

export interface DeleteAlbumRequest {
	albumId: string;
	photos: {
		photoId: string;
		photoUrl: string;
	}[];
}
