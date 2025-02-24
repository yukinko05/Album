import { db } from "@/lib/firebase";
import {
	collection,
	serverTimestamp,
	addDoc,
	doc,
	getDoc,
	updateDoc,
	arrayUnion,
	query,
	where,
	getDocs,
	orderBy,
} from "@firebase/firestore";
import type {
	CreateShareRoomRequest,
	ShareRoomJoinRequest,
} from "@/types/shareTypes";

export const shareRepository = {
	async fetchShareRooms(userId: string) {
		try {
			const col = collection(db, "shareID");
			const q = query(
				col,
				where("users", "array-contains", userId),
				orderBy("createdAt", "desc"),
			);

			const shareRoomSnapshot = await getDocs(q);
			return shareRoomSnapshot;
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "不明なエラー";
			console.error(`ルームデータ取得に失敗しました: ${errorMessage}`);
			throw new Error(
				`ルームデータ取得に失敗しました。詳細: ${errorMessage}。}`,
			);
		}
	},
	async createShareRoom({ userId, sharedRoomTitle }: CreateShareRoomRequest) {
		try {
			const shareIDCollection = collection(db, "shareID");
			const shareIdRef = await addDoc(shareIDCollection, {
				sharedRoomTitle,
				users: [userId],
				createdAt: serverTimestamp(),
				updatedAt: serverTimestamp(),
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

	async shareRoomJoin({ userId, sharedRoomId }: ShareRoomJoinRequest) {
		try {
			const shareRef = doc(db, "shareID", sharedRoomId);
			const shareDoc = await getDoc(shareRef);

			if (!shareDoc.exists()) {
				throw new Error("指定されたシェアルームが見つかりません。");
			}

			const shareData = shareDoc.data();
			const users = shareData.users || [];

			const MAX_USERS = 50;
			if (users.length >= MAX_USERS) {
				throw new Error("シェアルームの参加人数が上限に達しています。");
			}

			if (shareData.status === "closed") {
				throw new Error("このシェアルームは現在クローズされています。");
			}

			if (users.includes(userId)) {
				throw new Error("既にこのシェアルームに参加しています。");
			}

			await updateDoc(shareRef, {
				users: arrayUnion(userId),
				updatedAt: serverTimestamp(),
			});

			return {
				shareId: shareRef.id,
				sharedRoomTitle: shareData.sharedRoomTitle,
			};
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "不明なエラー";
			console.error(`シェアルームの参加に失敗しました: ${errorMessage}`);
			throw new Error(
				`シェアルームの参加に失敗しました。詳細: ${errorMessage}。データ: { userId: ${userId}, sharedRoomId: ${sharedRoomId} }`,
			);
		}
	},
};
