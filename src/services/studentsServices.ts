import type { GetStudentModel } from "../models/StudentModel";
import axiosClient from "./axiosClient";
import { GET_STUDENTS_LIST, UPSERT_STUDENTS_LIST } from "./constants";

const studentServices = {
  async getStudentsList(payload: GetStudentModel): Promise<any> {
    // Use GET and pass payload as query params to match other GET-style services
    const url = `${GET_STUDENTS_LIST}/?Prefix=${payload.Prefix}&StudentID=${payload.StudentID}&ClassID=${payload.ClassID}&SchoolID=${payload.SchoolID}&AccountID=${payload.AccountID}&IsDropdown=${payload.IsDropdown}&LoginUserID=${payload.LoginUserID}`;
    const response = await axiosClient.get(url);
    return response;
  },
  async postStudentsBulk(payload: unknown): Promise<any> {
    const response = await axiosClient.post(UPSERT_STUDENTS_LIST, payload);
    return response;
  },
};

export default studentServices;
