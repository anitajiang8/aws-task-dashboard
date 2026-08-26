/** XP required to advance Mochi one level. */
export const XP_PER_LEVEL = 50;

/** XP awarded for completing a task, keyed by priority. */
export const PRIORITY_REWARDS = {
  low: 5,
  medium: 10,
  high: 15,
};

/** Sort weight for priority, low to high. */
export const PRIORITY_ORDER = {
  low: 1,
  medium: 2,
  high: 3,
};

export const PRIORITIES = ["low", "medium", "high"];

/** Treats awarded alongside XP. Kept in one place so the help panel,
 *  the task form, and the completion handler cannot disagree. */
export function getTreatReward(rewardXp) {
  return Math.max(1, Math.round(rewardXp / 5));
}

export const DEFAULT_CAT_PROFILE = {
  catName: "Mochi",
  totalXp: 0,
  treats: 0,
  equippedAccessories: [],
  unlockedAccessoryIds: [],
};

export const DEFAULT_TASKS = [
  {
    id: 1,
    title: "Plan a cosy study session",
    status: "todo",
    priority: "medium",
    dueDate: null,
    category: "Learning",
    createdAt: new Date().toISOString(),
    completedAt: null,
    rewardXp: 10,
    rewardClaimed: false,
  },
  {
    id: 2,
    title: "Finish one high-priority task",
    status: "todo",
    priority: "high",
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10),
    category: "",
    createdAt: new Date().toISOString(),
    completedAt: null,
    rewardXp: 15,
    rewardClaimed: false,
  },
];
