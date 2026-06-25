function TaskForm({ newTaskTitle, setNewTaskTitle, onAddTask }) {
  return (
    <form className="task-form" onSubmit={onAddTask}>
      <input
        type="text"
        placeholder="Enter a new task..."
        value={newTaskTitle}
        onChange={(event) => setNewTaskTitle(event.target.value)}
      />

      <button type="submit">Add Task</button>
    </form>
  );
}

export default TaskForm;