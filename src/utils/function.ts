/**
 * Format a date to `dd-MMM-yyyy hh:mm:ss a` (e.g. `05-Oct-2025 03:04:05 PM`).
 *
 * Accepts a Date object, timestamp (number), or ISO/parsable date string.
 * Returns an empty string for invalid or missing inputs.
 */
import moment from "moment";

export const formatDateTime = (
  input?: Date | string | number | null,
): string => {
  if (input === null || input === undefined || input === "") return "";

  const m = moment(input);
  if (!m.isValid()) return "";

  return m.format("DD-MMM-YYYY hh:mm:ss a");
};

export const fileNameWithTimestamp = (
  prefix: string,
  extension: string,
): string => {
  const now = new Date();
  const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}_${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}`;
  return `${prefix}_${timestamp}.${extension}`;
};
