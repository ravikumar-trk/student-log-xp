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

export type NotificationType = "success" | "error" | "warning" | "info";

export type NotificationPayload = {
  id?: string;
  type: NotificationType;
  message: string;
  title?: string;
  timeout?: number;
};

export type AppNotification = Omit<NotificationPayload, "id"> & {
  id: string;
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
  notifications: AppNotification[];
};

const initialState: CommonState = {
  userLoginInfo: IUserLoginInfo,
  loading: false,
  notifications: [],
};

const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    setUserLoginInfo(state, action: PayloadAction<UserLoginInfo | null>) {
      state.userLoginInfo = action.payload ?? IUserLoginInfo;
    },
    clearUserLoginInfo(state) {
      state.userLoginInfo = IUserLoginInfo;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    showNotification(state, action: PayloadAction<NotificationPayload>) {
      const { id, ...notification } = action.payload;
      state.notifications.push({
        ...notification,
        id: id ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      });
    },
    dismissNotification(state, action: PayloadAction<string>) {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload,
      );
    },
  },
});

export const {
  setUserLoginInfo,
  clearUserLoginInfo,
  setLoading,
  showNotification,
  dismissNotification,
} = commonSlice.actions;

export const showSuccess = (
  message: string,
  title?: string,
  timeout?: number,
) => showNotification({ type: "success", message, title, timeout });

export const showError = (message: string, title?: string, timeout?: number) =>
  showNotification({ type: "error", message, title, timeout });

export const showWarning = (
  message: string,
  title?: string,
  timeout?: number,
) => showNotification({ type: "warning", message, title, timeout });

export const showInfo = (message: string, title?: string, timeout?: number) =>
  showNotification({ type: "info", message, title, timeout });

export default commonSlice.reducer;
