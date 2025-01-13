import { createSlice } from "@reduxjs/toolkit";
import { signUpUser, loginUser } from "@/services/userService";
import { User } from "@/types/type";
interface UserState {
	data: User | null;
	status: "idle" | "loading" | "succeeded" | "failed";
	error: unknown | null;
	uid: string | null;
}

const initialState: UserState = {
	data: null,
	status: "idle",
	error: null,
	uid: null,
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
			.addCase(signUpUser.fulfilled, (state, action) => {
				state.data = action.payload;
			});
	},
});

export default userSlice.reducer;
