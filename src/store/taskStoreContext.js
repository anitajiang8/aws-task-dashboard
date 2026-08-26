import { createContext, useContext } from "react";

export const TaskStoreContext = createContext(null);

/** Access the task store. Must be used inside <TaskStoreProvider>. */
export function useTaskStore() {
  const store = useContext(TaskStoreContext);

  if (!store) {
    throw new Error("useTaskStore must be used within a TaskStoreProvider");
  }

  return store;
}
