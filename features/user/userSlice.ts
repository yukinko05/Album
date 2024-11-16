import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types/type";

const initialState: { user: User } = {
  user: {
    email: "",
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<User>) => {
      state.user.email = action.payload.email;
    },
  },
});

export const { setData } = userSlice.actions;
export default userSlice.reducer;
