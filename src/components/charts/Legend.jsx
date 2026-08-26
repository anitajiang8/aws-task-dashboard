/**
 * Identity is never carried by colour alone: the swatch always sits
 * beside a text label.
 */
function Legend({ items }) {
  return (
    <ul className="chart-legend">
      {items.map((item) => (
        <li key={item.label}>
          <span
            className="chart-legend-swatch"
            style={{ background: item.color }}
            aria-hidden="true"
          ></span>
          {item.label}
        </li>
      ))}
    </ul>
  );
}

export default Legend;
