import axiosClient from "./axiosClient";
import {
  GET_ACCOUNT_DETAILS,
  GET_SCHOOLS_BY_ACCOUNT_ID,
  GET_CLASSES_BY_SCHOOL_ID,
  POST_UPSERT_CLASSES,
  GET_USERS_BY_ACCOUNT_ID,
} from "./constants";

const masterServices = {
  // Get account details
  async getAccountDetails(accountID: number): Promise<any> {
    const url = GET_ACCOUNT_DETAILS.replace(
      "{accountId}",
      accountID.toString(),
    );
    const response = await axiosClient.get(url);
    return response;
  },

  // Get user by ID
  async getUser(id: number): Promise<any> {
    const response = await axiosClient.get(`/users/${id}`);
    return response;
  },

  async getSchoolsByAccountID(accountID: number): Promise<any> {
    const url = GET_SCHOOLS_BY_ACCOUNT_ID.replace(
      "{accountId}",
      accountID.toString(),
    );
    const response = await axiosClient.get(url);
    return response;
  },

  async getUsersByAccountID(accountID: number): Promise<any> {
    const url = GET_USERS_BY_ACCOUNT_ID.replace(
      "{accountId}",
      accountID.toString(),
    );
    const response = await axiosClient.get(url);
    return response;
  },

  async getClassesBySchoolID(
    accountID: number,
    schoolID: number,
  ): Promise<any> {
    const url = GET_CLASSES_BY_SCHOOL_ID.replace(
      "{accountId}",
      accountID.toString(),
    ).replace("{schoolId}", schoolID.toString());
    const response = await axiosClient.get(url);
    return response;
  },

  async upsertClasses(payload: any): Promise<any> {
    const response = await axiosClient.post(POST_UPSERT_CLASSES, payload);
    return response;
  },
};

export default masterServices;
