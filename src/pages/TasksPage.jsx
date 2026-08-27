import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";

import PageHeader from "../components/PageHeader";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import {
  SORT_OPTIONS,
  filterByPriority,
  searchTasks,
  sortTasks,
} from "../lib/tasks";
import { useTaskStore } from "../store/taskStoreContext";

const PRIORITY_FILTERS = [
  { value: "all", label: "All Active" },
  { value: "high", label: "High Priority" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

function TasksPage() {
  const {
    activeTasks,
    activeTaskCount,
    addTask,
    completeTask,
    deleteTask,
    updateTask,
  } = useTaskStore();

  // Draft and view state belong to this page, not to the global store.
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("medium");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState("");

  // The priority filter lives in the URL so the home page can deep-link
  // straight to /tasks?priority=high, and so a filtered view is shareable.
  const [searchParams, setSearchParams] = useSearchParams();
  const activeFilter = searchParams.get("priority") || "all";

  function setActiveFilter(priority) {
    const next = new URLSearchParams(searchParams);
    if (priority === "all") {
      next.delete("priority");
    } else {
      next.set("priority", priority);
    }
    // replace, so clicking through pills does not stack history entries.
    setSearchParams(next, { replace: true });
  }

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");

  const displayedTasks = useMemo(
    () =>
      sortTasks(
        searchTasks(filterByPriority(activeTasks, activeFilter), searchQuery),
        sortOption
      ),
    [activeTasks, activeFilter, searchQuery, sortOption]
  );

  function handleAddTask(event) {
    event.preventDefault();

    addTask({
      title: newTaskTitle,
      priority: newTaskPriority,
      dueDate: newTaskDueDate,
      category: newTaskCategory,
    });

    setNewTaskTitle("");
    setNewTaskPriority("medium");
    setNewTaskDueDate("");
    setNewTaskCategory("");
  }

  const activeEmptyMessage =
    activeTaskCount === 0
      ? "No open quests. Add one above and Mochi will start earning."
      : "Nothing matches this filter or search. Try “All Active” to see everything.";

  return (
    <section className="dashboard">
      <PageHeader
        eyebrow="Quests"
        title="Your quest log"
        subtitle="Everything still open, in one place. Priority sets the payout, so high-priority quests are worth the most XP and treats."
      />

      <TaskForm
        newTaskTitle={newTaskTitle}
        setNewTaskTitle={setNewTaskTitle}
        newTaskPriority={newTaskPriority}
        setNewTaskPriority={setNewTaskPriority}
        newTaskDueDate={newTaskDueDate}
        setNewTaskDueDate={setNewTaskDueDate}
        newTaskCategory={newTaskCategory}
        setNewTaskCategory={setNewTaskCategory}
        onAddTask={handleAddTask}
      />

      <div className="filter-bar">
        {PRIORITY_FILTERS.map((filter) => (
          <button
            key={filter.value}
            className={activeFilter === filter.value ? "active-filter" : ""}
            onClick={() => setActiveFilter(filter.value)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="controls-row">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search active tasks..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </div>

        <div className="sort-control">
          <label htmlFor="sort-tasks">Sort active tasks</label>
          <select
            id="sort-tasks"
            value={sortOption}
            onChange={(event) => setSortOption(event.target.value)}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <TaskList
        title="Active Tasks"
        subtitle="Finish one to collect its reward and move it to the archive."
        tasks={displayedTasks}
        emptyMessage={activeEmptyMessage}
        variant="active"
        onCompleteTask={completeTask}
        onDeleteTask={deleteTask}
        onUpdateTask={updateTask}
      />
    </section>
  );
}

export default TasksPage;
