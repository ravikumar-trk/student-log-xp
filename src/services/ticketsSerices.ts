import axiosClient from "./axiosClient";
import { POST_CREATE_TICKET } from "./constants";

const ticketsSerices = {
  async uploadExcel(formData: FormData): Promise<any> {
    const response = await axiosClient.post(POST_CREATE_TICKET, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  },
};

export default ticketsSerices;
