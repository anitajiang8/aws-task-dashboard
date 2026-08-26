import { NavLink } from "react-router";

/**
 * A labelled figure. Pass `to` to make the whole card a link — used by the
 * home page overview panel, where each tile jumps to the page it summarises.
 */
function StatsCard({ iconClass, label, value, helper, to }) {
  const body = (
    <>
      <div className={`stat-icon ${iconClass}`}>
        <span className={`stat-icon-mark ${iconClass}`} aria-hidden="true"></span>
      </div>

      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        {helper && <p>{helper}</p>}
      </div>
    </>
  );

  if (to) {
    return (
      <NavLink to={to} className="stat-card stat-card-link">
        {body}
      </NavLink>
    );
  }

  return <div className="stat-card">{body}</div>;
}

export default StatsCard;
