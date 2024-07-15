export interface Album {
	id: string;
	title: string;
	createdAt: string;
	coverImg: string;
	altText: string;
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
