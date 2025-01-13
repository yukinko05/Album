import { createAsyncThunk } from "@reduxjs/toolkit";
import { userRepository } from "@/repositories/userRepository";
import { UserInput } from "@/types/type";

export const signUpUser = createAsyncThunk(
	"users/signUpUser",
	async (data: UserInput, { rejectWithValue }) => {
		try {
			const newUser = await userRepository.signUpUser(data);
			return newUser;
		} catch (error) {
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
			return rejectWithValue("ログインに失敗しました。");
		}
	},
);
