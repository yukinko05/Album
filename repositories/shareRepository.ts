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
  limit,
} from "@firebase/firestore";
import type {
  CreateSharegroupRequest,
  SharegroupJoinRequest,
} from "@/types/shareTypes";

export const shareRepository = {
  async fetchSharegroups(userId: string) {
    const groupS_PER_PAGE = 10;

    try {
      const col = collection(db, "shareID");
      const q = query(
        col,
        where("users", "array-contains", userId),
        orderBy("createdAt", "desc"),
        limit(groupS_PER_PAGE)
      );

      const sharegroupSnapshot = await getDocs(q);
      return sharegroupSnapshot;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "不明なエラー";
      console.error(`グループデータ取得に失敗しました: ${errorMessage}`);
      throw new Error(
        `グループデータ取得に失敗しました。詳細: ${errorMessage}。}`
      );
    }
  },
  async createSharegroup({
    userId,
    sharedgroupTitle,
  }: CreateSharegroupRequest) {
    try {
      const shareIDCollection = collection(db, "shareID");
      const shareIdRef = await addDoc(shareIDCollection, {
        sharedgroupTitle,
        users: [userId],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return { shareId: shareIdRef.id, sharedgroupTitle };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "不明なエラー";
      console.error(`シェアIDの発行に失敗しました: ${errorMessage}`);
      throw new Error(
        `シェアIDの発行に失敗しました。詳細: ${errorMessage}。データ: { userId: ${userId}, title: ${sharedgroupTitle} }`
      );
    }
  },

  async sharegroupJoin({ userId, sharedgroupId }: SharegroupJoinRequest) {
    if (!userId || !sharedgroupId) {
      throw new Error("ユーザーIDまたは共有グループIDが指定されていません");
    }

    try {
      const shareRef = doc(db, "shareID", sharedgroupId);
      const shareDoc = await getDoc(shareRef);

      if (!shareDoc.exists()) {
        throw new Error("指定されたシェアグループが見つかりません。");
      }

      const shareData = shareDoc.data();
      const users = shareData.users || [];

      const MAX_USERS = 50;
      if (users.length >= MAX_USERS) {
        throw new Error("シェアグループの参加人数が上限に達しています。");
      }

      if (shareData.status === "closed") {
        throw new Error("このシェアグループは現在クローズされています。");
      }

      if (users.includes(userId)) {
        throw new Error("既にこのシェアグループに参加しています。");
      }

      await updateDoc(shareRef, {
        users: arrayUnion(userId),
        updatedAt: serverTimestamp(),
      });

      return {
        shareId: shareRef.id,
        sharedgroupTitle: shareData.sharedgroupTitle,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "不明なエラー";
      console.error(`シェアグループの参加に失敗しました: ${errorMessage}`);
      throw new Error(
        `シェアグループの参加に失敗しました。詳細: ${errorMessage}。データ: { userId: ${userId}, sharedgroupId: ${sharedgroupId} }`
      );
    }
  },
};
