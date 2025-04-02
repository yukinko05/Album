export interface Photo {
	photoId: string;
	createdAt: string;
	albumId: string;
	photoUrl: string;
	userId: string;
}

export interface AddPhotosRequest {
	albumId: string;
	photosList: string[];
	userId: string;
}

export interface PhotoSelectDeleteProps {
	albumId: string;
	photos: Photo[];
	onClose: () => void;
}

export interface PhotoSelectDeleteRequest {
	photosToDelete: Photo[];
	albumId: string;
}
