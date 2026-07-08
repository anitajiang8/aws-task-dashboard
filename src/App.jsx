import { useEffect, useState } from "react";
import { Link, Route, Routes } from "react-router";
import "./App.css";

import CatCompanion from "./components/CatCompanion";
import Header from "./components/Header";
import StatsCard from "./components/StatsCard";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

const TASKS_STORAGE_KEY = "aws-task-dashboard-tasks";
const CAT_PROFILE_STORAGE_KEY = "purrductivity-cat-profile";

const PRIORITY_ORDER = {
  low: 1,
  medium: 2,
  high: 3,
};

const PRIORITY_REWARDS = {
  low: 5,
  medium: 10,
  high: 15,
};

const DEFAULT_TASKS = [
  {
    id: 1,
    title: "Plan a cosy study session",
    status: "todo",
    priority: "medium",
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
    createdAt: new Date().toISOString(),
    completedAt: null,
    rewardXp: 15,
    rewardClaimed: false,
  },
];

const DEFAULT_CAT_PROFILE = {
  catName: "Mochi",
  totalXp: 0,
  treats: 0,
};

function getTaskRewardXp(priority) {
  return PRIORITY_REWARDS[priority] || PRIORITY_REWARDS.medium;
}

function normaliseTask(task) {
  const priority = task.priority || "medium";
  const status = task.status === "done" ? "done" : "todo";

  return {
    id: task.id || Date.now(),
    title: task.title || "Untitled task",
    status,
    priority,
    createdAt: task.createdAt || new Date().toISOString(),
    completedAt:
      task.completedAt || (status === "done" ? new Date().toISOString() : null),
    rewardXp: task.rewardXp || getTaskRewardXp(priority),
    rewardClaimed: Boolean(task.rewardClaimed),
  };
}

function loadSavedTasks() {
  const savedTasks = localStorage.getItem(TASKS_STORAGE_KEY);

  if (!savedTasks) {
    return DEFAULT_TASKS;
  }

  try {
    const parsedTasks = JSON.parse(savedTasks);

    if (!Array.isArray(parsedTasks)) {
      return DEFAULT_TASKS;
    }

    return parsedTasks.map(normaliseTask);
  } catch {
    return DEFAULT_TASKS;
  }
}

function loadSavedCatProfile() {
  const savedProfile = localStorage.getItem(CAT_PROFILE_STORAGE_KEY);

  if (!savedProfile) {
    return DEFAULT_CAT_PROFILE;
  }

  try {
    const parsedProfile = JSON.parse(savedProfile);

    return {
      catName: parsedProfile.catName || DEFAULT_CAT_PROFILE.catName,
      totalXp: parsedProfile.totalXp || 0,
      treats: parsedProfile.treats || 0,
    };
  } catch {
    return DEFAULT_CAT_PROFILE;
  }
}

function DashboardPage({
  catProfile,
  totalTasks,
  activeTaskCount,
  completedTaskCount,
  highPriorityTasks,
  newTaskTitle,
  setNewTaskTitle,
  newTaskPriority,
  setNewTaskPriority,
  handleAddTask,
  activeFilter,
  setActiveFilter,
  searchQuery,
  setSearchQuery,
  sortOption,
  setSortOption,
  displayedTasks,
  handleCompleteTask,
  handleDeleteTask,
}) {
  return (
    <main className="app">
      <section className="dashboard">
        <Header />

        <div className="hero-grid">
          <CatCompanion
            catProfile={catProfile}
            completedTaskCount={completedTaskCount}
          />

          <section className="focus-card">
            <p className="card-kicker">Today&apos;s cosy quest</p>
            <h2>Finish tasks, earn treats, and help Mochi grow.</h2>
            <p>
              Complete active tasks to collect XP. Finished tasks now live in
              their own archive page, so your main dashboard stays calm and
              focused.
            </p>

            <div className="hero-actions">
              <Link className="cute-link-button" to="/archive">
                View Completed Archive
              </Link>
            </div>
          </section>
        </div>

        <div className="stats-grid">
          <StatsCard
            icon="🌸"
            label="Total Quests"
            value={totalTasks}
            helper="All tasks created"
          />
          <StatsCard
            icon="🧁"
            label="Active"
            value={activeTaskCount}
            helper="Still waiting for you"
          />
          <StatsCard
            icon="✨"
            label="Completed"
            value={completedTaskCount}
            helper="Saved in archive"
          />
          <StatsCard
            icon="🎀"
            label="High Priority"
            value={highPriorityTasks}
            helper="Needs extra focus"
          />
        </div>

        <TaskForm
          newTaskTitle={newTaskTitle}
          setNewTaskTitle={setNewTaskTitle}
          newTaskPriority={newTaskPriority}
          setNewTaskPriority={setNewTaskPriority}
          onAddTask={handleAddTask}
        />

        <div className="filter-bar">
          <button
            className={activeFilter === "all" ? "active-filter" : ""}
            onClick={() => setActiveFilter("all")}
          >
            All Active
          </button>

          <button
            className={activeFilter === "high" ? "active-filter" : ""}
            onClick={() => setActiveFilter("high")}
          >
            High Priority
          </button>

          <button
            className={activeFilter === "medium" ? "active-filter" : ""}
            onClick={() => setActiveFilter("medium")}
          >
            Medium
          </button>

          <button
            className={activeFilter === "low" ? "active-filter" : ""}
            onClick={() => setActiveFilter("low")}
          >
            Low
          </button>
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
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="priority-high">Priority: high to low</option>
              <option value="priority-low">Priority: low to high</option>
              <option value="title-az">Title A–Z</option>
            </select>
          </div>
        </div>

        <TaskList
          title="Active Tasks"
          subtitle="Complete tasks to earn XP and send them to your cosy archive."
          tasks={displayedTasks}
          emptyMessage="No active tasks here. Add a new quest above!"
          variant="active"
          onCompleteTask={handleCompleteTask}
          onDeleteTask={handleDeleteTask}
        />
      </section>
    </main>
  );
}

function ArchivePage({
  completedHistory,
  completedTaskCount,
  catProfile,
  handleRestoreTask,
  handleDeleteTask,
}) {
  return (
    <main className="app">
      <section className="dashboard archive-page">
        <div className="archive-hero">
          <div>
            <p className="card-kicker">Completed archive</p>
            <h1>Quest History</h1>
            <p>
              A cosy little record of everything you have finished. Restore a
              task if you completed it by accident, or keep this page as your
              productivity scrapbook.
            </p>
          </div>

          <Link className="cute-link-button secondary-link-button" to="/">
            Back to Dashboard
          </Link>
        </div>

        <div className="archive-summary-grid">
          <div className="archive-summary-card">
            <span>Completed Quests</span>
            <strong>{completedTaskCount}</strong>
          </div>

          <div className="archive-summary-card">
            <span>Mochi&apos;s XP</span>
            <strong>{catProfile.totalXp}</strong>
          </div>

          <div className="archive-summary-card">
            <span>Treats Earned</span>
            <strong>{catProfile.treats}</strong>
          </div>
        </div>

        <TaskList
          title="Completed History"
          subtitle="Tasks you completed are stored here instead of crowding the main dashboard."
          tasks={completedHistory}
          emptyMessage="No completed tasks yet. Mochi is waiting for treats."
          variant="completed"
          onRestoreTask={handleRestoreTask}
          onDeleteTask={handleDeleteTask}
        />
      </section>
    </main>
  );
}

function App() {
  const [tasks, setTasks] = useState(() => loadSavedTasks());
  const [catProfile, setCatProfile] = useState(() => loadSavedCatProfile());

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("medium");
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");

  useEffect(() => {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(CAT_PROFILE_STORAGE_KEY, JSON.stringify(catProfile));
  }, [catProfile]);

  function handleAddTask(event) {
    event.preventDefault();

    if (newTaskTitle.trim() === "") {
      return;
    }

    const rewardXp = getTaskRewardXp(newTaskPriority);

    const newTask = {
      id: Date.now(),
      title: newTaskTitle,
      status: "todo",
      priority: newTaskPriority,
      createdAt: new Date().toISOString(),
      completedAt: null,
      rewardXp,
      rewardClaimed: false,
    };

    setTasks([...tasks, newTask]);
    setNewTaskTitle("");
    setNewTaskPriority("medium");
  }

  function handleCompleteTask(taskId) {
    const taskToComplete = tasks.find((task) => task.id === taskId);

    if (!taskToComplete || taskToComplete.status === "done") {
      return;
    }

    const rewardXp =
      taskToComplete.rewardXp || getTaskRewardXp(taskToComplete.priority);

    if (!taskToComplete.rewardClaimed) {
      setCatProfile((currentProfile) => ({
        ...currentProfile,
        totalXp: currentProfile.totalXp + rewardXp,
        treats: currentProfile.treats + Math.max(1, Math.round(rewardXp / 5)),
      }));
    }

    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        return {
          ...task,
          status: "done",
          completedAt: new Date().toISOString(),
          rewardXp,
          rewardClaimed: true,
        };
      }

      return task;
    });

    setTasks(updatedTasks);
  }

  function handleRestoreTask(taskId) {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        return {
          ...task,
          status: "todo",
          completedAt: null,
        };
      }

      return task;
    });

    setTasks(updatedTasks);
  }

  function handleDeleteTask(taskId) {
    const remainingTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(remainingTasks);
  }

  const activeTasks = tasks.filter((task) => task.status !== "done");
  const completedTasks = tasks.filter((task) => task.status === "done");

  const totalTasks = tasks.length;
  const activeTaskCount = activeTasks.length;
  const completedTaskCount = completedTasks.length;
  const highPriorityTasks = activeTasks.filter(
    (task) => task.priority === "high"
  ).length;

  const filteredAndSearchedTasks = activeTasks
    .filter((task) => {
      if (activeFilter === "high") {
        return task.priority === "high";
      }

      if (activeFilter === "medium") {
        return task.priority === "medium";
      }

      if (activeFilter === "low") {
        return task.priority === "low";
      }

      return true;
    })
    .filter((task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const displayedTasks = [...filteredAndSearchedTasks].sort((taskA, taskB) => {
    if (sortOption === "newest") {
      return new Date(taskB.createdAt) - new Date(taskA.createdAt);
    }

    if (sortOption === "oldest") {
      return new Date(taskA.createdAt) - new Date(taskB.createdAt);
    }

    if (sortOption === "priority-high") {
      return (
        PRIORITY_ORDER[taskB.priority || "medium"] -
        PRIORITY_ORDER[taskA.priority || "medium"]
      );
    }

    if (sortOption === "priority-low") {
      return (
        PRIORITY_ORDER[taskA.priority || "medium"] -
        PRIORITY_ORDER[taskB.priority || "medium"]
      );
    }

    if (sortOption === "title-az") {
      return taskA.title.localeCompare(taskB.title);
    }

    return 0;
  });

  const completedHistory = [...completedTasks].sort((taskA, taskB) => {
    return new Date(taskB.completedAt) - new Date(taskA.completedAt);
  });

  return (
    <Routes>
      <Route
        path="/"
        element={
          <DashboardPage
            catProfile={catProfile}
            totalTasks={totalTasks}
            activeTaskCount={activeTaskCount}
            completedTaskCount={completedTaskCount}
            highPriorityTasks={highPriorityTasks}
            newTaskTitle={newTaskTitle}
            setNewTaskTitle={setNewTaskTitle}
            newTaskPriority={newTaskPriority}
            setNewTaskPriority={setNewTaskPriority}
            handleAddTask={handleAddTask}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortOption={sortOption}
            setSortOption={setSortOption}
            displayedTasks={displayedTasks}
            handleCompleteTask={handleCompleteTask}
            handleDeleteTask={handleDeleteTask}
          />
        }
      />

      <Route
        path="/archive"
        element={
          <ArchivePage
            completedHistory={completedHistory}
            completedTaskCount={completedTaskCount}
            catProfile={catProfile}
            handleRestoreTask={handleRestoreTask}
            handleDeleteTask={handleDeleteTask}
          />
        }
      />

      <Route
        path="*"
        element={
          <DashboardPage
            catProfile={catProfile}
            totalTasks={totalTasks}
            activeTaskCount={activeTaskCount}
            completedTaskCount={completedTaskCount}
            highPriorityTasks={highPriorityTasks}
            newTaskTitle={newTaskTitle}
            setNewTaskTitle={setNewTaskTitle}
            newTaskPriority={newTaskPriority}
            setNewTaskPriority={setNewTaskPriority}
            handleAddTask={handleAddTask}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortOption={sortOption}
            setSortOption={setSortOption}
            displayedTasks={displayedTasks}
            handleCompleteTask={handleCompleteTask}
            handleDeleteTask={handleDeleteTask}
          />
        }
      />
    </Routes>
  );
}

export default App;