interface UserModel {
  UserID: number;
  UserName: string;
  AccountID: number;
  AccountCode: string;
  AccountName: string;
  UserTypeID: number;
  UserType: string;
  Email: string;
  Password: string;
  Mobile: string;
  SchoolIDs: string;
  SchoolNames: string;
  CreatedBy: string;
  CreatedOn: string;
  UpdatedBy: string;
  UpdatedOn: string;
  IsActive: number;
  Status: string;
}

export type { UserModel };
