import { useMemo } from "react";

import PageHeader from "../components/PageHeader";
import StatsCard from "../components/StatsCard";
import AreaChart from "../components/charts/AreaChart";
import CategoryBars from "../components/charts/CategoryBars";
import ChartCard from "../components/charts/ChartCard";
import Heatmap from "../components/charts/Heatmap";
import Legend from "../components/charts/Legend";
import PriorityMix from "../components/charts/PriorityMix";
import {
  byCategory,
  byPriority,
  completionsByDay,
  computeStreak,
  onTimeStats,
  totalXpEarned,
} from "../lib/stats";
import { useTaskStore } from "../store/taskStoreContext";

const TREND_DAYS = 30;

function InsightsPage() {
  const { tasks, completedTaskCount } = useTaskStore();

  const stats = useMemo(
    () => ({
      trend: completionsByDay(tasks, TREND_DAYS),
      streak: computeStreak(tasks),
      onTime: onTimeStats(tasks),
      priority: byPriority(tasks),
      categories: byCategory(tasks),
      xp: totalXpEarned(tasks),
    }),
    [tasks]
  );

  const trendTotal = stats.trend.reduce((sum, day) => sum + day.count, 0);
  const hasCompletions = completedTaskCount > 0;

  return (
    <section className="dashboard">
      <PageHeader
        eyebrow="Progress"
        title="How you&apos;re doing"
        subtitle="Everything below is measured from the quests you have finished. The trend covers the last 30 days; the grid covers the last 12 weeks."
      />

      <div className="stats-grid">
        <StatsCard
          iconClass="stat-icon-done"
          label="Quests finished"
          value={completedTaskCount}
          helper="All time"
        />
        <StatsCard
          iconClass="stat-icon-active"
          label="Current streak"
          value={stats.streak.current}
          helper={
            stats.streak.longest > 0
              ? `Best run: ${stats.streak.longest} days`
              : "Finish one to start a run"
          }
        />
        <StatsCard
          iconClass="stat-icon-high"
          label="Finished on time"
          value={stats.onTime.rate === null ? "—" : `${stats.onTime.rate}%`}
          helper={
            stats.onTime.scored === 0
              ? "Needs quests with due dates"
              : `${stats.onTime.onTime} of ${stats.onTime.scored} met the date`
          }
        />
        <StatsCard
          iconClass="stat-icon-total"
          label="XP earned"
          value={stats.xp}
          helper="50 XP per level"
        />
      </div>

      <ChartCard
        kicker="Momentum"
        title="Quests finished per day"
        note={`${trendTotal} in the last ${TREND_DAYS} days`}
        isEmpty={trendTotal === 0}
        emptyMessage="Nothing finished in the last 30 days yet. Complete a quest and it will show up here the same day."
      >
        <AreaChart data={stats.trend} />
      </ChartCard>

      <ChartCard
        kicker="Consistency"
        title="Your last 12 weeks"
        isEmpty={!hasCompletions}
        emptyMessage="No history yet. Each day you finish something, a square here gets darker."
      >
        <Heatmap tasks={tasks} />
      </ChartCard>

      <div className="insights-split">
        <ChartCard
          kicker="Workload"
          title="Priority mix"
          note="Solid is finished, faded is still open."
          legend={
            <Legend
              items={[
                { label: "Low", color: "var(--chart-low)" },
                { label: "Medium", color: "var(--chart-medium)" },
                { label: "High", color: "var(--chart-high)" },
              ]}
            />
          }
          isEmpty={tasks.length === 0}
          emptyMessage="Add a few quests to see how your workload splits by priority."
        >
          <PriorityMix rows={stats.priority} />
        </ChartCard>

        <ChartCard
          kicker="Focus"
          title="Top categories"
          note="By number of quests."
          isEmpty={stats.categories.length === 0}
          emptyMessage="Give your quests a category and the busiest ones will rank here."
        >
          <CategoryBars rows={stats.categories} />
        </ChartCard>
      </div>
    </section>
  );
}

export default InsightsPage;
