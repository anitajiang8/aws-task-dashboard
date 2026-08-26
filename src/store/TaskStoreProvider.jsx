import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { fetchState, saveState } from "../api";
import {
  DEFAULT_CAT_PROFILE,
  DEFAULT_TASKS,
  getTreatReward,
} from "../lib/constants";
import { ACCESSORIES } from "../lib/accessories";
import {
  completedHistory,
  getCatLevel,
  getTaskRewardXp,
  isActive,
  isDone,
  nextUpTasks,
  normaliseTask,
} from "../lib/tasks";
import { TaskStoreContext } from "./taskStoreContext";

/**
 * Writes are batched: every keystroke-driven state change used to fire its
 * own PUT to API Gateway. Coalescing them cuts request volume sharply and
 * keeps the app well inside the free tier.
 */
const SAVE_DEBOUNCE_MS = 600;

export function TaskStoreProvider({ children }) {
  const [tasks, setTasks] = useState(DEFAULT_TASKS);
  const [catProfile, setCatProfile] = useState(DEFAULT_CAT_PROFILE);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [saveError, setSaveError] = useState(null);

  const isLoaded = !isLoading && !loadError;
  const saveTimer = useRef(null);

  // Only touches state from async callbacks, so mounting does not cascade.
  const runLoad = useCallback(
    () =>
      fetchState()
        .then((data) => {
          setTasks((data.tasks || DEFAULT_TASKS).map(normaliseTask));
          setCatProfile(data.catProfile || DEFAULT_CAT_PROFILE);
          setLoadError(null);
        })
        .catch((error) => {
          console.error("Could not load saved state, using defaults:", error);
          setLoadError(error);
        })
        .finally(() => setIsLoading(false)),
    []
  );

  useEffect(() => {
    runLoad();
  }, [runLoad]);

  const retryLoad = useCallback(() => {
    setIsLoading(true);
    setLoadError(null);
    return runLoad();
  }, [runLoad]);

  // Debounced persistence. The timer is cleared on unmount so a pending
  // write never fires against a torn-down tree.
  useEffect(() => {
    if (!isLoaded) return undefined;

    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveState(tasks, catProfile)
        .then(() => setSaveError(null))
        .catch((error) => {
          console.error("Could not save state:", error);
          setSaveError(error);
        });
    }, SAVE_DEBOUNCE_MS);

    return () => clearTimeout(saveTimer.current);
  }, [tasks, catProfile, isLoaded]);

  const addTask = useCallback((draft) => {
    const title = draft.title.trim();
    if (!title) return;

    const priority = draft.priority || "medium";

    setTasks((current) => [
      ...current,
      {
        id: Date.now(),
        title,
        status: "todo",
        priority,
        dueDate: draft.dueDate || null,
        category: (draft.category || "").trim(),
        createdAt: new Date().toISOString(),
        completedAt: null,
        rewardXp: getTaskRewardXp(priority),
        rewardClaimed: false,
      },
    ]);
  }, []);

  const updateTask = useCallback((taskId, updates) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    );
  }, []);

  const completeTask = useCallback((taskId) => {
    setTasks((current) => {
      const target = current.find((task) => task.id === taskId);
      if (!target || target.status === "done") return current;

      const rewardXp = target.rewardXp || getTaskRewardXp(target.priority);

      // XP is paid once per task. Restoring and re-completing must not
      // pay out a second time, which is what rewardClaimed guards.
      if (!target.rewardClaimed) {
        setCatProfile((profile) => ({
          ...profile,
          totalXp: profile.totalXp + rewardXp,
          treats: profile.treats + getTreatReward(rewardXp),
        }));
      }

      return current.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: "done",
              completedAt: new Date().toISOString(),
              rewardXp,
              rewardClaimed: true,
            }
          : task
      );
    });
  }, []);

  const restoreTask = useCallback((taskId) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId
          ? { ...task, status: "todo", completedAt: null }
          : task
      )
    );
  }, []);

  const deleteTask = useCallback((taskId) => {
    setTasks((current) => current.filter((task) => task.id !== taskId));
  }, []);

  const purchaseAccessory = useCallback((accessoryId) => {
    setCatProfile((profile) => {
      if (accessoryId === "none") {
        return { ...profile, equippedAccessories: [] };
      }

      const equipped = Array.isArray(profile.equippedAccessories)
        ? profile.equippedAccessories
        : [];
      const unlocked = Array.isArray(profile.unlockedAccessoryIds)
        ? profile.unlockedAccessoryIds
        : [];

      // Already owned: this is an equip/unequip toggle, not a purchase.
      if (unlocked.includes(accessoryId)) {
        return {
          ...profile,
          equippedAccessories: equipped.includes(accessoryId)
            ? equipped.filter((id) => id !== accessoryId)
            : [...equipped, accessoryId],
        };
      }

      const accessory = ACCESSORIES.find((item) => item.id === accessoryId);
      const meetsLevel =
        getCatLevel(profile.totalXp) >= (accessory?.unlockLevel || 1);
      const canAfford = profile.treats >= (accessory?.treatCost || 0);

      if (!accessory || !meetsLevel || !canAfford) return profile;

      return {
        ...profile,
        treats: profile.treats - accessory.treatCost,
        unlockedAccessoryIds: [...unlocked, accessoryId],
        equippedAccessories: [...equipped, accessoryId],
      };
    });
  }, []);

  const derived = useMemo(() => {
    const active = tasks.filter(isActive);
    const completed = tasks.filter(isDone);

    return {
      activeTasks: active,
      completedTasks: completed,
      completedHistory: completedHistory(tasks),
      nextUpTasks: nextUpTasks(tasks),
      totalTasks: tasks.length,
      activeTaskCount: active.length,
      completedTaskCount: completed.length,
      highPriorityCount: active.filter((task) => task.priority === "high")
        .length,
    };
  }, [tasks]);

  const value = useMemo(
    () => ({
      tasks,
      catProfile,
      accessories: ACCESSORIES,
      isLoading,
      loadError,
      saveError,
      retryLoad,
      addTask,
      updateTask,
      completeTask,
      restoreTask,
      deleteTask,
      purchaseAccessory,
      ...derived,
    }),
    [
      tasks,
      catProfile,
      isLoading,
      loadError,
      saveError,
      retryLoad,
      addTask,
      updateTask,
      completeTask,
      restoreTask,
      deleteTask,
      purchaseAccessory,
      derived,
    ]
  );

  return (
    <TaskStoreContext.Provider value={value}>
      {children}
    </TaskStoreContext.Provider>
  );
}
