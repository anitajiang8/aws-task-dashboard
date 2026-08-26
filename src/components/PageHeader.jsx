/**
 * The single page-heading pattern. Every route renders one of these so
 * eyebrow, title, and subtitle stay consistent across the app.
 */
function PageHeader({ eyebrow, title, subtitle, actions }) {
  return (
    <header className="header">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1>{title}</h1>
      {subtitle && <p className="subtitle">{subtitle}</p>}
      {actions && <div className="header-actions">{actions}</div>}
    </header>
  );
}

export default PageHeader;
