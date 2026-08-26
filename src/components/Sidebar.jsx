import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router";

import HelpPanel from "./HelpPanel";

const NAV_ITEMS = [
  { to: "/", label: "Home", end: true },
  { to: "/tasks", label: "Tasks" },
  { to: "/calendar", label: "Calendar" },
  { to: "/insights", label: "Insights" },
  { to: "/archive", label: "Archive" },
  { to: "/mochi", label: "Mochi" },
];

function getSidebarLinkClass({ isActive }) {
  return isActive ? "sidebar-link active-sidebar-link" : "sidebar-link";
}

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const helpButtonRef = useRef(null);

  function closeSidebar() {
    setIsOpen(false);
  }

  function closeHelp() {
    setIsHelpOpen(false);
    // Send focus back to the control that opened the dialog.
    helpButtonRef.current?.focus();
  }

  useEffect(() => {
    // While the help dialog is open it owns Escape, so the sidebar
    // should not also collapse on the same keypress.
    if (!isOpen || isHelpOpen) {
      return undefined;
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isHelpOpen]);

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
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={getSidebarLinkClass}
                onClick={handleNavClick}
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="sidebar-footer">
            <button
              type="button"
              className="sidebar-help-button"
              onClick={() => setIsHelpOpen(true)}
              ref={helpButtonRef}
            >
              <span className="sidebar-help-mark" aria-hidden="true">
                ?
              </span>
              How it works
            </button>
          </div>
        </div>
      </nav>

      {isHelpOpen && <HelpPanel onClose={closeHelp} />}
    </>
  );
}

export default Sidebar;
