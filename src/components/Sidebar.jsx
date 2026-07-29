import { useEffect, useState } from "react";
import { NavLink } from "react-router";

function getSidebarLinkClass({ isActive }) {
  return isActive ? "sidebar-link active-sidebar-link" : "sidebar-link";
}

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  function closeSidebar() {
    setIsOpen(false);
  }

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  function handleNavClick() {
    // On mobile the sidebar is a full overlay, so navigating should close
    // it. On desktop it just sits beside the content, so leave it open.
    if (window.matchMedia("(max-width: 900px)").matches) {
      setIsOpen(false);
    }
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
        <div className="sidebar-inner">
          <div className="sidebar-header">
            <span className="sidebar-title">Purrductivity</span>

            <button
              type="button"
              className="sidebar-close"
              onClick={closeSidebar}
              aria-label="Collapse menu"
            >
              &times;
            </button>
          </div>

          <div className="sidebar-links">
            <NavLink end to="/" className={getSidebarLinkClass} onClick={handleNavClick}>
              Home
            </NavLink>

            <NavLink to="/tasks" className={getSidebarLinkClass} onClick={handleNavClick}>
              Tasks
            </NavLink>

            <NavLink
              to="/calendar"
              className={getSidebarLinkClass}
              onClick={handleNavClick}
            >
              Calendar
            </NavLink>

            <NavLink
              to="/archive"
              className={getSidebarLinkClass}
              onClick={handleNavClick}
            >
              Archive
            </NavLink>

            <NavLink to="/mochi" className={getSidebarLinkClass} onClick={handleNavClick}>
              Mochi
            </NavLink>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Sidebar;
