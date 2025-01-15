import { userRepository } from "@/repositories/userRepository";
import type { UserInput } from "@/types/type";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { FirebaseError } from "firebase/app";

export const signUpUser = createAsyncThunk(
	"users/signUpUser",
	async (data: UserInput, { rejectWithValue }) => {
		try {
			const newUser = await userRepository.signUpUser(data);
			return {
				uid: newUser.uid,
				email: newUser.email,
			};
		} catch (error) {
			if (error instanceof FirebaseError) {
				switch (error.code) {
					case "auth/email-already-in-use":
						return rejectWithValue(
							"このメールアドレスは既に使用されています。",
						);
					case "auth/invalid-email":
						return rejectWithValue("無効なメールアドレスです。");
					default:
						return rejectWithValue("新規登録に失敗しました。");
				}
			}
			return rejectWithValue("新規登録に失敗しました。");
		}
	},
);

export const loginUser = createAsyncThunk(
	"users/loginUser",
	async (data: UserInput, { rejectWithValue }) => {
		try {
			const user = await userRepository.loginUser(data);
			return {
				uid: user.uid,
				email: user.email,
			};
		} catch (error) {
			console.log("Error code:", (error as FirebaseError).code);
			if (error instanceof FirebaseError) {
				console.log("FirebaseError detected:", error.code);
				switch (error.code) {
					case "auth/user-not-found":
					case "auth/wrong-password":
						return rejectWithValue(
							"メールアドレスまたはパスワードが正しくありません。",
						);
					case "auth/invalid-email":
						return rejectWithValue("無効なメールアドレス形式です。");
					default:
						return rejectWithValue(
							`認証に失敗しました。もう一度お試しください。(${error.code})`,
						);
				}
			} else {
				console.error("Unexpected error type:", error);
			}
			return rejectWithValue("予期せぬエラーが発生しました。");
		}
	},
);