import { Timestamp } from "firebase/firestore";

export interface Album {
	albumId: string;
	title: string;
	createdAt: string;
	coverPhotoUrl: string;
	userId: string;
	sharedWith: Array<string>;
}

export interface AlbumUpdateInput {
	data: {
		title: string;
		coverPhotoUrl: string;
	};
}
export interface AlbumUpdataRequest {
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
export interface Photos {
	id: string;
	url: string;
	albumId: string;
}
