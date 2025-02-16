import { shareIdRepository } from "@/repositories/shareIDRepository";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ShareIDGenerateRequest } from "@/types/shareTypes";

export const generateShareId = createAsyncThunk(
	"share/generateShareID",
	async ({ userId, sharedRoomTitle }: ShareIDGenerateRequest) => {
		try {
			const shareIdSnapshot = await shareIdRepository.generateShareId({
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
