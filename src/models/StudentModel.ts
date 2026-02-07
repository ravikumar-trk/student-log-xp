interface GetStudentModel {
  Prefix: string;
  StudentID: number;
  ClassID: number;
  SchoolID: number;
  AccountID: number;
  IsDropdown: boolean;
  LoginUserID: number;
}

interface StudentModel {
  AccountID: number;
  SchoolID: number;
  SchoolName: string;
  SchoolCode: string;
  ClassID: number;
  ClassCode: string;
  AdmissionNo: string;
  RollNo: string;
  StudentID: number;
  StudentName: string;
  IsActive: boolean;
}

export type { GetStudentModel, StudentModel };
