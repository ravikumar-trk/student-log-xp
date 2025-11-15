interface AccountModel {
  ID: number;
  AccountID: string;
  AccountCode: string;
  AccountName: string;
  PlanCode: string;
  Email: string;
  Schools: number;
  Users: number;
  CreatedBy: string;
  CreatedOn: string;
  Status: string;
  IsActive: boolean;
}

export type { AccountModel };
