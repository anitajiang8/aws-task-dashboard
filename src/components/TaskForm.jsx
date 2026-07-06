function TaskForm({
  newTaskTitle,
  setNewTaskTitle,
  newTaskPriority,
  setNewTaskPriority,
  onAddTask,
}) {
  return (
    <form className="task-form" onSubmit={onAddTask}>
      <input
        type="text"
        placeholder="Enter a new task..."
        value={newTaskTitle}
        onChange={(event) => setNewTaskTitle(event.target.value)}
      />

      <select
        value={newTaskPriority}
        onChange={(event) => setNewTaskPriority(event.target.value)}
      >
        <option value="low">Low Priority</option>
        <option value="medium">Medium Priority</option>
        <option value="high">High Priority</option>
      </select>

      <button type="submit">Add Task</button>
    </form>
  );
}

export default TaskForm;