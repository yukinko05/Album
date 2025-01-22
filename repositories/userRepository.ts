import { auth } from "@/lib/firebase";
import type { UserInput } from "@/types/type";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from "@firebase/auth";

export const userRepository = {
	async signUpUser(data: UserInput) {
		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				data.email,
				data.password,
			);
			return userCredential.user;
		} catch (error) {
			return Promise.reject(error);
		}
	},

	async loginUser(data: UserInput) {
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
};
