import axiosClient from "./axiosClient";
import { POST_UPLOAD_EXCEL } from "./constants";

const ticketsSerices = {
  async uploadExcel(formData: FormData): Promise<any> {
    const response = await axiosClient.post(POST_UPLOAD_EXCEL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  },
};

export default ticketsSerices;
