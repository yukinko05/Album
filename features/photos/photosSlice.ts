import type { Photo } from "@/types/photoTypes";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface PhotoState {
	photos: Photo[];
}

const initialState: PhotoState = {
	photos: [],
};

export const photoSlice = createSlice({
	name: "photos",
	initialState,
	reducers: {
		setPhotos: (state, action: PayloadAction<Photo[]>) => {
			state.photos = action.payload;
		},
	},
});

export const { setPhotos } = photoSlice.actions;
export default photoSlice.reducer;
