import { jwtDecode } from "jwt-decode";

export interface JwtPayload {
  UserID: number;
  UserName: string;
  AccountID: number;
  AccountCode: string;
  SchoolIDs: string;
  SchoolNames: string;
}

export const getCurrentUser = (): JwtPayload | null => {
  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  try {
    const decodedToken = jwtDecode<any>(token);
    const userData: JwtPayload = {
      UserID: parseInt(decodedToken.UserID),
      UserName: decodedToken.UserName,
      AccountID: parseInt(decodedToken.AccountID),
      AccountCode: decodedToken.AccountCode,
      SchoolIDs: decodedToken.SchoolIDs,
      SchoolNames: decodedToken.SchoolNames,
    };
    return userData;
  } catch {
    return null;
  }
};
