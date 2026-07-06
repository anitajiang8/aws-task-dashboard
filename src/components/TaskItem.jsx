function TaskItem({ task, onToggleComplete, onDeleteTask }) {
  const priority = task.priority || "medium";

  return (
    <article className="task-item">
      <div>
        <div className="task-title-row">
          <h3 className={task.status === "done" ? "completed" : ""}>
            {task.title}
          </h3>

          <span className={`priority-badge ${priority}`}>
            {priority}
          </span>
        </div>

        <p>Status: {task.status}</p>

        {task.createdAt && (
          <p className="created-date">
            Created: {new Date(task.createdAt).toLocaleDateString()}
          </p>
        )}
      </div>

      <div className="task-actions">
        <button onClick={() => onToggleComplete(task.id)}>
          {task.status === "done" ? "Undo" : "Complete"}
        </button>

        <button className="delete-button" onClick={() => onDeleteTask(task.id)}>
          Delete
        </button>
      </div>
    </article>
  );
}

export default TaskItem;