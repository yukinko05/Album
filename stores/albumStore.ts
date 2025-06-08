import { create } from "zustand";
import { albumRepository } from "@/repositories/albumRepository";
import dayjs from "dayjs";
import type {
  Album,
  AlbumCreateInputs,
  AlbumUpdateRequest,
  EditAlbumTitleRequest,
  EditAlbumCoverPhotoRequest,
  DeleteAlbumRequest,
} from "@/types/albumTypes";

interface AlbumState {
  albums: Album[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: unknown | null;

  getAlbums: (sharegroupId: string) => Promise<Album[]>;
  createAlbum: (albumData: AlbumCreateInputs) => Promise<void>;
  updateAlbum: (data: AlbumUpdateRequest) => Promise<void>;
  editAlbumTitle: (data: EditAlbumTitleRequest) => Promise<void>;
  editAlbumCoverPhoto: (data: EditAlbumCoverPhotoRequest) => Promise<void>;
  deleteAlbum: (data: DeleteAlbumRequest) => Promise<void>;
}

export const useAlbumStore = create<AlbumState>((set, get) => ({
  albums: [],
  status: "idle",
  error: null,

  getAlbums: async (sharegroupId) => {
    set({ status: "loading", error: null });
    try {
      // リポジトリを使用してアルバム情報を取得
      const albumsSnapshot = await albumRepository.fetchAlbums(sharegroupId);

      const albums = albumsSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          albumId: doc.id,
          title: data.title,
          createdAt: dayjs(data.createdAt.toDate()).format("YYYY-MM-DD"),
          updatedAt: dayjs(data.updatedAt.toDate()).format("YYYY-MM-DD"),
          coverPhotoUrl: data.coverPhotoUrl,
          userId: data.userId,
          sharegroupId: data.sharegroupId,
        };
      });

      set({ albums, status: "succeeded" });
      return albums;
    } catch (error) {
      set({ error, status: "failed" });
      throw error;
    }
  },

  createAlbum: async (albumData) => {
    set({ status: "loading", error: null });
    try {
      // リポジトリを使用してアルバムを作成
      await albumRepository.createAlbum(albumData);

      set({ status: "succeeded" });
    } catch (error) {
      set({ error, status: "failed" });
      throw error;
    }
  },

  updateAlbum: async (data) => {
    set({ status: "loading", error: null });
    try {
      // リポジトリを使用してアルバムを更新
      await albumRepository.updateAlbum(data);

      set({ status: "succeeded" });
    } catch (error) {
      set({ error, status: "failed" });
      throw error;
    }
  },

  editAlbumTitle: async (data) => {
    set({ status: "loading", error: null });
    try {
      // リポジトリを使用してアルバムタイトルを更新
      await albumRepository.editAlbumTitle(data);

      set({ status: "succeeded" });
    } catch (error) {
      set({ error, status: "failed" });
      throw error;
    }
  },

  editAlbumCoverPhoto: async (data) => {
    set({ status: "loading", error: null });
    try {
      // リポジトリを使用してカバー写真を更新
      await albumRepository.editAlbumCover(data);

      set({ status: "succeeded" });
    } catch (error) {
      set({ error, status: "failed" });
      throw error;
    }
  },

  deleteAlbum: async (data) => {
    set({ status: "loading", error: null });
    try {
      // リポジトリを使用してアルバムを削除
      await albumRepository.deleteAlbum(data);

      set({ status: "succeeded" });
    } catch (error) {
      set({ error, status: "failed" });
      throw error;
    }
  },
}));
