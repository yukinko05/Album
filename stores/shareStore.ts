import { create } from "zustand";
import { shareRepository } from "@/repositories/shareRepository";
import dayjs from "dayjs";
import type {
	ShareRooms,
	CreateShareRoomRequest,
	ShareRoomJoinRequest,
} from "@/types/shareTypes";

interface ShareState {
	shareRooms: ShareRooms[];
	status: "idle" | "loading" | "succeeded" | "failed";
	error: unknown | null;

	getShareRooms: (userId: string) => Promise<ShareRooms[]>;
	createShareRoom: (
		data: CreateShareRoomRequest,
	) => Promise<{ shareId: string }>;
	shareRoomJoin: (
		data: ShareRoomJoinRequest,
	) => Promise<{ sharedRoomTitle: string }>;
}

export const useShareStore = create<ShareState>((set, get) => ({
	shareRooms: [],
	status: "idle",
	error: null,

	getShareRooms: async (userId) => {
		set({ status: "loading", error: null });
		try {
			// リポジトリを使用して共有ルーム情報を取得
			const shareRoomsSnapshot = await shareRepository.fetchShareRooms(userId);

			if (shareRoomsSnapshot.empty) {
				set({ shareRooms: [], status: "succeeded" });
				return [];
			}

			const shareRooms = shareRoomsSnapshot.docs
				.map((doc) => {
					const roomData = doc.data();

					if (!roomData?.createdAt || !roomData?.updatedAt) {
						console.warn(`Invalid room data found: ${doc.id}`);
						return null;
					}

					const formattedCreatedAt = dayjs(roomData.createdAt.toDate()).format(
						"YYYY-MM-DD",
					);
					const formattedUpdatedAt = dayjs(roomData.updatedAt.toDate()).format(
						"YYYY-MM-DD",
					);

					return {
						shareRoomId: doc.id,
						sharedRoomTitle: roomData.sharedRoomTitle,
						createdAt: formattedCreatedAt,
						updatedAt: formattedUpdatedAt,
						users: roomData.users,
					};
				})
				.filter(Boolean) as ShareRooms[];

			set({ shareRooms, status: "succeeded" });
			return shareRooms;
		} catch (error) {
			set({ error, status: "failed" });
			throw error;
		}
	},

	createShareRoom: async (data) => {
		set({ status: "loading", error: null });
		try {
			// リポジトリを使用して共有ルームを作成
			const result = await shareRepository.createShareRoom(data);

			set({ status: "succeeded" });
			return { shareId: result.shareId };
		} catch (error) {
			set({ error, status: "failed" });
			throw error;
		}
	},

	shareRoomJoin: async (data) => {
		set({ status: "loading", error: null });
		try {
			// リポジトリを使用して共有ルームに参加
			const result = await shareRepository.shareRoomJoin(data);

			set({ status: "succeeded" });
			return { sharedRoomTitle: result.sharedRoomTitle };
		} catch (error) {
			set({ error, status: "failed" });
			throw error;
		}
	},
}));
