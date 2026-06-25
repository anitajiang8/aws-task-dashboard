function TaskItem({ task, onToggleComplete, onDeleteTask }) {
  return (
    <article className="task-item">
      <div>
        <h3 className={task.status === "done" ? "completed" : ""}>
          {task.title}
        </h3>
        <p>Status: {task.status}</p>
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