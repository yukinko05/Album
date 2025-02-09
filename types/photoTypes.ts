export interface Photo {
	photoId: string;
	createdAt: string;
	albumId: string;
	photoUrl: string;
	userId: string;
}

export interface PhotosProps {
	albumId: string;
	photos: Photo[];
}
