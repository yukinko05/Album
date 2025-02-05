import type { Photos } from "@/types/albumTypes";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface PhotoState {
	photos: Photos[];
}

const initialState: PhotoState = {
	photos: [],
};

export const photoSlice = createSlice({
	name: "photos",
	initialState,
	reducers: {
		setPhotos: (state, action: PayloadAction<Photos[]>) => {
			state.photos = action.payload;
		},
	},
});

export const { setPhotos } = photoSlice.actions;
export default photoSlice.reducer;
