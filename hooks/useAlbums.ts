import { useAlbumStore } from "@/stores/albumStore";

export const useAlbums = () => {
	const albums = useAlbumStore((state) => state.albums);
	const status = useAlbumStore((state) => state.status);
	const getAlbums = useAlbumStore((state) => state.getAlbums);

	const getAlbumsAction = (data: { userId: string }) => getAlbums(data.userId);

	return { albums, status, getAlbumsAction };
};
