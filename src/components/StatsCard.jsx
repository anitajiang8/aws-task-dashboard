function StatsCard({ iconClass, label, value, helper }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">
        <span className={`stat-icon-mark ${iconClass}`} aria-hidden="true"></span>
      </div>

      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        {helper && <p>{helper}</p>}
      </div>
    </div>
  );
}

export default StatsCard;