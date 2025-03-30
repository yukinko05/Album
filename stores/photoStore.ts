import { create } from "zustand";
import { photoRepository } from "@/repositories/photoRepository";
import dayjs from "dayjs";
import type { Photo, AddPhotosRequest } from "@/types/photoTypes";

interface PhotoState {
	photos: Photo[];
	status: "idle" | "loading" | "succeeded" | "failed";
	error: unknown | null;

	getPhotos: (albumId: string) => Promise<Photo[]>;
	addPhotos: (data: AddPhotosRequest) => Promise<void>;
	deletePhotos: (data: {
		photosToDelete: Photo[];
		albumId: string;
	}) => Promise<void>;
}

export const usePhotoStore = create<PhotoState>((set, get) => ({
	photos: [],
	status: "idle",
	error: null,

	getPhotos: async (albumId) => {
		set({ status: "loading", error: null });
		try {
			const photosSnapshot = await photoRepository.fetchPhotos(albumId);

			const photos = photosSnapshot.docs.map((doc) => {
				const data = doc.data();
				return {
					photoId: doc.id,
					createdAt: dayjs(data.createdAt.toDate()).format("YYYY-MM-DD"),
					albumId: data.albumId,
					photoUrl: data.photoUrl,
					userId: data.userId,
				};
			});

			set({ photos, status: "succeeded" });
			return photos;
		} catch (error) {
			set({ error, status: "failed" });
			throw error;
		}
	},

	addPhotos: async (data) => {
		set({ status: "loading", error: null });
		try {
			await photoRepository.addPhotos(data);

			set({ status: "succeeded" });
		} catch (error) {
			set({ error, status: "failed" });
			throw error;
		}
	},

	deletePhotos: async (data) => {
		set({ status: "loading", error: null });
		try {
			await photoRepository.photoSelectDelete(data);

			set({ status: "succeeded" });
		} catch (error) {
			set({ error, status: "failed" });
			throw error;
		}
	},
}));
