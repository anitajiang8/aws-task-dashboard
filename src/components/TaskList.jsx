import TaskItem from "./TaskItem";

function TaskList({
  title,
  subtitle,
  tasks,
  emptyMessage,
  variant,
  onCompleteTask,
  onRestoreTask,
  onDeleteTask,
}) {
  return (
    <section className={`task-list task-list-${variant}`}>
      <div className="task-list-header">
        <div>
          <p className="card-kicker">
            {variant === "completed" ? "Archive" : "Focus list"}
          </p>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>

        <span>{tasks.length} items</span>
      </div>

      {tasks.length === 0 ? (
        <p className="empty-message">{emptyMessage}</p>
      ) : (
        <div className="task-stack">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              variant={variant}
              onCompleteTask={onCompleteTask}
              onRestoreTask={onRestoreTask}
              onDeleteTask={onDeleteTask}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default TaskList;