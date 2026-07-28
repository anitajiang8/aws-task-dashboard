import { useState } from "react";

const PRIORITY_REWARDS = {
  low: 5,
  medium: 10,
  high: 15,
};

function formatDate(dateString) {
  if (!dateString) {
    return "Not available";
  }

  // Date-only strings (e.g. dueDate) parse as UTC midnight, which can
  // display as the previous day in timezones behind UTC — force local time.
  const hasTimeComponent = dateString.includes("T");
  const date = hasTimeComponent
    ? new Date(dateString)
    : new Date(`${dateString}T00:00:00`);

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function TaskItem({
  task,
  variant,
  onCompleteTask,
  onRestoreTask,
  onDeleteTask,
  onUpdateTask,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(task.title);
  const [draftPriority, setDraftPriority] = useState(task.priority || "medium");
  const [draftDueDate, setDraftDueDate] = useState(task.dueDate || "");
  const [draftCategory, setDraftCategory] = useState(task.category || "");

  const priority = task.priority || "medium";
  const rewardXp = task.rewardXp || PRIORITY_REWARDS[priority];
  const isOverdue =
    variant === "active" && task.dueDate && task.dueDate < todayIsoDate();

  function startEditing() {
    setDraftTitle(task.title);
    setDraftPriority(task.priority || "medium");
    setDraftDueDate(task.dueDate || "");
    setDraftCategory(task.category || "");
    setIsEditing(true);
  }

  function handleSaveEdit(event) {
    event.preventDefault();

    if (draftTitle.trim() === "") {
      return;
    }

    onUpdateTask(task.id, {
      title: draftTitle,
      priority: draftPriority,
      dueDate: draftDueDate || null,
      category: draftCategory.trim(),
    });
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <form
        className={`task-item task-item-${variant} task-item-editing`}
        onSubmit={handleSaveEdit}
      >
        <div className="task-edit-row">
          <input
            type="text"
            value={draftTitle}
            onChange={(event) => setDraftTitle(event.target.value)}
            aria-label="Task title"
          />

          <select
            value={draftPriority}
            onChange={(event) => setDraftPriority(event.target.value)}
            aria-label="Priority"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <input
            type="date"
            value={draftDueDate}
            onChange={(event) => setDraftDueDate(event.target.value)}
            aria-label="Due date"
          />

          <input
            type="text"
            placeholder="Category (optional)"
            value={draftCategory}
            onChange={(event) => setDraftCategory(event.target.value)}
            aria-label="Category"
          />
        </div>

        <div className="task-actions">
          <button type="submit" className="complete-button">
            Save
          </button>

          <button
            type="button"
            className="ghost-button"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <article className={`task-item task-item-${variant}`}>
      <div className="task-main">
        <div className="task-title-row">
          <h3>{task.title}</h3>

          <span className={`priority-badge ${priority}`}>{priority}</span>

          {task.category && (
            <span className="category-badge">{task.category}</span>
          )}
        </div>

        <div className="task-meta">
          <span>Created {formatDate(task.createdAt)}</span>

          {task.dueDate && (
            <span className={isOverdue ? "due-badge overdue" : "due-badge"}>
              {isOverdue ? "Overdue" : "Due"} {formatDate(task.dueDate)}
            </span>
          )}

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

        <button className="ghost-button" onClick={startEditing}>
          Edit
        </button>

        <button className="ghost-button" onClick={() => onDeleteTask(task.id)}>
          Delete
        </button>
      </div>
    </article>
  );
}

export default TaskItem;
