export type GateStatus = "INSIDE" | "OUTSIDE" | "NOT_ENTERED" | "UNKNOWN";

export interface StudentGateSwipeResult {
  Success: boolean;
  Code: string;
  Message: string;
  GateEventID?: number | null;
  StudentID?: number | null;
  StudentName?: string | null;
  EventType?: "IN" | "OUT" | null;
  CurrentStatus?: GateStatus | string | null;
}

export interface StudentGateDashboardRow {
  StudentID: number;
  AdmissionNo: string;
  StudentName: string;
  ClassID: number;
  SectionID?: number | null;
  FirstInTime?: string | null;
  LastOutTime?: string | null;
  TotalPresenceMinutes: number;
  NumberOfEntries: number;
  NumberOfExits: number;
  CurrentStatus: GateStatus | string;
  LastEventType?: "IN" | "OUT" | null;
  LastSwipeTime?: string | null;
  LastGate?: string | null;
}

export interface StudentGateDashboardSummary {
  TotalRows: number;
  CurrentlyInside: number;
  CurrentlyOutside: number;
  NotYetEntered: number;
  LateArrivals: number;
  EarlyExits: number;
}

export interface StudentGateLiveEvent {
  GateEventID: number;
  StudentID: number;
  StudentName: string;
  AdmissionNo: string;
  EventType: "IN" | "OUT";
  DeviceEventTime: string;
  ServerReceivedTime: string;
  IsValid: boolean;
  ValidationCode?: string | null;
  GateName?: string | null;
}

export interface StudentGateHistoryEvent {
  GateEventID: number;
  EventType: "IN" | "OUT";
  EventDate: string;
  DeviceEventTime: string;
  ServerReceivedTime: string;
  IsValid: boolean;
  ValidationCode?: string | null;
  GateName?: string | null;
}

export interface StudentGateDailySummary {
  AttendanceDate: string;
  FirstInTime?: string | null;
  LastOutTime?: string | null;
  TotalPresenceMinutes: number;
  NumberOfEntries: number;
  NumberOfExits: number;
  CurrentStatus: string;
  IsPresent: boolean;
}
