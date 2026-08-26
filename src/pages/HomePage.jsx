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
        eyebrow="Dashboard"
        title="Purrductivity"
        subtitle="A task list that pays you. Finish a quest to earn XP and treats, then spend them spoiling Mochi. New here? Open “How it works” in the sidebar."
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
          <h2>Finish a task, feed the cat.</h2>
          <p>
            Every completed quest pays XP and treats. XP levels Mochi up;
            treats buy what she wears. Tap her to open the closet.
          </p>
        </section>
      </div>

      <div className="stats-grid">
        <StatsCard
          iconClass="stat-icon-total"
          label="Total Quests"
          value={totalTasks}
          helper="Created all time"
        />
        <StatsCard
          iconClass="stat-icon-active"
          label="Active"
          value={activeTaskCount}
          helper="Open right now"
        />
        <StatsCard
          iconClass="stat-icon-done"
          label="Completed"
          value={completedTaskCount}
          helper="Sitting in the archive"
        />
        <StatsCard
          iconClass="stat-icon-high"
          label="High Priority"
          value={highPriorityCount}
          helper="Worth +15 XP each"
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
            Nothing scheduled. Add a quest on the Tasks page and it will show
            up here once it has a due date.
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
