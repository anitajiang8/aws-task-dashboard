import {
  PRIORITY_ORDER,
  PRIORITY_REWARDS,
  XP_PER_LEVEL,
} from "./constants";
import { todayIsoDate } from "./dates";

/** XP a task is worth, falling back to medium for unknown priorities. */
export function getTaskRewardXp(priority) {
  return PRIORITY_REWARDS[priority] || PRIORITY_REWARDS.medium;
}

/** Mochi's level from her lifetime XP. Levels start at 1. */
export function getCatLevel(totalXp) {
  return Math.floor((totalXp || 0) / XP_PER_LEVEL) + 1;
}

/** Undated tasks sort last; otherwise soonest first. */
export function compareByDueDate(taskA, taskB) {
  if (!taskA.dueDate && !taskB.dueDate) return 0;
  if (!taskA.dueDate) return 1;
  if (!taskB.dueDate) return -1;
  return new Date(taskA.dueDate) - new Date(taskB.dueDate);
}

/**
 * Fill in any field the server may not have sent. Runs on every task
 * loaded from the API so the rest of the app can assume a full shape.
 */
export function normaliseTask(task) {
  const priority = task.priority || "medium";
  const status = task.status === "done" ? "done" : "todo";

  return {
    id: task.id || Date.now(),
    title: task.title || "Untitled task",
    status,
    priority,
    dueDate: task.dueDate || null,
    category: task.category || "",
    createdAt: task.createdAt || new Date().toISOString(),
    completedAt:
      task.completedAt || (status === "done" ? new Date().toISOString() : null),
    rewardXp: task.rewardXp || getTaskRewardXp(priority),
    rewardClaimed: Boolean(task.rewardClaimed),
  };
}

export const isActive = (task) => task.status !== "done";
export const isDone = (task) => task.status === "done";

/** An active task whose due date has already passed. */
export function isOverdue(task, today = todayIsoDate()) {
  return isActive(task) && Boolean(task.dueDate) && task.dueDate < today;
}

/** Priority filter used by the tasks page. `"all"` passes everything. */
export function filterByPriority(tasks, priority) {
  if (priority === "all") return tasks;
  return tasks.filter((task) => task.priority === priority);
}

/** Free-text match across title and category. */
export function searchTasks(tasks, query) {
  const needle = query.trim().toLowerCase();
  if (!needle) return tasks;
  return tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(needle) ||
      (task.category || "").toLowerCase().includes(needle)
  );
}

const SORTERS = {
  newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  oldest: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
  "priority-high": (a, b) =>
    PRIORITY_ORDER[b.priority || "medium"] -
    PRIORITY_ORDER[a.priority || "medium"],
  "priority-low": (a, b) =>
    PRIORITY_ORDER[a.priority || "medium"] -
    PRIORITY_ORDER[b.priority || "medium"],
  "title-az": (a, b) => a.title.localeCompare(b.title),
  "due-date": compareByDueDate,
};

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "priority-high", label: "Priority: high to low" },
  { value: "priority-low", label: "Priority: low to high" },
  { value: "title-az", label: "Title A–Z" },
  { value: "due-date", label: "Due date" },
];

export function sortTasks(tasks, sortOption) {
  const sorter = SORTERS[sortOption];
  return sorter ? [...tasks].sort(sorter) : tasks;
}

/** Completed tasks, most recently finished first. */
export function completedHistory(tasks) {
  return tasks
    .filter(isDone)
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
}

/** The soonest-due active tasks, for the home page preview. */
export function nextUpTasks(tasks, limit = 3) {
  return tasks.filter(isActive).sort(compareByDueDate).slice(0, limit);
}
