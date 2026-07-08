import { useEffect, useState } from "react";
import { Link, NavLink, Route, Routes } from "react-router";
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

function getMiniNavClass({ isActive }) {
  return isActive ? "mini-nav-tab active-mini-nav-tab" : "mini-nav-tab";
}

function MiniTopNav() {
  return (
    <nav className="mini-top-nav" aria-label="Main navigation">
      <NavLink end to="/" className={getMiniNavClass}>
        <span>🏠</span>
        <span>Home</span>
      </NavLink>

      <NavLink to="/tasks" className={getMiniNavClass}>
        <span>📝</span>
        <span>Tasks</span>
      </NavLink>

      <NavLink to="/mochi" className={getMiniNavClass}>
        <span>🐱</span>
        <span>Mochi</span>
      </NavLink>

      <NavLink to="/archive" className={getMiniNavClass}>
        <span>🐾</span>
        <span>Archive</span>
      </NavLink>
    </nav>
  );
}

function PageIntro({ kicker, title, children }) {
  return (
    <section className="page-intro-card">
      <p className="card-kicker">{kicker}</p>
      <h1>{title}</h1>
      <p>{children}</p>
    </section>
  );
}

function HomePage({
  totalTasks,
  activeTaskCount,
  completedTaskCount,
  highPriorityTasks,
  activeTasks,
  catProfile,
}) {
  const totalXp = catProfile.totalXp || 0;
  const level = Math.floor(totalXp / 100) + 1;
  const xpInCurrentLevel = totalXp % 100;
  const previewTasks = activeTasks.slice(0, 3);

  return (
    <main className="app">
      <MiniTopNav />

      <section className="dashboard">
        <Header />

        <div className="home-hero-grid">
          <section className="home-hero-card">
            <p className="card-kicker">Welcome back</p>
            <h2>Your cosy productivity space is ready.</h2>
            <p>
              Check your active quests, visit Mochi, or look through your
              completed archive without crowding everything onto one page.
            </p>

            <div className="home-link-row">
              <Link className="cute-page-link" to="/tasks">
                Start Tasks
              </Link>

              <Link className="cute-page-link secondary-page-link" to="/mochi">
                Visit Mochi
              </Link>
            </div>
          </section>

          <section className="home-mochi-card">
            <p className="card-kicker">Mochi status</p>
            <h2>{catProfile.catName}</h2>

            <div className="home-mochi-bubble">🐱</div>

            <div className="home-mochi-stats">
              <div>
                <strong>Level {level}</strong>
                <span>{xpInCurrentLevel}/100 XP</span>
              </div>

              <div>
                <strong>{catProfile.treats}</strong>
                <span>Treats</span>
              </div>
            </div>

            <Link className="text-page-link" to="/mochi">
              Open Mochi&apos;s room →
            </Link>
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

        <section className="home-preview-card">
          <div className="home-preview-header">
            <div>
              <p className="card-kicker">Task preview</p>
              <h2>Active Quests</h2>
            </div>

            <Link className="text-page-link" to="/tasks">
              View all tasks →
            </Link>
          </div>

          {previewTasks.length === 0 ? (
            <p className="home-preview-empty">
              No active tasks right now. Add your next quest on the Tasks page.
            </p>
          ) : (
            <div className="home-preview-list">
              {previewTasks.map((task) => (
                <article className="home-preview-item" key={task.id}>
                  <span>{task.title}</span>
                  <span className={`priority-badge ${task.priority}`}>
                    {task.priority}
                  </span>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

function TasksPage({
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
  const activeEmptyMessage =
    activeTaskCount === 0
      ? "No active tasks here. Add a new quest above!"
      : "No active tasks match your current filter or search. Try All Active.";

  return (
    <main className="app">
      <MiniTopNav />

      <section className="dashboard task-page">
        <PageIntro kicker="Task garden" title="Tasks">
          Add new quests, filter your active list, and complete tasks to earn XP
          for Mochi.
        </PageIntro>

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
          emptyMessage={activeEmptyMessage}
          variant="active"
          onCompleteTask={handleCompleteTask}
          onDeleteTask={handleDeleteTask}
        />
      </section>
    </main>
  );
}

function MochiPage({ catProfile, completedTaskCount }) {
  return (
    <main className="app">
      <MiniTopNav />

      <section className="dashboard mochi-page">
        <PageIntro kicker="Mochi's room" title="Mochi">
          Track XP, treats, levels, and unlocked accessories in one dedicated
          cosy space.
        </PageIntro>

        <div className="mochi-layout">
          <CatCompanion
            catProfile={catProfile}
            completedTaskCount={completedTaskCount}
          />

          <section className="mochi-info-card">
            <p className="card-kicker">How Mochi grows</p>
            <h2>Complete tasks to unlock more decorations.</h2>
            <p>
              Each completed quest gives Mochi XP and treats. Higher-priority
              tasks give bigger rewards, and new level milestones unlock extra
              room details and accessories.
            </p>

            <div className="mochi-reward-list">
              <div>
                <strong>Low</strong>
                <span>+5 XP</span>
              </div>

              <div>
                <strong>Medium</strong>
                <span>+10 XP</span>
              </div>

              <div>
                <strong>High</strong>
                <span>+15 XP</span>
              </div>
            </div>

            <Link className="cute-page-link" to="/tasks">
              Complete a Quest
            </Link>
          </section>
        </div>
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
      <MiniTopNav />

      <section className="dashboard archive-page">
        <section className="archive-hero">
          <div className="archive-hero-copy">
            <p className="card-kicker">Mochi&apos;s scrapbook</p>
            <h1>Archived Tasks</h1>
            <p>
              Every completed quest lives here, like a soft little record of
              your progress. Restore a task when you need it back, or delete it
              when you are ready to clear the shelf.
            </p>
          </div>

          <div className="archive-hero-art" aria-hidden="true">
            <span className="archive-art-sparkle archive-art-sparkle-one">
              ✦
            </span>
            <span className="archive-art-sparkle archive-art-sparkle-two">
              ♡
            </span>
            <div className="archive-yarn-ball">🧶</div>
            <div className="archive-paw-card">🐾</div>
          </div>
        </section>

        <div className="archive-summary-grid">
          <div className="archive-summary-card">
            <span>Completed Quests</span>
            <strong>{completedTaskCount}</strong>
            <p>Finished and saved</p>
          </div>

          <div className="archive-summary-card">
            <span>Mochi&apos;s XP</span>
            <strong>{catProfile.totalXp}</strong>
            <p>Total progress earned</p>
          </div>

          <div className="archive-summary-card">
            <span>Treats Earned</span>
            <strong>{catProfile.treats}</strong>
            <p>Rewards for Mochi</p>
          </div>
        </div>

        <section className="archive-note-card">
          <div className="archive-note-icon">📚</div>
          <div>
            <h2>Completed quests stay out of your way.</h2>
            <p>
              Your dashboard only shows active tasks now. This archive keeps
              your finished work organised without making the main page feel
              crowded.
            </p>
          </div>
        </section>

        <TaskList
          title="Completed History"
          subtitle="A cosy archive of everything you have already finished."
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

  const taskPageProps = {
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
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <HomePage
            totalTasks={totalTasks}
            activeTaskCount={activeTaskCount}
            completedTaskCount={completedTaskCount}
            highPriorityTasks={highPriorityTasks}
            activeTasks={activeTasks}
            catProfile={catProfile}
          />
        }
      />

      <Route path="/tasks" element={<TasksPage {...taskPageProps} />} />

      <Route
        path="/mochi"
        element={
          <MochiPage
            catProfile={catProfile}
            completedTaskCount={completedTaskCount}
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
          <HomePage
            totalTasks={totalTasks}
            activeTaskCount={activeTaskCount}
            completedTaskCount={completedTaskCount}
            highPriorityTasks={highPriorityTasks}
            activeTasks={activeTasks}
            catProfile={catProfile}
          />
        }
      />
    </Routes>
  );
}

export default App;