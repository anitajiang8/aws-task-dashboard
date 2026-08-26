import TaskList from "../components/TaskList";
import { useTaskStore } from "../store/taskStoreContext";

function ArchivePage() {
  const {
    completedHistory,
    completedTaskCount,
    catProfile,
    restoreTask,
    deleteTask,
    updateTask,
  } = useTaskStore();

  return (
    <section className="dashboard archive-page">
      <section className="archive-hero">
        <div className="archive-hero-copy">
          <p className="card-kicker">Mochi&apos;s scrapbook</p>
          <h1>Archived Tasks</h1>
          <p>
            Every completed quest lives here. Restore a task when you need it
            back, or delete it when you are ready to clear the shelf.
          </p>
        </div>

        <div className="archive-hero-art" aria-hidden="true">
          <span className="archive-art-sparkle archive-art-sparkle-one"></span>
          <span className="archive-art-sparkle archive-art-sparkle-two"></span>
          <div className="archive-yarn-ball"></div>
          <div className="archive-paw-card"></div>
        </div>
      </section>

      <div className="archive-summary-grid">
        <div className="archive-summary-card">
          <span>Completed Quests</span>
          <strong>{completedTaskCount}</strong>
          <p>Finished and saved</p>
        </div>

        <div className="archive-summary-card">
          <span>Mochi&apos;s XP</span>
          <strong>{catProfile.totalXp}</strong>
          <p>Total progress earned</p>
        </div>

        <div className="archive-summary-card">
          <span>Treats Earned</span>
          <strong>{catProfile.treats}</strong>
          <p>Rewards for Mochi</p>
        </div>
      </div>

      <section className="archive-note-card">
        <div className="archive-note-icon" aria-hidden="true"></div>
        <div>
          <h2>Completed quests stay out of your way.</h2>
          <p>
            The Tasks page only shows active tasks. This archive keeps your
            finished work organised without making the main page feel crowded.
          </p>
        </div>
      </section>

      <TaskList
        title="Completed History"
        subtitle="An archive of everything you have already finished."
        tasks={completedHistory}
        emptyMessage="No completed tasks yet. Mochi is waiting for treats."
        variant="completed"
        onRestoreTask={restoreTask}
        onDeleteTask={deleteTask}
        onUpdateTask={updateTask}
      />
    </section>
  );
}

export default ArchivePage;
