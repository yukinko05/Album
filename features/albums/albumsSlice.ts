import {createSlice} from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit";
import {Album} from "@/types/type";
import {state} from "sucrase/dist/types/parser/traverser/base";

export interface AlbumState {
    albums: Album[]
}

const initialState: AlbumState = {
    albums: []
};

export const albumsSlice = createSlice({
    name: "albums",
    initialState,
    reducers: {
        setAlbums: (state, action:PayloadAction<Album[]>) => {
            state.albums = action.payload;
        }
    }
})

export const {setAlbums} = albumsSlice.actions;
export default albumsSlice.reducer;