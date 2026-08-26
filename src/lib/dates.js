/**
 * Date helpers shared by the calendar and the insights charts.
 *
 * Every task date is stored as a plain `YYYY-MM-DD` string with no
 * time component, so these helpers deliberately work in local time and
 * compare by string where possible. Constructing `new Date("2026-08-26")`
 * parses as UTC midnight, which shifts a day backwards for anyone west
 * of Greenwich — `toIsoDate` avoids that by reading the local fields.
 */

export const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Local-time `YYYY-MM-DD` for a Date. */
export function toIsoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Today as `YYYY-MM-DD`. */
export function todayIsoDate() {
  return toIsoDate(new Date());
}

export function startOfDay(date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

export function startOfWeek(date) {
  const result = startOfDay(date);
  result.setDate(result.getDate() - result.getDay());
  return result;
}

export function addDays(date, amount) {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
}

export function addMonths(date, amount) {
  const result = new Date(date);
  result.setMonth(result.getMonth() + amount);
  return result;
}

/** The 42-cell grid a month view renders, starting on a Sunday. */
export function getMonthGridDays(referenceDate, length = 42) {
  const firstOfMonth = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    1
  );
  const gridStart = startOfWeek(firstOfMonth);
  return Array.from({ length }, (_, index) => addDays(gridStart, index));
}

export function getWeekDays(referenceDate) {
  const weekStart = startOfWeek(referenceDate);
  return Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
}

/** An ascending run of `count` ISO dates ending today. */
export function recentIsoDates(count) {
  const today = startOfDay(new Date());
  return Array.from({ length: count }, (_, index) =>
    toIsoDate(addDays(today, index - count + 1))
  );
}

/** "Aug 26" style label for an ISO date string. */
export function formatIsoDateShort(iso) {
  if (!iso) return "";
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}
