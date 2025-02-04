import { getAlbums } from "@/services/albumService";
import { createSlice } from "@reduxjs/toolkit";
import type { Album } from "@/types/albumTypes";
import { Timestamp } from "firebase/firestore";

export type AlbumDocument = Omit<Album, "id"> & {
	createdAt: Timestamp | null;
};

export interface AlbumState {
	albums: ReadonlyArray<Album>;
	status: "idle" | "loading" | "succeeded" | "failed";
	error: unknown | null;
}

const initialState: AlbumState = {
	albums: [],
	status: "idle",
	error: null,
};

export const albumsSlice = createSlice({
	name: "albums",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getAlbums.pending, (state) => {
				state.status = "loading";
				state.error = null;
			})
			.addCase(getAlbums.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.albums = action.payload;
			})
			.addCase(getAlbums.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.error.message;
			});
	},
});

export default albumsSlice.reducer;
