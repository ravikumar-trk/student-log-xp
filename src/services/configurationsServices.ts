import axiosClient from "./axiosClient";

const configurationsServices = {
  async getSubjects(accountID: number, includeInactive = false) {
    return axiosClient.get(
      `/configurations/subjects?accountID=${accountID}&includeInactive=${includeInactive}`,
    );
  },
  async getSubjectsBySchool(schoolID: number, includeInactive = false) {
    return axiosClient.get(
      `/configurations/subjects?schoolID=${schoolID}&includeInactive=${includeInactive}`,
    );
  },
  async saveSubject(payload: unknown) {
    return axiosClient.post("/configurations/subjects", payload);
  },
  async deactivateSubject(subjectID: number) {
    return axiosClient.delete(`/configurations/subjects/${subjectID}`);
  },
};

export default configurationsServices;
