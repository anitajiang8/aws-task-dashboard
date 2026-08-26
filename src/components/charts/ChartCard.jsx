/** Shared frame for every insights panel: title, optional note, body. */
function ChartCard({ kicker, title, note, legend, children, isEmpty, emptyMessage }) {
  return (
    <section className="chart-card">
      <div className="chart-card-header">
        <div>
          {kicker && <p className="card-kicker">{kicker}</p>}
          <h2>{title}</h2>
          {note && <p className="chart-note">{note}</p>}
        </div>

        {!isEmpty && legend}
      </div>

      {isEmpty ? (
        <p className="chart-empty">{emptyMessage}</p>
      ) : (
        <div className="chart-body">{children}</div>
      )}
    </section>
  );
}

export default ChartCard;
