import { db } from "@/lib/firebase";
import { collection, serverTimestamp, addDoc } from "@firebase/firestore";
import type { CreateShareRoomRequest } from "@/types/shareTypes";

export const shareRepository = {
	async createShareRoom({ userId, sharedRoomTitle }: CreateShareRoomRequest) {
		try {
			const shareIDCollection = collection(db, "shareID");
			const shareIdRef = await addDoc(shareIDCollection, {
				sharedRoomTitle,
				users: [userId],
				createdAt: serverTimestamp(),
				updatedAt: null,
			});

			return { shareId: shareIdRef.id, sharedRoomTitle };
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "不明なエラー";
			console.error(`シェアIDの発行に失敗しました: ${errorMessage}`);
			throw new Error(
				`シェアIDの発行に失敗しました。詳細: ${errorMessage}。データ: { userId: ${userId}, title: ${sharedRoomTitle} }`,
			);
		}
	},
};
