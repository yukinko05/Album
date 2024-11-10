import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types/type";

const initialState: User = {
	email: "",
	password: "",
};

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setData: (
			state,
			action: PayloadAction<{ email: string | null; password: string }>,
		) => {
			state.email = action.payload.email;
			state.password = action.payload.password;
		},
	},
});

export const { setData } = userSlice.actions;
export default userSlice.reducer;
