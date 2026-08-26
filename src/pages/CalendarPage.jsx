import CalendarView from "../components/CalendarView";
import PageHeader from "../components/PageHeader";
import { useTaskStore } from "../store/taskStoreContext";

function CalendarPage() {
  const { activeTasks, completeTask, deleteTask, updateTask } = useTaskStore();

  return (
    <section className="dashboard">
      <PageHeader
        eyebrow="Schedule"
        title="What&apos;s due when"
        subtitle="Only open quests appear here, placed on their due date. Anything without a due date is listed underneath the grid."
      />

      <section className="task-list calendar-page-card">
        <CalendarView
          tasks={activeTasks}
          onCompleteTask={completeTask}
          onDeleteTask={deleteTask}
          onUpdateTask={updateTask}
        />
      </section>
    </section>
  );
}

export default CalendarPage;
