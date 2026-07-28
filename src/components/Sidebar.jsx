import { useState } from "react";
import { NavLink } from "react-router";

function getSidebarLinkClass({ isActive }) {
  return isActive ? "sidebar-link active-sidebar-link" : "sidebar-link";
}

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  function closeSidebar() {
    setIsOpen(false);
  }

  return (
    <>
      {!isOpen && (
        <button
          type="button"
          className="sidebar-hamburger"
          onClick={() => setIsOpen(true)}
          aria-label="Open menu"
        >
          <span className="sidebar-hamburger-bar"></span>
          <span className="sidebar-hamburger-bar"></span>
          <span className="sidebar-hamburger-bar"></span>
        </button>
      )}

      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
          aria-hidden="true"
        ></div>
      )}

      <nav
        className={`sidebar ${isOpen ? "sidebar-open" : ""}`}
        aria-label="Main navigation"
      >
        <div className="sidebar-header">
          <span className="sidebar-title">Purrductivity</span>

          <button
            type="button"
            className="sidebar-close"
            onClick={closeSidebar}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <div className="sidebar-links">
          <NavLink end to="/" className={getSidebarLinkClass} onClick={closeSidebar}>
            Home
          </NavLink>

          <NavLink to="/tasks" className={getSidebarLinkClass} onClick={closeSidebar}>
            Tasks
          </NavLink>

          <NavLink
            to="/calendar"
            className={getSidebarLinkClass}
            onClick={closeSidebar}
          >
            Calendar
          </NavLink>

          <NavLink to="/archive" className={getSidebarLinkClass} onClick={closeSidebar}>
            Archive
          </NavLink>

          <NavLink to="/mochi" className={getSidebarLinkClass} onClick={closeSidebar}>
            Mochi
          </NavLink>
        </div>
      </nav>
    </>
  );
}

export default Sidebar;
