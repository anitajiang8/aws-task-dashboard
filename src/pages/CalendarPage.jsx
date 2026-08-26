import CalendarView from "../components/CalendarView";
import PageHeader from "../components/PageHeader";
import { useTaskStore } from "../store/taskStoreContext";

function CalendarPage() {
  const { activeTasks, completeTask, deleteTask, updateTask } = useTaskStore();

  return (
    <section className="dashboard">
      <PageHeader
        eyebrow="Plan ahead"
        title="Calendar"
        subtitle="Your active tasks laid out by due date, week by week or month by month."
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
