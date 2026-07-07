function StatsCard({ icon, label, value, helper }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>

      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        {helper && <p>{helper}</p>}
      </div>
    </div>
  );
}

export default StatsCard;