import { shareRepository } from "@/repositories/shareRepository";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type {
	CreateShareRoomRequest,
	ShareRoomJoinRequest,
	ShareRooms,
} from "@/types/shareTypes";
import dayjs from "dayjs";

export const getShareRooms = createAsyncThunk(
	"share/getShareRooms",
	async (userId: string) => {
		try {
			const shareRoomsSnapshot = await shareRepository.fetchShareRooms(userId);
			return shareRoomsSnapshot.docs
				.map((doc) => {
					const roomData = doc.data();

					if (!roomData?.createdAt) {
						console.warn(`Invalid room data found: ${doc.id}`);
						return null;
					}

					const formattedCreatedAt = dayjs(roomData.createdAt.toDate()).format(
						"YYYY-MM-DD",
					);
					if (!dayjs(formattedCreatedAt).isValid()) {
						console.warn(`不正な日付フォーマット: ${doc.id}`);
						return null;
					}

					return {
						shareRoomId: doc.id,
						...roomData,
						createdAt: formattedCreatedAt,
					};
				})
				.filter((room): room is ShareRooms => room !== null);
		} catch (error) {
			if (error instanceof Error) {
				console.error(
					`ルームデータの取得中にエラーが発生しました: ${error.message}`,
				);
				throw new Error(`ルームデータの取得に失敗しました: ${error.message}`);
			}
			console.error("予期せぬエラーが発生しました:", error);
			throw new Error(`予期せぬエラーが発生しました`);
		}
	},
);

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
