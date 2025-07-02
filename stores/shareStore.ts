import { create } from "zustand";
import { shareRepository } from "@/repositories/shareRepository";
import dayjs from "dayjs";
import type {
  Sharegroups,
  CreateSharegroupRequest,
  SharegroupJoinRequest,
} from "@/types/shareTypes";

interface ShareState {
  sharegroups: Sharegroups[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: unknown | null;

  getSharegroups: (userId: string) => Promise<Sharegroups[]>;
  createSharegroup: (
    data: CreateSharegroupRequest
  ) => Promise<{ shareId: string }>;
  sharegroupJoin: (
    data: SharegroupJoinRequest
  ) => Promise<{ sharedgroupTitle: string }>;
}

export const useShareStore = create<ShareState>((set, get) => ({
  sharegroups: [],
  status: "idle",
  error: null,

  getSharegroups: async (userId) => {
    set({ status: "loading", error: null });
    try {
      // リポジトリを使用して共有グループ情報を取得
      const sharegroupsSnapshot = await shareRepository.fetchSharegroups(
        userId
      );

      if (sharegroupsSnapshot.empty) {
        set({ sharegroups: [], status: "succeeded" });
        return [];
      }

      const sharegroups = sharegroupsSnapshot.docs
        .map((doc) => {
          const groupData = doc.data();

          if (!groupData?.createdAt || !groupData?.updatedAt) {
            console.warn(`Invalid group data found: ${doc.id}`);
            return null;
          }

          const formattedCreatedAt = dayjs(groupData.createdAt.toDate()).format(
            "YYYY-MM-DD"
          );
          const formattedUpdatedAt = dayjs(groupData.updatedAt.toDate()).format(
            "YYYY-MM-DD"
          );

          return {
            sharegroupId: doc.id,
            sharedgroupTitle: groupData.sharedgroupTitle,
            createdAt: formattedCreatedAt,
            updatedAt: formattedUpdatedAt,
            users: groupData.users,
          };
        })
        .filter(Boolean) as Sharegroups[];

      set({ sharegroups, status: "succeeded" });
      return sharegroups;
    } catch (error) {
      set({ error, status: "failed" });
      throw error;
    }
  },

  createSharegroup: async (data) => {
    set({ status: "loading", error: null });
    try {
      // リポジトリを使用して共有グループを作成
      const result = await shareRepository.createSharegroup(data);

      set({ status: "succeeded" });
      return { shareId: result.shareId };
    } catch (error) {
      set({ error, status: "failed" });
      throw error;
    }
  },

  sharegroupJoin: async (data) => {
    set({ status: "loading", error: null });
    try {
      // リポジトリを使用して共有グループに参加
      const result = await shareRepository.sharegroupJoin(data);

      set({ status: "succeeded" });
      return { sharedgroupTitle: result.sharedgroupTitle };
    } catch (error) {
      set({ error, status: "failed" });
      throw error;
    }
  },
}));
