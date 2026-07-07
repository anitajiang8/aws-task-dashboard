function TaskForm({
  newTaskTitle,
  setNewTaskTitle,
  newTaskPriority,
  setNewTaskPriority,
  onAddTask,
}) {
  return (
    <form className="task-form" onSubmit={onAddTask}>
      <div className="form-text">
        <p className="card-kicker">New quest</p>
        <h2>Add something for future you</h2>
      </div>

      <div className="form-controls">
        <input
          type="text"
          placeholder="Write a task, assignment, or reminder..."
          value={newTaskTitle}
          onChange={(event) => setNewTaskTitle(event.target.value)}
        />

        <select
          value={newTaskPriority}
          onChange={(event) => setNewTaskPriority(event.target.value)}
        >
          <option value="low">Low Priority · +5 XP</option>
          <option value="medium">Medium Priority · +10 XP</option>
          <option value="high">High Priority · +15 XP</option>
        </select>

        <button type="submit">Add Quest</button>
      </div>
    </form>
  );
}

export default TaskForm;