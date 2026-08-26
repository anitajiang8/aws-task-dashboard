import { useId, useState } from "react";

import { formatIsoDateShort } from "../../lib/dates";

const WIDTH = 720;
const HEIGHT = 200;
const PAD = { top: 16, right: 12, bottom: 26, left: 32 };

/**
 * Completions over time. One series, so no legend box — the panel title
 * names it. Hovering snaps a crosshair to the nearest day.
 */
function AreaChart({ data }) {
  const gradientId = useId();
  const [hoverIndex, setHoverIndex] = useState(null);

  const plotWidth = WIDTH - PAD.left - PAD.right;
  const plotHeight = HEIGHT - PAD.top - PAD.bottom;

  const maxCount = Math.max(1, ...data.map((d) => d.count));
  // Whole-number ticks only; a count of 2.5 tasks is meaningless.
  const tickCount = Math.min(maxCount, 4);
  const ticks = Array.from({ length: tickCount + 1 }, (_, i) =>
    Math.round((maxCount / tickCount) * i)
  ).filter((v, i, arr) => arr.indexOf(v) === i);

  const x = (i) =>
    PAD.left + (data.length === 1 ? plotWidth / 2 : (i / (data.length - 1)) * plotWidth);
  const y = (v) => PAD.top + plotHeight - (v / maxCount) * plotHeight;

  const linePoints = data.map((d, i) => `${x(i)},${y(d.count)}`).join(" ");
  const areaPoints = `${PAD.left},${PAD.top + plotHeight} ${linePoints} ${
    PAD.left + plotWidth
  },${PAD.top + plotHeight}`;

  const active = hoverIndex === null ? null : data[hoverIndex];

  function handleMove(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    const index = Math.round(ratio * WIDTH - PAD.left) / plotWidth;
    const clamped = Math.round(index * (data.length - 1));
    setHoverIndex(Math.max(0, Math.min(data.length - 1, clamped)));
  }

  return (
    <div className="chart-hoverable">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="chart-svg"
        role="img"
        aria-label={`Quests completed per day over the last ${data.length} days`}
        onMouseMove={handleMove}
        onMouseLeave={() => setHoverIndex(null)}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--btn-primary)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--btn-primary)" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Recessive gridlines and value labels. */}
        {ticks.map((tick) => (
          <g key={tick}>
            <line
              x1={PAD.left}
              x2={PAD.left + plotWidth}
              y1={y(tick)}
              y2={y(tick)}
              stroke="var(--chart-grid)"
              strokeWidth="1"
            />
            <text x={PAD.left - 8} y={y(tick) + 4} className="chart-tick" textAnchor="end">
              {tick}
            </text>
          </g>
        ))}

        <polygon points={areaPoints} fill={`url(#${gradientId})`} />
        <polyline
          points={linePoints}
          fill="none"
          stroke="var(--btn-primary)"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {active && (
          <g>
            <line
              x1={x(hoverIndex)}
              x2={x(hoverIndex)}
              y1={PAD.top}
              y2={PAD.top + plotHeight}
              stroke="var(--accent-soft)"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            {/* 2px surface ring so the marker reads against the fill. */}
            <circle
              cx={x(hoverIndex)}
              cy={y(active.count)}
              r="5"
              fill="var(--btn-primary)"
              stroke="var(--surface)"
              strokeWidth="2"
            />
          </g>
        )}

        {/* First and last day only — never a label on every point. */}
        <text x={PAD.left} y={HEIGHT - 6} className="chart-tick" textAnchor="start">
          {formatIsoDateShort(data[0]?.iso)}
        </text>
        <text
          x={PAD.left + plotWidth}
          y={HEIGHT - 6}
          className="chart-tick"
          textAnchor="end"
        >
          {formatIsoDateShort(data[data.length - 1]?.iso)}
        </text>
      </svg>

      {active && (
        <div
          className="chart-tooltip"
          style={{ left: `${(x(hoverIndex) / WIDTH) * 100}%` }}
        >
          <strong>{formatIsoDateShort(active.iso)}</strong>
          <span>
            {active.count} {active.count === 1 ? "quest" : "quests"}
            {active.xp > 0 && ` · ${active.xp} XP`}
          </span>
        </div>
      )}
    </div>
  );
}

export default AreaChart;
