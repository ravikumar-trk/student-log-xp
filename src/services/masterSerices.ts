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
    const response = await axiosClient.get(
      `${GET_ACCOUNT_DETAILS}/${accountID}`
    );
    return response;
  },

  // Get user by ID
  async getUser(id: number): Promise<any> {
    const response = await axiosClient.get(`/users/${id}`);
    return response;
  },

  async getSchoolsByAccountID(accountID: number): Promise<any> {
    const response = await axiosClient.get(
      `${GET_SCHOOLS_BY_ACCOUNT_ID}/${accountID}`
    );
    return response;
  },

  async getUsersByAccountID(accountID: number): Promise<any> {
    const response = await axiosClient.get(
      `${GET_USERS_BY_ACCOUNT_ID}/${accountID}`
    );
    return response;
  },

  async getClassesBySchoolID(
    accountID: number,
    schoolID: number
  ): Promise<any> {
    const response = await axiosClient.get(
      `${GET_CLASSES_BY_SCHOOL_ID}?AccountID=${accountID}&SchoolID=${schoolID}`
    );
    return response;
  },

  async upsertClasses(payload: any): Promise<any> {
    const response = await axiosClient.post(POST_UPSERT_CLASSES, payload);
    return response;
  },
};

export default masterServices;
