import { create } from "zustand";
import { auth } from "@/lib/firebase";
import type { User } from "firebase/auth";
import { signOut, onAuthStateChanged } from "firebase/auth";

interface AuthState {
	currentUser: User | null;
	isAuthStateChecking: boolean;
	error: unknown | null;

	initialize: () => Promise<void>;
	logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
	currentUser: null,
	isAuthStateChecking: true,
	error: null,

	initialize: async () => {
		return new Promise<void>((resolve) => {
			const unsubscribe = onAuthStateChanged(auth, (user) => {
				set({
					currentUser: user,
					isAuthStateChecking: false,
				});
				resolve();
			});

			return () => {
				unsubscribe();
			};
		});
	},

	logout: async () => {
		try {
			await signOut(auth);
			set({
				currentUser: null,
				isAuthStateChecking: false,
			});
		} catch (error) {
			console.error("ログアウトに失敗しました:", error);
			set({ error });
			throw error;
		}
	},
}));
