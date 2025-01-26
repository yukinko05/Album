import { userRepository } from "@/repositories/userRepository";
import type { UserInput, User } from "@/types/userTypes";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { FirebaseError } from "firebase/app";

export const signUpUser = createAsyncThunk<
  User,
  UserInput,
  { rejectValue: string }
>("users/signUpUser", async (userInputData: UserInput, { rejectWithValue }) => {
  try {
    const newUser = await userRepository.signUpUser(userInputData);

    return {
      uid: newUser.uid,
      email: newUser.email,
      userName: newUser.userName,
      iconImg: newUser.iconImg,
      createdAt: newUser.createdAt,
    };
  } catch (error) {
    if (error instanceof FirebaseError) {
      switch (error.code) {
        case "auth/email-already-in-use":
          return rejectWithValue("このメールアドレスは既に使用されています。");
        case "auth/invalid-email":
          return rejectWithValue("無効なメールアドレスです。");
        default:
          return rejectWithValue("新規登録に失敗しました。");
      }
    }
    return rejectWithValue("新規登録に失敗しました。");
  }
});

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
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/user-not-found":
          case "auth/wrong-password":
            return rejectWithValue(
              "メールアドレスまたはパスワードが正しくありません。"
            );
          case "auth/invalid-email":
            return rejectWithValue("無効なメールアドレス形式です。");
          default:
            return rejectWithValue(
              "認証に失敗しました。もう一度お試しください。"
            );
        }
      } else {
        console.error("Unexpected error type:", error);
      }
      return rejectWithValue("予期せぬエラーが発生しました。");
    }
  }
);
