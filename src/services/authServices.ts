import axiosClient from "./axiosClient";

export const getUsers = () => {
  return axiosClient.get("/users");
};

export const createUser = (payload: any) => {
  return axiosClient.post("/users", payload);
};
