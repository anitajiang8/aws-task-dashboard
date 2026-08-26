const COLORS = {
  low: "var(--chart-low)",
  medium: "var(--chart-medium)",
  high: "var(--chart-high)",
};

/**
 * Stacked bar of open vs finished work per priority. Segments carry
 * direct value labels, which is also the required relief for the amber
 * step sitting under 3:1 against the card surface.
 */
function PriorityMix({ rows }) {
  const total = rows.reduce((sum, row) => sum + row.total, 0);

  return (
    <div className="priority-mix">
      {rows.map((row) => {
        const share = total === 0 ? 0 : (row.total / total) * 100;

        return (
          <div key={row.priority} className="priority-mix-row">
            <div className="priority-mix-label">
              <span className={`priority-badge ${row.priority}`}>
                {row.priority}
              </span>
              <span className="priority-mix-total">{row.total}</span>
            </div>

            <div className="priority-mix-track">
              <div
                className="priority-mix-bar"
                style={{ width: `${share}%` }}
                role="img"
                aria-label={`${row.priority} priority: ${row.done} done, ${row.active} open`}
              >
                <div
                  className="priority-mix-done"
                  style={{
                    flexGrow: row.done,
                    background: COLORS[row.priority],
                  }}
                >
                  {row.done > 0 && <span>{row.done}</span>}
                </div>

                <div
                  className="priority-mix-active"
                  style={{
                    flexGrow: row.active,
                    background: COLORS[row.priority],
                  }}
                >
                  {row.active > 0 && <span>{row.active}</span>}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default PriorityMix;
