import { albumRepository } from "@/repositories/albumRepository";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type {
	Album,
	AlbumCreateInputs,
	AlbumUpdataRequest,
} from "@/types/albumTypes";
import dayjs from "dayjs";

export const getAlbums = createAsyncThunk<Album[], string>(
	"albums/getAlbums",
	async (uid) => {
		try {
			const albumsSnapshot = await albumRepository.fetchAlbums(uid);
			return albumsSnapshot.docs
				.map((doc) => {
					const data = doc.data();

					const createdAt = data.createdAt.toDate().toISOString();

					const formattedCreatedAt = createdAt
						? dayjs(createdAt).format("YYYY-MM-DD")
						: null;

					if (!data.createdAt || !formattedCreatedAt) return;

					return {
						...data,
						createdAt: formattedCreatedAt,
						albumId: doc.id,
					};
				})
				.filter((album): album is Album => album !== undefined);
		} catch (error) {
			console.error(error);
			throw error;
		}
	},
);

export const createAlbum = createAsyncThunk(
	"albums/createAlbum",
	async ({ albumData, uid }: AlbumCreateInputs) => {
		try {
			await albumRepository.createAlbum({ albumData, uid });
		} catch (error) {
			console.error(error);
			throw error;
		}
	},
);

export const updateAlbum = createAsyncThunk(
	"albums/editAlbum",
	async ({ data, uid, id }: AlbumUpdataRequest) => {
		try {
			await albumRepository.updateAlbum({ data, uid, id });
		} catch (error) {
			console.error(error);
			throw error;
		}
	},
);
