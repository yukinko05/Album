import { loginUser, signUpUser } from "@/services/userService";
import type { User, LoginUser } from "@/types/userTypes";
import { createSlice } from "@reduxjs/toolkit";
interface UserState {
	data: User | LoginUser | null;
	status: "idle" | "loading" | "succeeded" | "failed";
	error: unknown | null;
}

const initialState: UserState = {
	data: null,
	status: "idle",
	error: null,
};

export const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(loginUser.pending, (state) => {
				state.status = "loading";
				state.error = null;
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.data = action.payload;
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload;
			})
			.addCase(signUpUser.pending, (state) => {
				state.status = "loading";
				state.error = null;
			})
			.addCase(signUpUser.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.data = action.payload;
			})
			.addCase(signUpUser.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload;
			});
	},
});

export default userSlice.reducer;
