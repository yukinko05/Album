export interface Album {
	albumId: string;
	title: string;
	createdAt: string;
	updatedAt: string;
	coverPhotoUrl: string;
	userId: string;
	sharegroupId: string;
}

export interface AlbumCardProps {
	album: Album;
	sharegroupId: string;
	className?: string;
	sharedgroupTitle?: string;
}

export interface AlbumUpdateRequest {
	data: {
		title: string;
		coverPhotoUrl: string;
	};
	albumId: string;
}

export interface EditAlbumTitleRequest {
	title: string;
	albumId: string;
}

export interface EditAlbumCoverPhotoRequest {
	coverPhotoUrl: string;
	albumId: string;
}

export interface AlbumCreateInputs {
	albumData: {
		title: string;
		photos: string[];
	};
	userId: string;
	sharegroupId: string;
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
