const PRIORITY_REWARDS = {
  low: 5,
  medium: 10,
  high: 15,
};

function formatDate(dateString) {
  if (!dateString) {
    return "Not available";
  }

  return new Date(dateString).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function TaskItem({
  task,
  variant,
  onCompleteTask,
  onRestoreTask,
  onDeleteTask,
}) {
  const priority = task.priority || "medium";
  const rewardXp = task.rewardXp || PRIORITY_REWARDS[priority];

  return (
    <article className={`task-item task-item-${variant}`}>
      <div className="task-main">
        <div className="task-title-row">
          <h3>{task.title}</h3>

          <span className={`priority-badge ${priority}`}>
            {priority}
          </span>
        </div>

        <div className="task-meta">
          <span>Created {formatDate(task.createdAt)}</span>

          {variant === "completed" && (
            <span>Completed {formatDate(task.completedAt)}</span>
          )}

          <span>{rewardXp} XP</span>
        </div>
      </div>

      <div className="task-actions">
        {variant === "active" ? (
          <button
            className="complete-button"
            onClick={() => onCompleteTask(task.id)}
          >
            Complete +{rewardXp} XP
          </button>
        ) : (
          <button
            className="restore-button"
            onClick={() => onRestoreTask(task.id)}
          >
            Restore
          </button>
        )}

        <button className="delete-button" onClick={() => onDeleteTask(task.id)}>
          Delete
        </button>
      </div>
    </article>
  );
}

export default TaskItem;