import { photoRepository } from "@/repositories/photoRepository";
import type { Photo, AddPhotosRequest } from "@/types/photoTypes";
import dayjs from "dayjs";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getPhotos = async (albumId: string) => {
	try {
		const photosSnapshot = await photoRepository.fetchPhotos(albumId);
		return photosSnapshot.docs
			.map((doc) => {
				const photoData = doc.data();

				if (!photoData?.createdAt || !photoData?.photoUrl) {
					console.warn(`Invalid photo data found: ${doc.id}`);
					return null;
				}

				const formattedCreatedAt = dayjs(photoData.createdAt.toDate()).format(
					"YYYY-MM-DD",
				);
				if (!dayjs(formattedCreatedAt).isValid()) {
					console.warn(`不正な日付フォーマット: ${doc.id}`);
					return null;
				}

				return {
					photoId: doc.id,
					...photoData,
					createdAt: formattedCreatedAt,
				};
			})
			.filter((photo): photo is Photo => photo !== null);
	} catch (error) {
		if (error instanceof Error) {
			console.error(`写真の取得中にエラーが発生しました: ${error.message}`);
			throw new Error(
				`アルバム(${albumId})の写真取得に失敗しました: ${error.message}`,
			);
		}
		console.error("予期せぬエラーが発生しました:", error);
		throw new Error(`予期せぬエラーが発生しました`);
	}
};

export const addPhotos = createAsyncThunk(
	"photo/addPhotos",
	async ({ photosList, albumId, uid }: AddPhotosRequest) => {
		try {
			await photoRepository.addPhotos({ photosList, albumId, uid });
		} catch (error) {
			console.error(error);
			throw error;
		}
	},
);

export const photoSelectDelete = createAsyncThunk(
	"photo/photoSelectDelete",
	async (photosToDelete: Photo[]) => {
		try {
			await photoRepository.photoSelectDelete(photosToDelete);
		} catch (error) {
			console.error(error);
			throw error;
		}
	},
);
