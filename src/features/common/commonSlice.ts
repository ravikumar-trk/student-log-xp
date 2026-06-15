import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type UserLoginInfo = {
  AccountCode: string;
  AccountID: number;
  SchoolIDs: string;
  SchoolNames: string;
  UserID: number;
  UserName: string;
};

const IUserLoginInfo: UserLoginInfo = {
  AccountCode: "",
  AccountID: 0,
  SchoolIDs: "",
  SchoolNames: "",
  UserID: 0,
  UserName: "",
};

type CommonState = {
  userLoginInfo: UserLoginInfo;
  loading: boolean;
};

const initialState: CommonState = {
  userLoginInfo: IUserLoginInfo,
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
