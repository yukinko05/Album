import { create } from "zustand";
import { auth } from "@/lib/firebase";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
} from "firebase/auth";
import { userRepository } from "@/repositories/userRepository";
import type {
	User,
	NewUserInput,
	LoginUserInput,
	LoginUser,
} from "@/types/userTypes";

interface UserState {
	user: User | LoginUser | null;
	status: "idle" | "loading" | "succeeded" | "failed";
	error: unknown | null;

	login: (userData: LoginUserInput) => Promise<any>;
	signUp: (userData: NewUserInput) => Promise<any>;
	logout: () => Promise<void>;
	getUser: (userId: string) => Promise<User>;
}

export const useUserStore = create<UserState>((set, get) => ({
	user: null,
	status: "idle",
	error: null,

	login: async (userData) => {
		set({ status: "loading", error: null });
		try {
			const userCredential = await signInWithEmailAndPassword(
				auth,
				userData.email,
				userData.password,
			);
			const loginUser = {
				email: userData.email,
				uid: userCredential.user.uid,
			};
			set({ user: loginUser, status: "succeeded" });
			return loginUser;
		} catch (error) {
			set({ error, status: "failed" });
			throw error;
		}
	},

	signUp: async (userData) => {
		set({ status: "loading", error: null });
		try {
			// リポジトリを使用してユーザー情報を保存
			const newUser = await userRepository.signUpUser(userData);

			set({ user: newUser, status: "succeeded" });
			return newUser;
		} catch (error) {
			set({ error, status: "failed" });
			throw error;
		}
	},

	logout: async () => {
		try {
			await signOut(auth);
			set({ user: null });
		} catch (error) {
			console.error("ログアウトに失敗しました:", error);
			throw error;
		}
	},

	getUser: async (userId) => {
		set({ status: "loading", error: null });
		try {
			// リポジトリを使用してユーザー情報を取得
			const userData = await userRepository.fetchUser(userId);
			set({ user: userData, status: "succeeded" });
			return userData;
		} catch (error) {
			set({ error, status: "failed" });
			throw error;
		}
	},
}));
