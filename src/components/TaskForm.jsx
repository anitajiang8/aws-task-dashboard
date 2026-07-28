function TaskForm({
  newTaskTitle,
  setNewTaskTitle,
  newTaskPriority,
  setNewTaskPriority,
  newTaskDueDate,
  setNewTaskDueDate,
  newTaskCategory,
  setNewTaskCategory,
  onAddTask,
}) {
  return (
    <form className="task-form" onSubmit={onAddTask}>
      <div className="form-text">
        <h2>Add something for future you</h2>
      </div>

      <div className="form-title-row">
        <input
          type="text"
          placeholder="Write a task, assignment, or reminder..."
          value={newTaskTitle}
          onChange={(event) => setNewTaskTitle(event.target.value)}
        />
      </div>

      <div className="form-controls">
        <select
          value={newTaskPriority}
          onChange={(event) => setNewTaskPriority(event.target.value)}
        >
          <option value="low">Low Priority · +5 XP</option>
          <option value="medium">Medium Priority · +10 XP</option>
          <option value="high">High Priority · +15 XP</option>
        </select>

        <input
          type="date"
          aria-label="Due date"
          value={newTaskDueDate}
          onChange={(event) => setNewTaskDueDate(event.target.value)}
        />

        <input
          type="text"
          placeholder="Category (optional)"
          value={newTaskCategory}
          onChange={(event) => setNewTaskCategory(event.target.value)}
        />

        <button type="submit">Add Quest</button>
      </div>
    </form>
  );
}

export default TaskForm;
