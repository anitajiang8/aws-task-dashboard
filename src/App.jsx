import { useEffect, useState } from "react";
import "./App.css";

import Header from "./components/Header";
import StatsCard from "./components/StatsCard";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

const TASKS_STORAGE_KEY = "aws-task-dashboard-tasks";

const DEFAULT_TASKS = [
  {
    id: 1,
    title: "Complete AWS CRUD tutorial",
    status: "done",
    priority: "high",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Build frontend task dashboard",
    status: "todo",
    priority: "medium",
    createdAt: new Date().toISOString(),
  },
];

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem(TASKS_STORAGE_KEY);

    if (savedTasks) {
      return JSON.parse(savedTasks);
    }

    return DEFAULT_TASKS;
  });

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("medium");
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  function handleAddTask(event) {
    event.preventDefault();

    if (newTaskTitle.trim() === "") {
      return;
    }

    const newTask = {
      id: Date.now(),
      title: newTaskTitle,
      status: "todo",
      priority: newTaskPriority,
      createdAt: new Date().toISOString(),
    };

    setTasks([...tasks, newTask]);
    setNewTaskTitle("");
    setNewTaskPriority("medium");
  }

  function handleToggleComplete(taskId) {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        return {
          ...task,
          status: task.status === "done" ? "todo" : "done",
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

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "done").length;
  const todoTasks = tasks.filter((task) => task.status === "todo").length;
  const highPriorityTasks = tasks.filter(
    (task) => task.priority === "high"
  ).length;

  const filteredTasks = tasks.filter((task) => {
    if (activeFilter === "todo") {
      return task.status === "todo";
    }

    if (activeFilter === "done") {
      return task.status === "done";
    }

    if (activeFilter === "high") {
      return task.priority === "high";
    }

    return true;
  });

  return (
    <main className="app">
      <section className="dashboard">
        <Header />

        <div className="stats-grid">
          <StatsCard label="Total Tasks" value={totalTasks} />
          <StatsCard label="Completed" value={completedTasks} />
          <StatsCard label="To Do" value={todoTasks} />
          <StatsCard label="High Priority" value={highPriorityTasks} />
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
            All
          </button>

          <button
            className={activeFilter === "todo" ? "active-filter" : ""}
            onClick={() => setActiveFilter("todo")}
          >
            To Do
          </button>

          <button
            className={activeFilter === "done" ? "active-filter" : ""}
            onClick={() => setActiveFilter("done")}
          >
            Completed
          </button>

          <button
            className={activeFilter === "high" ? "active-filter" : ""}
            onClick={() => setActiveFilter("high")}
          >
            High Priority
          </button>
        </div>

        <TaskList
          tasks={filteredTasks}
          onToggleComplete={handleToggleComplete}
          onDeleteTask={handleDeleteTask}
        />
      </section>
    </main>
  );
}

export default App;