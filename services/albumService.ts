import { albumRepository } from "@/repositories/albumRepository";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Album, CreateAlbumRequest, EditAlbumRequest } from "@/types/type";
import dayjs from "dayjs";

export const getAlbums = createAsyncThunk<Album[], string>(
  "albums/getAlbums",
  async (uid: string) => {
    try {
      const albumsSnapshot = await albumRepository.fetchAlbums(uid);
      return albumsSnapshot.docs.map((doc) => {
        const data = doc.data();

        const createdAt =
          data.createdAt !== null
            ? data.createdAt.toDate().toISOString()
            : null;

        const formattedCreatedAt = createdAt
          ? dayjs(createdAt).format("YYYY-MM-DD")
          : null;

        return { id: doc.id, ...data, createdAt: formattedCreatedAt };
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const createAlbum = createAsyncThunk(
  "albums/createAlbum",
  async ({ data, uid }: CreateAlbumRequest) => {
    try {
      await albumRepository.createAlbum({ data, uid });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const editAlbum = createAsyncThunk(
  "albums/editAlbum",
  async ({ data, uid, albumId }: EditAlbumRequest) => {
    try {
      await albumRepository.editAlbum({ data, uid, albumId });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);
