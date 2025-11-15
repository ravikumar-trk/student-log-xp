import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type UserLoginInfo = {
  id?: string;
  name?: string;
  email?: string;
  token?: string;
  [key: string]: any;
};

type CommonState = {
  userLoginInfo: UserLoginInfo | null;
  loading: boolean;
};

const initialState: CommonState = {
  userLoginInfo: null,
  loading: false,
};

const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    setUserLoginInfo(state, action: PayloadAction<UserLoginInfo | null>) {
      state.userLoginInfo = action.payload;
    },
    clearUserLoginInfo(state) {
      state.userLoginInfo = null;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { setUserLoginInfo, clearUserLoginInfo, setLoading } =
  commonSlice.actions;
export default commonSlice.reducer;
