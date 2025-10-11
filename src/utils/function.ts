/**
 * Format a date to `dd-MMM-yyyy hh:mm:ss a` (e.g. `05-Oct-2025 03:04:05 PM`).
 *
 * Accepts a Date object, timestamp (number), or ISO/parsable date string.
 * Returns an empty string for invalid or missing inputs.
 */
import moment from "moment";

export const formatDateTime = (
  input?: Date | string | number | null
): string => {
  if (input === null || input === undefined || input === "") return "";

  const m = moment(input);
  if (!m.isValid()) return "";

  return m.format("DD-MMM-YYYY hh:mm:ss a");
};
