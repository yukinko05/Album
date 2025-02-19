import { shareRepository } from "@/repositories/shareRepository";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type {
	CreateShareRoomRequest,
	ShareRoomJoinRequest,
} from "@/types/shareTypes";

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
			if (error instanceof Error) {
				console.error(`ルームの作成に失敗しました: ${error.message}`);
				throw new Error(
					`【${sharedRoomTitle}】ルームの作成に失敗しました: ${error.message}`,
				);
			}
			console.error("予期せぬエラーが発生しました:", error);
			throw new Error("ルームの作成中に予期せぬエラーが発生しました");
		}
	},
);

export const shareRoomJoin = createAsyncThunk(
	"share/shareRoomJoin",
	async ({ userId, sharedRoomId }: ShareRoomJoinRequest) => {
		try {
			await shareRepository.shareRoomJoin({ userId, sharedRoomId });
		} catch (error) {
			if (error instanceof Error) {
				console.error(`ルームの参加に失敗しました: ${error.message}`);
				throw new Error(
					`ID(${sharedRoomId})ルームの参加に失敗しました: ${error.message}`,
				);
			}
			console.error("予期せぬエラーが発生しました:", error);
			throw new Error("ルームの参加中に予期せぬエラーが発生しました");
		}
	},
);
