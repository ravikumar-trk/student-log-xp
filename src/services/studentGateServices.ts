import axiosClient from "./axiosClient";
import {
  STUDENT_GATE_DASHBOARD,
  STUDENT_GATE_HISTORY,
  STUDENT_GATE_LIVE_EVENTS,
  STUDENT_GATE_MANUAL_SWIPE,
} from "./constants";

const studentGateServices = {
  async getDashboard(payload: unknown) {
    return axiosClient.post(STUDENT_GATE_DASHBOARD, payload);
  },
  async getLiveEvents(schoolID: number, since?: string) {
    const query = new URLSearchParams({
      schoolID: String(schoolID),
      pageSize: "50",
    });
    if (since) query.set("since", since);
    return axiosClient.get(`${STUDENT_GATE_LIVE_EVENTS}?${query.toString()}`);
  },
  async getHistory(
    studentID: number,
    schoolID: number,
    fromDate: string,
    toDate: string,
  ) {
    const url = STUDENT_GATE_HISTORY.replace("{studentId}", String(studentID));
    return axiosClient.get(
      `${url}?schoolID=${schoolID}&fromDate=${fromDate}&toDate=${toDate}`,
    );
  },
  async recordManualSwipe(payload: unknown) {
    return axiosClient.post(STUDENT_GATE_MANUAL_SWIPE, payload);
  },
};

export default studentGateServices;
