import { db, storage } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "@firebase/firestore";
import { auth } from "@/lib/firebase";
import type { NewUserInput, LoginUserInput } from "@/types/userTypes";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from "@firebase/auth";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

export const userRepository = {
	async signUpUser(userInputData: NewUserInput) {
		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				userInputData.email,
				userInputData.password,
			);

			const email = userCredential.user.email;
			if (!email) {
				throw new Error("メールアドレスが取得できませんでした。");
			}

			const createdAt =
				userCredential.user.metadata.creationTime ?? new Date().toISOString();

			const userRef = doc(db, "users", userCredential.user.uid);

			let iconImgUrl = null;
			if (userInputData.iconImg) {
				const storageRef = ref(storage, `userIcons/${userCredential.user.uid}`);
				const iconImgSnapshot = await uploadString(
					storageRef,
					userInputData.iconImg,
					"data_url",
				);
				iconImgUrl = await getDownloadURL(iconImgSnapshot.ref);
			}
			await setDoc(userRef, {
				email: userInputData.email,
				userName: userInputData.userName,
				iconImg: iconImgUrl,
				createdAt: userCredential.user.metadata.creationTime,
			});
			return {
				uid: userCredential.user.uid,
				email: email,
				userName: userInputData.userName,
				createdAt: createdAt,
				iconImg: iconImgUrl,
			};
		} catch (error) {
			console.error("SignUp failed:", error);
			return Promise.reject(error);
		}
	},

	async loginUser(data: LoginUserInput) {
		try {
			const userCredential = await signInWithEmailAndPassword(
				auth,
				data.email,
				data.password,
			);
			return userCredential.user;
		} catch (error) {
			console.error("Error in userRepository.loginUser:", error);
			throw error;
		}
	},

	async fetchUser(userId: string) {
		try {
			const userRef = doc(db, "users", userId);
			const userDoc = await getDoc(userRef);

			if (!userDoc.exists()) {
				throw new Error("指定されたユーザーが見つかりません");
			}

			const userData = userDoc.data();

			return {
				userId: userDoc.id,
				email: userData.email,
				userName: userData.userName,
				iconImg: userData.iconImg,
				createdAt: userData.createdAt,
			};
		} catch (error) {
			console.error("ユーザーデータの取得に失敗しました", error);
			throw new Error(
				`ユーザーデータの取得に失敗しました。 エラー: ${
					error instanceof Error ? error.message : "不明なエラー"
				}`,
			);
		}
	},
};
