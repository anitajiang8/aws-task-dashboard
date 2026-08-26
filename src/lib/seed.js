/**
 * Deterministic sample data for local development.
 *
 * Enabled with VITE_USE_MOCK=true, which makes src/api.js resolve from
 * memory and skip the network entirely — so building and screenshotting
 * the charts costs nothing on AWS and never touches real data.
 */

import { PRIORITY_REWARDS, getTreatReward } from "./constants";
import { addDays, toIsoDate } from "./dates";

const CATEGORIES = ["Coursework", "Job hunt", "Health", "Side project", "Admin"];
const TITLES = [
  "Review lecture notes", "Submit assignment", "Morning run", "Refactor the API layer",
  "Reply to recruiter", "Grocery run", "Read one paper", "Fix the failing test",
  "Update resume", "Plan next sprint", "Stretch session", "Write project README",
  "Book dentist", "Practice algorithms", "Clear inbox", "Design review",
];

/** Small deterministic PRNG so the sample set is identical every run. */
function mulberry32(seed) {
  return function random() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateSeedState(taskCount = 120, seed = 42) {
  const random = mulberry32(seed);
  const pick = (list) => list[Math.floor(random() * list.length)];
  const today = new Date();

  const tasks = [];
  let totalXp = 0;
  let treats = 0;

  for (let i = 0; i < taskCount; i += 1) {
    // Cluster completions so the heatmap and trend have texture rather
    // than uniform noise — real usage is streaky.
    const daysAgo = Math.floor(random() * 84);
    const isDone = random() < 0.72 && daysAgo > 0;
    const priority = pick(["low", "medium", "medium", "high"]);
    const rewardXp = PRIORITY_REWARDS[priority];

    const createdAt = addDays(today, -daysAgo - Math.floor(random() * 5) - 1);
    const completedAt = isDone ? addDays(today, -daysAgo) : null;

    // Roughly three quarters of dated work lands on time.
    const hasDueDate = random() < 0.7;
    const dueOffset = isDone ? (random() < 0.75 ? 1 : -2) : Math.floor(random() * 14) - 3;
    const dueBase = completedAt || today;

    if (isDone) {
      totalXp += rewardXp;
      treats += getTreatReward(rewardXp);
    }

    tasks.push({
      id: 1000 + i,
      title: pick(TITLES),
      status: isDone ? "done" : "todo",
      priority,
      dueDate: hasDueDate ? toIsoDate(addDays(dueBase, dueOffset)) : null,
      category: random() < 0.8 ? pick(CATEGORIES) : "",
      createdAt: createdAt.toISOString(),
      completedAt: completedAt ? completedAt.toISOString() : null,
      rewardXp,
      rewardClaimed: isDone,
    });
  }

  return {
    tasks,
    catProfile: {
      catName: "Mochi",
      totalXp,
      treats: Math.max(0, treats - 60),
      equippedAccessories: ["bow"],
      unlockedAccessoryIds: ["bow", "star-collar"],
    },
  };
}
