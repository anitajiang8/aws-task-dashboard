/**
 * Top categories by volume. Magnitude of a single measure, so one hue
 * throughout — colour is not carrying identity here, the row label is.
 * Completed portion is darker; the rest is the same hue at low opacity.
 */
function CategoryBars({ rows }) {
  const max = Math.max(1, ...rows.map((row) => row.total));

  return (
    <ul className="category-bars">
      {rows.map((row) => (
        <li key={row.name}>
          <div className="category-bar-head">
            <span className="category-bar-name">{row.name}</span>
            <span className="category-bar-value">
              {row.done}/{row.total} done
            </span>
          </div>

          <div
            className="category-bar-track"
            role="img"
            aria-label={`${row.name}: ${row.done} of ${row.total} complete`}
          >
            <div
              className="category-bar-total"
              style={{ width: `${(row.total / max) * 100}%` }}
            >
              <div
                className="category-bar-done"
                style={{
                  width: row.total === 0 ? 0 : `${(row.done / row.total) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default CategoryBars;
