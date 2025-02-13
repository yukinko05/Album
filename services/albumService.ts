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
import type { PhotosProps } from "@/types/photoTypes";

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
  }
);

export const createAlbum = createAsyncThunk(
  "album/createAlbum",
  async ({ albumData, uid }: AlbumCreateInputs) => {
    try {
      await albumRepository.createAlbum({ albumData, uid });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
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
  }
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
  }
);

export const updateAlbum = createAsyncThunk(
  "album/editAlbum",
  async ({ data, id }: AlbumUpdateRequest) => {
    try {
      await albumRepository.updateAlbum({ data, id });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const deleteAlbum = createAsyncThunk(
  "album/deleteAlbum",
  async ({ albumId, photos }: PhotosProps) => {
    try {
      await albumRepository.deleteAlbum({ albumId, photos });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);
