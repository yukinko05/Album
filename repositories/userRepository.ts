import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from "@firebase/auth";
import { auth } from "@/lib/firebase";
import { UserInput } from "@/types/type";

export const userRepository = {
	async signUpUser(data: UserInput) {
		const userCredential = await createUserWithEmailAndPassword(
			auth,
			data.email,
			data.password,
		);
		const user = userCredential.user;

		return user;
	},

	async loginUser(data: UserInput) {
		try {
			const userCredential = await signInWithEmailAndPassword(
				auth,
				data.email,
				data.password,
			);
			const user = userCredential.user;

			return user;
		} catch (error) {
			throw new Error(
				"入力された情報に誤りがあります。正しいメールアドレスとパスワードを入力してください。",
			);
		}
	},
};
