import albumReducer from "@/features/albums/albumsSlice";
import photosReducer from "@/features/photos/photosSlice";
import userReducer from "@/features/user/userSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
	reducer: {
		albums: albumReducer,
		photos: photosReducer,
		user: userReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
