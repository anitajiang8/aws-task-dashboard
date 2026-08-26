import { NavLink } from "react-router";

import CatCompanion from "../components/CatCompanion";
import PageHeader from "../components/PageHeader";
import StatsCard from "../components/StatsCard";
import { useTaskStore } from "../store/taskStoreContext";

function HomePage() {
  const {
    catProfile,
    accessories,
    totalTasks,
    activeTaskCount,
    completedTaskCount,
    highPriorityCount,
    nextUpTasks,
  } = useTaskStore();

  return (
    <section className="dashboard">
      <PageHeader
        title="Purrductivity"
        subtitle="Feed Mochi by getting things done. Finish a quest, earn XP and treats, and spend them dressing up the world's most spoiled cat."
      />

      <div className="hero-grid">
        <NavLink
          to="/mochi"
          className="dashboard-mochi-link"
          aria-label="Open Mochi's closet"
        >
          <CatCompanion
            catProfile={catProfile}
            accessories={accessories}
            completedTaskCount={completedTaskCount}
            showCloset={false}
          />
        </NavLink>

        <section className="focus-card">
          <p className="card-kicker">Today&apos;s quest</p>
          <h2>Finish tasks, earn treats, and help Mochi grow.</h2>
          <p>
            Complete active tasks to collect XP. Click Mochi to visit her
            closet, view rewards, and customize her accessories.
          </p>
        </section>
      </div>

      <div className="stats-grid">
        <StatsCard
          iconClass="stat-icon-total"
          label="Total Quests"
          value={totalTasks}
          helper="All tasks created"
        />
        <StatsCard
          iconClass="stat-icon-active"
          label="Active"
          value={activeTaskCount}
          helper="Still waiting for you"
        />
        <StatsCard
          iconClass="stat-icon-done"
          label="Completed"
          value={completedTaskCount}
          helper="Saved in archive"
        />
        <StatsCard
          iconClass="stat-icon-high"
          label="High Priority"
          value={highPriorityCount}
          helper="Needs extra focus"
        />
      </div>

      <div className="paw-divider">
        <span className="paw-divider-mark"></span>
      </div>

      <section className="task-list">
        <div className="task-list-header">
          <div>
            <p className="card-kicker">Coming up</p>
            <h2>Next up</h2>
          </div>

          <NavLink to="/tasks" className="text-page-link">
            See all tasks
          </NavLink>
        </div>

        {nextUpTasks.length === 0 ? (
          <p className="empty-message">
            No active tasks yet, add one from the Tasks page!
          </p>
        ) : (
          <div className="next-up-list">
            {nextUpTasks.map((task) => (
              <div key={task.id} className="next-up-item">
                <span>{task.title}</span>
                <span className={`priority-badge ${task.priority || "medium"}`}>
                  {task.priority || "medium"}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}

export default HomePage;
