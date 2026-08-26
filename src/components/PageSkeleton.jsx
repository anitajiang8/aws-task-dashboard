/** Placeholder shown while the first load is in flight. */
function PageSkeleton() {
  return (
    <section className="dashboard" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading your quests…</span>

      <div className="skeleton-header">
        <div className="skeleton skeleton-line skeleton-eyebrow"></div>
        <div className="skeleton skeleton-line skeleton-title"></div>
        <div className="skeleton skeleton-line skeleton-subtitle"></div>
      </div>

      <div className="hero-grid">
        <div className="skeleton skeleton-card skeleton-card-tall"></div>
        <div className="skeleton skeleton-card skeleton-card-tall"></div>
      </div>

      <div className="stats-grid">
        {[0, 1, 2, 3].map((index) => (
          <div key={index} className="skeleton skeleton-card"></div>
        ))}
      </div>
    </section>
  );
}

export default PageSkeleton;
