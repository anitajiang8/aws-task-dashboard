/**
 * Derived statistics for the Insights page.
 *
 * Everything here is a pure function of the task list — no dates are read
 * from the clock except through the injected `today` argument, so these
 * are straightforward to test.
 */

import { PRIORITIES } from "./constants";
import { addDays, startOfDay, toIsoDate, todayIsoDate } from "./dates";
import { isDone } from "./tasks";

/** The local ISO day a task was completed on, or null. */
export function completedOn(task) {
  if (!task.completedAt) return null;
  return toIsoDate(new Date(task.completedAt));
}

/**
 * Completions per day for the last `days` days, oldest first.
 * Always returns exactly `days` entries so the chart keeps a stable
 * x-axis even when nothing was completed.
 */
export function completionsByDay(tasks, days = 30, today = new Date()) {
  const counts = new Map();

  tasks.filter(isDone).forEach((task) => {
    const iso = completedOn(task);
    if (!iso) return;
    const entry = counts.get(iso) || { count: 0, xp: 0 };
    entry.count += 1;
    entry.xp += task.rewardXp || 0;
    counts.set(iso, entry);
  });

  const end = startOfDay(today);

  return Array.from({ length: days }, (_, index) => {
    const iso = toIsoDate(addDays(end, index - days + 1));
    const entry = counts.get(iso) || { count: 0, xp: 0 };
    return { iso, count: entry.count, xp: entry.xp };
  });
}

/**
 * Current and longest run of consecutive days with at least one
 * completion. The current streak still counts if nothing is done yet
 * today — the day is not over.
 */
export function computeStreak(tasks, today = todayIsoDate()) {
  const days = new Set(
    tasks.filter(isDone).map(completedOn).filter(Boolean)
  );

  if (days.size === 0) return { current: 0, longest: 0 };

  const sorted = Array.from(days).sort();

  let longest = 1;
  let run = 1;
  for (let i = 1; i < sorted.length; i += 1) {
    const prev = new Date(`${sorted[i - 1]}T00:00:00`);
    const curr = new Date(`${sorted[i]}T00:00:00`);
    const gapDays = Math.round((curr - prev) / 86400000);

    run = gapDays === 1 ? run + 1 : 1;
    longest = Math.max(longest, run);
  }

  // Walk backwards from today; allow today itself to be empty.
  let current = 0;
  let cursor = new Date(`${today}T00:00:00`);
  if (!days.has(toIsoDate(cursor))) {
    cursor = addDays(cursor, -1);
  }
  while (days.has(toIsoDate(cursor))) {
    current += 1;
    cursor = addDays(cursor, -1);
  }

  return { current, longest };
}

/**
 * How often finished work landed on or before its due date.
 * Tasks with no due date can be neither on time nor late, so they are
 * counted separately and excluded from the rate.
 */
export function onTimeStats(tasks) {
  let onTime = 0;
  let late = 0;
  let undated = 0;

  tasks.filter(isDone).forEach((task) => {
    const finished = completedOn(task);
    if (!task.dueDate || !finished) {
      undated += 1;
      return;
    }
    if (finished <= task.dueDate) onTime += 1;
    else late += 1;
  });

  const scored = onTime + late;

  return {
    onTime,
    late,
    undated,
    scored,
    rate: scored === 0 ? null : Math.round((onTime / scored) * 100),
  };
}

/** Active vs completed counts for each priority. */
export function byPriority(tasks) {
  return PRIORITIES.map((priority) => {
    const matching = tasks.filter(
      (task) => (task.priority || "medium") === priority
    );
    const done = matching.filter(isDone).length;

    return {
      priority,
      done,
      active: matching.length - done,
      total: matching.length,
    };
  });
}

/** Top categories by volume. Uncategorised tasks are grouped together. */
export function byCategory(tasks, limit = 5) {
  const groups = new Map();

  tasks.forEach((task) => {
    const name = (task.category || "").trim() || "Uncategorised";
    const entry = groups.get(name) || { name, total: 0, done: 0 };
    entry.total += 1;
    if (isDone(task)) entry.done += 1;
    groups.set(name, entry);
  });

  return Array.from(groups.values())
    .map((entry) => ({
      ...entry,
      rate: entry.total === 0 ? 0 : Math.round((entry.done / entry.total) * 100),
    }))
    .sort((a, b) => b.total - a.total || a.name.localeCompare(b.name))
    .slice(0, limit);
}

/** Total XP actually banked from completed work. */
export function totalXpEarned(tasks) {
  return tasks
    .filter((task) => isDone(task) && task.rewardClaimed)
    .reduce((sum, task) => sum + (task.rewardXp || 0), 0);
}
