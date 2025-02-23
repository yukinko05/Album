import { albumRepository } from "@/repositories/albumRepository";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type {
	Album,
	AlbumCreateInputs,
	AlbumUpdateRequest,
	EditAlbumTitleRequest,
	EditAlbumCoverPhotoRequest,
} from "@/types/albumTypes";
import dayjs from "dayjs";
import type { DeleteAlbumRequest } from "@/types/albumTypes";

export const getAlbums = createAsyncThunk<Album[], string>(
	"albums/getAlbums",
	async (shareRoomId) => {
		try {
			const albumsSnapshot = await albumRepository.fetchAlbums(shareRoomId);
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
	"album/createAlbum",
	async ({ albumData, userId, shareRoomId }: AlbumCreateInputs) => {
		try {
			await albumRepository.createAlbum({ albumData, userId, shareRoomId });
		} catch (error) {
			console.error(error);
			throw error;
		}
	},
);

export const editAlbumTitle = createAsyncThunk(
	"album/editAlbumTitle",
	async ({ title, albumId }: EditAlbumTitleRequest) => {
		try {
			await albumRepository.editAlbumTitle({ title, albumId });
		} catch (error) {
			console.error(error);
			throw error;
		}
	},
);

export const editAlbumCover = createAsyncThunk(
	"album/editAlbumCover",
	async ({ coverPhotoUrl, albumId }: EditAlbumCoverPhotoRequest) => {
		try {
			await albumRepository.editAlbumCover({ coverPhotoUrl, albumId });
		} catch (error) {
			console.error(error);
			throw error;
		}
	},
);

export const updateAlbum = createAsyncThunk(
	"album/editAlbum",
	async ({ data, albumId }: AlbumUpdateRequest) => {
		try {
			await albumRepository.updateAlbum({ data, albumId });
		} catch (error) {
			console.error(error);
			throw error;
		}
	},
);

export const deleteAlbum = createAsyncThunk(
	"album/deleteAlbum",
	async ({ albumId, photos }: DeleteAlbumRequest) => {
		try {
			await albumRepository.deleteAlbum({ albumId, photos });
		} catch (error) {
			console.error(error);
			throw error;
		}
	},
);
