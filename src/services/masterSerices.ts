import axiosClient from "./axiosClient";
import {
  GET_ACCOUNT_DETAILS,
  GET_SCHOOLS_BY_ACCOUNT_ID,
  GET_CLASSES_BY_SCHOOL_ID,
  POST_UPSERT_CLASSES,
  GET_USERS_BY_ACCOUNT_ID,
  POST_INSERT_SCHOOL,
  PATCH_UPDATE_SCHOOL,
  POST_INSERT_USER,
  PATCH_UPDATE_USER,
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

  async getSchoolsByAccountID(
    accountID: number,
    isActive: number = 1,
  ): Promise<any> {
    const url = GET_SCHOOLS_BY_ACCOUNT_ID.replace(
      "{accountId}",
      accountID.toString(),
    );
    const response = await axiosClient.get(`${url}?isActive=${isActive}`);
    return response;
  },

  async getUsersByAccountID(
    accountID: number,
    isActive: number = 1,
  ): Promise<any> {
    const url = GET_USERS_BY_ACCOUNT_ID.replace(
      "{accountId}",
      accountID.toString(),
    );
    const response = await axiosClient.get(`${url}?isActive=${isActive}`);
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

  async addSchool(payload: any): Promise<any> {
    const response = await axiosClient.post(POST_INSERT_SCHOOL, payload);
    return response;
  },

  async updateSchool(payload: any): Promise<any> {
    const response = await axiosClient.patch(PATCH_UPDATE_SCHOOL, payload);
    return response;
  },

  async addUser(payload: any): Promise<any> {
    const response = await axiosClient.post(POST_INSERT_USER, payload);
    return response;
  },

  async updateUser(payload: any): Promise<any> {
    const response = await axiosClient.patch(PATCH_UPDATE_USER, payload);
    return response;
  },
};

export default masterServices;
