import axiosClient from "./axiosClient";
import { LOGIN_API } from "./constants";

const authServices = {
  async login(credentials: any): Promise<any> {
    const response = await axiosClient.post(LOGIN_API, credentials);
    return response;
  },
};
export default authServices;
