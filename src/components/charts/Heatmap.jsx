import { useMemo, useState } from "react";

import { addDays, startOfDay, toIsoDate } from "../../lib/dates";
import { completedOn } from "../../lib/stats";
import { isDone } from "../../lib/tasks";

const WEEKS = 12;
const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

/** Which of the five ramp steps a day's count falls into. */
function levelFor(count, max) {
  if (count === 0) return 0;
  if (max <= 1) return 4;
  return Math.min(4, Math.ceil((count / max) * 4));
}

/**
 * Contribution-style consistency grid. Sequential encoding: one hue,
 * light to dark, so darker always means more.
 */
function Heatmap({ tasks, today = new Date() }) {
  const [hover, setHover] = useState(null);

  const { weeks, max } = useMemo(() => {
    const counts = new Map();
    tasks.filter(isDone).forEach((task) => {
      const iso = completedOn(task);
      if (!iso) return;
      counts.set(iso, (counts.get(iso) || 0) + 1);
    });

    // End on the Saturday of the current week so columns are whole weeks.
    const end = startOfDay(today);
    const endOfWeek = addDays(end, 6 - end.getDay());
    const start = addDays(endOfWeek, -(WEEKS * 7 - 1));

    const cells = Array.from({ length: WEEKS * 7 }, (_, i) => {
      const date = addDays(start, i);
      const iso = toIsoDate(date);
      return { iso, count: counts.get(iso) || 0, isFuture: date > end };
    });

    const grid = Array.from({ length: WEEKS }, (_, w) =>
      cells.slice(w * 7, w * 7 + 7)
    );

    return { weeks: grid, max: Math.max(0, ...cells.map((c) => c.count)) };
  }, [tasks, today]);

  return (
    <div className="heatmap-wrap">
      <div className="heatmap-day-labels" aria-hidden="true">
        {DAY_LABELS.map((label, i) => (
          <span key={i}>{label}</span>
        ))}
      </div>

      <div className="heatmap-grid" role="img" aria-label="Daily completion history for the last 12 weeks">
        {weeks.map((week, wi) => (
          <div key={wi} className="heatmap-week">
            {week.map((cell) => (
              <div
                key={cell.iso}
                className={`heatmap-cell${cell.isFuture ? " heatmap-cell-future" : ""}`}
                style={
                  cell.isFuture
                    ? undefined
                    : { background: `var(--heat-${levelFor(cell.count, max)})` }
                }
                onMouseEnter={() => !cell.isFuture && setHover(cell)}
                onMouseLeave={() => setHover(null)}
              ></div>
            ))}
          </div>
        ))}
      </div>

      <div className="heatmap-footer">
        <p className="heatmap-hint">
          {hover
            ? `${hover.iso}: ${hover.count} ${
                hover.count === 1 ? "quest" : "quests"
              }`
            : "Each square is one day. Hover for the count."}
        </p>

        <div className="heatmap-scale">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <span
              key={level}
              className="heatmap-cell heatmap-scale-cell"
              style={{ background: `var(--heat-${level})` }}
            ></span>
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
}

export default Heatmap;
