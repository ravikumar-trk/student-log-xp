import React, { useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import theme from "./theme";

import Login from "./pages/auth/Login";
import MainLayout from "./common/mainLayout";
import ProtectedRoute from "./pages/auth/ProtectedRoute";
import { useAppDispatch, useAppSelector } from "./hooks/reduxHooks";
import { setUserLoginInfo } from "./features/common/commonSlice";
import { getCurrentUser } from "./pages/auth/decodeToken";

const App: React.FC = () => {

  const userLoginInfo = useAppSelector((state) => state.common.userLoginInfo);

  const dispatch = useAppDispatch();

  useEffect(() => {
    // Check if userLoginInfo is already in the store
    if (!userLoginInfo) {
      // If not, check localStorage for a token
      const token = localStorage.getItem("token");
      if (token) {
        dispatch(setUserLoginInfo(getCurrentUser()));
      }
    }
  }, [dispatch, userLoginInfo]);




  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <BrowserRouter>
        <Routes>

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          />

          <Route
            path="*"
            element={<Navigate to="/" />}
          />

        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;