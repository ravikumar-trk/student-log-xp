import React from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CheckIcon from "@mui/icons-material/Check";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

export const baseStyle: React.CSSProperties = {
  borderRadius: "6px",
  fontWeight: "bold",
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  minWidth: "80px",
  textAlign: "center",
  fontSize: "0.9rem",
};

export const iconStyle: React.CSSProperties = {
  width: 14,
  height: 14,
};

export const textChipStyles: Record<string, React.CSSProperties> = {
  critical: { color: "#c62828", fontSize: "16px" },
  high: { color: "#ef6c00", fontSize: "16px" },
  medium: { color: "#f9a825", fontSize: "16px" },
  low: { color: "#2e7d32", fontSize: "16px" },
  lite: { color: "#05668d" },
  silver: { color: "#6c6f73" },
  gold: { color: "#a67c00" },
  platinum: { color: "#23324a" },
};

export const statusChipStyles = {
  Active: {
    style: { backgroundColor: "#d4f7e6", color: "#0b6b2f", padding: "4px 8px" },
    Icon: CheckIcon,
  },
  Open: {
    style: { backgroundColor: "#e7f3ff", color: "#0b5fc6", padding: "4px 8px" },
    Icon: AccessTimeIcon,
  },
  Inactive: {
    style: { backgroundColor: "#f1f3f5", color: "#6b7177", padding: "4px 8px" },
    Icon: FiberManualRecordIcon,
  },
  Resolved: {
    style: { backgroundColor: "#eef6fb", color: "#0f5b66", padding: "4px 8px" },
    Icon: CheckCircleOutlineIcon,
  },
  Reviewed: {
    style: { backgroundColor: "#d1ecf1", color: "#0c5460", padding: "4px 8px" },
    Icon: CheckCircleOutlineIcon,
  },
  Approved: {
    style: { backgroundColor: "#d4edda", color: "#155724", padding: "4px 8px" },
    Icon: CheckCircleOutlineIcon,
  },
  Completed: {
    style: { backgroundColor: "#c3e6cb", color: "#155724", padding: "4px 8px" },
    Icon: CheckCircleOutlineIcon,
  },
  "In Progress": {
    style: { backgroundColor: "#fff3cd", color: "#856404", padding: "4px 8px" },
    Icon: AccessTimeIcon,
  },
  New: {
    style: { backgroundColor: "#cce5ff", color: "#004085", padding: "4px 8px" },
    Icon: AccessTimeIcon,
  },
};
