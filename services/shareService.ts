import { shareRepository } from "@/repositories/shareRepository";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { CreateShareRoomRequest } from "@/types/shareTypes";

export const createShareRoom = createAsyncThunk(
	"share/createShareRoom",
	async ({ userId, sharedRoomTitle }: CreateShareRoomRequest) => {
		try {
			const shareIdSnapshot = await shareRepository.createShareRoom({
				userId,
				sharedRoomTitle,
			});

			return shareIdSnapshot;
		} catch (error) {
			console.error(error);
			throw error;
		}
	},
);
