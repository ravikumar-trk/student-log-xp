import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "../features/theme/themeSlice";
import commonReducer from "../features/common/commonSlice";
import dataReducer from "../features/dataSlice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    common: commonReducer,
    data: dataReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
