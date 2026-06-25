import { useState } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Complete AWS CRUD tutorial",
      status: "done",
    },
    {
      id: 2,
      title: "Build frontend task dashboard",
      status: "todo",
    },
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState("");

  function handleAddTask(event) {
    event.preventDefault();

    if (newTaskTitle.trim() === "") {
      return;
    }

    const newTask = {
      id: Date.now(),
      title: newTaskTitle,
      status: "todo",
    };

    setTasks([...tasks, newTask]);
    setNewTaskTitle("");
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

  return (
    <main className="app">
      <section className="dashboard">
        <div className="header">
          <p className="eyebrow">AWS Serverless Project</p>
          <h1>Task Dashboard</h1>
          <p className="subtitle">
            A frontend task manager that will later connect to API Gateway,
            Lambda, and DynamoDB.
          </p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span>Total Tasks</span>
            <strong>{totalTasks}</strong>
          </div>

          <div className="stat-card">
            <span>Completed</span>
            <strong>{completedTasks}</strong>
          </div>

          <div className="stat-card">
            <span>To Do</span>
            <strong>{todoTasks}</strong>
          </div>
        </div>

        <form className="task-form" onSubmit={handleAddTask}>
          <input
            type="text"
            placeholder="Enter a new task..."
            value={newTaskTitle}
            onChange={(event) => setNewTaskTitle(event.target.value)}
          />
          <button type="submit">Add Task</button>
        </form>

        <section className="task-list">
          <h2>Tasks</h2>

          {tasks.length === 0 ? (
            <p className="empty-message">No tasks yet. Add one above.</p>
          ) : (
            tasks.map((task) => (
              <article className="task-item" key={task.id}>
                <div>
                  <h3 className={task.status === "done" ? "completed" : ""}>
                    {task.title}
                  </h3>
                  <p>Status: {task.status}</p>
                </div>

                <div className="task-actions">
                  <button onClick={() => handleToggleComplete(task.id)}>
                    {task.status === "done" ? "Undo" : "Complete"}
                  </button>

                  <button
                    className="delete-button"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))
          )}
        </section>
      </section>
    </main>
  );
}

export default App;