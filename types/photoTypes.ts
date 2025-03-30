export interface Photo {
	photoId: string;
	createdAt: string;
	albumId: string;
	photoUrl: string;
	userId: string;
}
export interface PhotoSelectDeleteProps {
	albumId: string;
	photos: Photo[];
	onClose: () => void;
}
export interface AddPhotosRequest {
	albumId: string;
	photosList: string[];
	userId: string;
}
