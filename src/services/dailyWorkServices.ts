import axiosClient from "./axiosClient";

const dailyWorkServices = {
  async assign(payload: unknown) {
    return axiosClient.post("/daily-work", payload);
  },
  async getTeacherWork(date?: string) {
    const query = date ? `?date=${date}` : "";
    return axiosClient.get(`/daily-work/teacher${query}`);
  },
  async getStudentWork(studentID: number, date: string) {
    return axiosClient.get(`/daily-work/student/${studentID}?date=${date}`);
  },
  async submit(payload: unknown) {
    return axiosClient.post("/daily-work/submissions", payload);
  },
  async getSubmissions(workID: number) {
    return axiosClient.get(`/daily-work/${workID}/submissions`);
  },
  async review(
    submissionID: number,
    payload: unknown,
    returnForCorrection = false,
  ) {
    return axiosClient.patch(
      `/daily-work/submissions/${submissionID}/${returnForCorrection ? "return" : "review"}`,
      payload,
    );
  },
};

export default dailyWorkServices;
