import crownIcon from "../assets/crown.svg";
import hatIcon from "../assets/hat.svg";
import sunglassesIcon from "../assets/sunglasses.svg";

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

export const ACCESSORIES = [
  {
    id: "none",
    name: "Nothing Equipped",
    image: null,
    iconClass: "accessory-icon-none",
    unlockLevel: 1,
    treatCost: 0,
  },
  {
    id: "bow",
    name: "Pink Bow",
    image: null,
    iconClass: "accessory-icon-bow",
    unlockLevel: 1,
    treatCost: 15,
  },
  {
    id: "star-collar",
    name: "Star Collar",
    image: null,
    iconClass: "accessory-icon-collar",
    unlockLevel: 1,
    treatCost: 15,
  },
  {
    id: "cloud-cushion",
    name: "Cloud Cushion",
    image: null,
    iconClass: "accessory-icon-cushion",
    unlockLevel: 1,
    treatCost: 20,
  },
  {
    id: "sparkles",
    name: "Room Sparkles",
    image: null,
    iconClass: "accessory-icon-sparkles",
    unlockLevel: 1,
    treatCost: 20,
  },
  {
    id: "hat",
    name: "Cozy Hat",
    image: hatIcon,
    iconClass: null,
    unlockLevel: 1,
    treatCost: 25,
  },
  {
    id: "sunglasses",
    name: "Focus Sunglasses",
    image: sunglassesIcon,
    iconClass: null,
    unlockLevel: 2,
    treatCost: 35,
  },
  {
    id: "crown",
    name: "Productivity Crown",
    image: crownIcon,
    iconClass: null,
    unlockLevel: 3,
    treatCost: 50,
  },
];

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
