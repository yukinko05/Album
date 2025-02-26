export interface Photo {
	photoId: string;
	createdAt: string;
	albumId: string;
	photoUrl: string;
	userId: string;
}

export interface Photos {
	photoId: string;
	url: string;
	albumId: string;
}
export interface PhotosProps {
	albumId: string;
	photos: Photo[];
}

export interface AddPhotosRequest {
	albumId: string;
	photosList: string[];
	userId: string;
}
