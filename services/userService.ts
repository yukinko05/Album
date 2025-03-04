import { userRepository } from "@/repositories/userRepository";
import type { User, NewUserInput, LoginUserInput } from "@/types/userTypes";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { FirebaseError } from "firebase/app";

export const signUpUser = createAsyncThunk<
	User,
	NewUserInput,
	{ rejectValue: string }
>(
	"users/signUpUser",
	async (userInputData: NewUserInput, { rejectWithValue }) => {
		try {
			const newUser = await userRepository.signUpUser(userInputData);

			return {
				userId: newUser.uid,
				email: newUser.email,
				userName: newUser.userName,
				iconImg: newUser.iconImg,
				createdAt: newUser.createdAt,
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
	async (data: LoginUserInput, { rejectWithValue }) => {
		try {
			const user = await userRepository.loginUser(data);
			return {
				uid: user.uid,
				email: user.email as string,
			};
		} catch (error) {
			if (error instanceof FirebaseError) {
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
							"認証に失敗しました。もう一度お試しください。",
						);
				}
			} else {
				console.error("Unexpected error type:", error);
			}
			return rejectWithValue("予期せぬエラーが発生しました。");
		}
	},
);

export const getUser = createAsyncThunk<User, string>(
	"users/getUser",
	async (userId, { rejectWithValue }) => {
		try {
			const user: User = await userRepository.fetchUser(userId);
			return {
				userId: user.userId,
				email: user.email,
				userName: user.userName,
				iconImg: user.iconImg,
				createdAt: user.createdAt,
			};
		} catch (error) {
			if (error instanceof Error) {
				console.error("ユーザー情報の取得に失敗:", error);
				return rejectWithValue(
					`ユーザー情報の取得に失敗しました: ${error.message}`,
				);
			}
			console.error("予期せぬエラーが発生:", error);
			return rejectWithValue(
				"ユーザー情報の取得中に予期せぬエラーが発生しました",
			);
		}
	},
);
