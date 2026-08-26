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
        subtitle="A task list that pays you. Every quest you finish earns XP and treats — XP levels Mochi up, treats buy what she wears. New here? Open “How it works” in the sidebar."
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
          <p className="card-kicker">At a glance</p>
          <h2>Finish a task, feed the cat.</h2>

          <div className="overview-stats">
            <StatsCard
              iconClass="stat-icon-total"
              label="Total"
              value={totalTasks}
              to="/tasks"
            />
            <StatsCard
              iconClass="stat-icon-active"
              label="Open"
              value={activeTaskCount}
              to="/tasks"
            />
            <StatsCard
              iconClass="stat-icon-done"
              label="Done"
              value={completedTaskCount}
              to="/archive"
            />
            <StatsCard
              iconClass="stat-icon-high"
              label="High"
              value={highPriorityCount}
              to="/tasks?priority=high"
            />
          </div>

          <div className="overview-next">
            <div className="overview-next-header">
              <h3>Next up</h3>
              <NavLink to="/tasks" className="text-page-link">
                See all
              </NavLink>
            </div>

            {nextUpTasks.length === 0 ? (
              <p className="empty-message">
                No open quests. Add one and it will show up here.
              </p>
            ) : (
              <div className="next-up-list">
                {nextUpTasks.map((task) => (
                  <div key={task.id} className="next-up-item">
                    <span>{task.title}</span>
                    <span
                      className={`priority-badge ${task.priority || "medium"}`}
                    >
                      {task.priority || "medium"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </section>
  );
}

export default HomePage;
