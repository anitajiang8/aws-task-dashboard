import TaskItem from "./TaskItem";

function TaskList({ tasks, onToggleComplete, onDeleteTask }) {
  return (
    <section className="task-list">
      <h2>Tasks</h2>

      {tasks.length === 0 ? (
        <p className="empty-message">No tasks yet. Add one above.</p>
      ) : (
        tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggleComplete={onToggleComplete}
            onDeleteTask={onDeleteTask}
          />
        ))
      )}
    </section>
  );
}

export default TaskList;