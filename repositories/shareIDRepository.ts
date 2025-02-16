import { db } from "@/lib/firebase";
import { collection, serverTimestamp, addDoc } from "@firebase/firestore";

export const shareIDRepository = {
	async generateShareID(userId: string) {
		try {
			const shareIDCollection = collection(db, "shareID");
			const shareIDRef = await addDoc(shareIDCollection, {
				users: [userId],
				createdAt: serverTimestamp(),
				updatedAt: null,
			});

			return shareIDRef.id;
		} catch (error) {
			console.error("シェアIDの発行に失敗しました", error);
			throw new Error(
				`シェアIDの発行に失敗しました: ${
					error instanceof Error ? error.message : "不明なエラー"
				}`,
			);
		}
	},
};
