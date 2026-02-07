import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { StudentModel } from "../models/StudentModel";

const students: StudentModel[] = [
  {
    AccountID: 0,
    SchoolID: 0,
    SchoolName: "",
    SchoolCode: "",
    ClassID: 0,
    ClassCode: "",
    AdmissionNo: "",
    RollNo: "",
    StudentID: 0,
    StudentName: "",
  },
] as StudentModel[];

type StoreStudentModel = {
  students: StudentModel[];
};
const initialState: StoreStudentModel = {
  students: students,
};

const dataSlice = createSlice({
  name: "data",
  initialState: initialState,
  reducers: {
    setStudentsStoreData(state, action: PayloadAction<StudentModel[] | null>) {
      state.students = action.payload ?? [];
    },
  },
});

export const { setStudentsStoreData } = dataSlice.actions;
export default dataSlice.reducer;
