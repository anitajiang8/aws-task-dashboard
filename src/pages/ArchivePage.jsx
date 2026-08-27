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
          <p className="card-kicker">Completed</p>
          <h1>The trophy shelf</h1>
          <p>
            Every quest you have finished. Restore one to put it back on your
            list. The XP you already earned stays yours either way.
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
          <span>Quests finished</span>
          <strong>{completedTaskCount}</strong>
          <p>All time</p>
        </div>

        <div className="archive-summary-card">
          <span>XP earned</span>
          <strong>{catProfile.totalXp}</strong>
          <p>50 XP per level</p>
        </div>

        <div className="archive-summary-card">
          <span>Treats banked</span>
          <strong>{catProfile.treats}</strong>
          <p>Spend them in the closet</p>
        </div>
      </div>

      <section className="archive-note-card">
        <div className="archive-note-icon" aria-hidden="true"></div>
        <div>
          <h2>Finished work stays out of the way.</h2>
          <p>
            Your quest log only shows what is still open. Everything you have
            completed lands here instead, so the list you work from stays short.
          </p>
        </div>
      </section>

      <TaskList
        title="Completed quests"
        subtitle="Most recently finished first."
        tasks={completedHistory}
        emptyMessage="Nothing finished yet. Complete a quest and it will land here."
        variant="completed"
        onRestoreTask={restoreTask}
        onDeleteTask={deleteTask}
        onUpdateTask={updateTask}
      />
    </section>
  );
}

export default ArchivePage;
