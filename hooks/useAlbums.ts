import { getAlbums } from "@/services/albumService";
import type { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";

export const useAlbums = () => {
	const dispatch = useDispatch<AppDispatch>();
	const albums = useSelector((state: RootState) => state.albums.albums);
	const status = useSelector((state: RootState) => state.albums.status);

	const getAlbumsAction = (data: { userId: string }) =>
		dispatch(getAlbums(data.userId));

	return { albums, status, getAlbumsAction };
};
