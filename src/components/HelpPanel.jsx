import { useEffect, useRef } from "react";

import {
  PRIORITIES,
  PRIORITY_REWARDS,
  XP_PER_LEVEL,
  getTreatReward,
} from "../lib/constants";
import { ACCESSORIES } from "../lib/accessories";

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * "How it works" dialog. The reward numbers are read from the same
 * constants the app scores with, so the explanation cannot drift out of
 * sync with the actual economy.
 */
function HelpPanel({ onClose }) {
  const panelRef = useRef(null);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return undefined;

    // Move focus into the dialog so keyboard users start inside it.
    panel.querySelector(FOCUSABLE)?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      // Trap Tab inside the dialog.
      const items = Array.from(panel.querySelectorAll(FOCUSABLE));
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    panel.addEventListener("keydown", handleKeyDown);
    return () => panel.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const purchasable = ACCESSORIES.filter((item) => item.id !== "none");

  return (
    <div className="help-overlay" onClick={onClose}>
      <div
        className="help-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-panel-title"
        ref={panelRef}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="help-panel-header">
          <div>
            <p className="card-kicker">Getting started</p>
            <h2 id="help-panel-title">How Purrductivity works</h2>
          </div>

          <button
            type="button"
            className="help-close"
            onClick={onClose}
            aria-label="Close help"
          >
            &times;
          </button>
        </div>

        <div className="help-panel-body">
          <section className="help-section">
            <h3>1. Add a quest</h3>
            <p>
              A quest is just a task. Give it a title on the Tasks page, then
              optionally set a priority, a due date, and a category. Priority is
              the only field that changes what you earn.
            </p>
          </section>

          <section className="help-section">
            <h3>2. Finish it to get paid</h3>
            <p>
              Completing a quest awards XP and treats based on its priority:
            </p>

            <table className="help-table">
              <thead>
                <tr>
                  <th>Priority</th>
                  <th>XP</th>
                  <th>Treats</th>
                </tr>
              </thead>
              <tbody>
                {PRIORITIES.map((priority) => (
                  <tr key={priority}>
                    <td>
                      <span className={`priority-badge ${priority}`}>
                        {priority}
                      </span>
                    </td>
                    <td>+{PRIORITY_REWARDS[priority]}</td>
                    <td>+{getTreatReward(PRIORITY_REWARDS[priority])}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="help-note">
              Each quest only pays out once. Restoring a completed quest from
              the Archive and finishing it again will not pay you twice.
            </p>
          </section>

          <section className="help-section">
            <h3>3. XP levels Mochi up</h3>
            <p>
              Every {XP_PER_LEVEL} XP raises Mochi&apos;s level by one. Levels
              are permanent and unlock the fancier items in her closet.
            </p>
          </section>

          <section className="help-section">
            <h3>4. Treats buy accessories</h3>
            <p>
              Treats are the currency. Spend them in Mochi&apos;s closet. An
              item shows up once you are the right level, and you still need
              enough treats to buy it.
            </p>

            <table className="help-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Unlocks at</th>
                  <th>Cost</th>
                </tr>
              </thead>
              <tbody>
                {purchasable.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>Level {item.unlockLevel}</td>
                    <td>{item.treatCost} treats</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="help-section">
            <h3>Where things live</h3>
            <ul className="help-list">
              <li>
                <strong>Home</strong>: Mochi, your totals, and what is due next.
              </li>
              <li>
                <strong>Tasks</strong>: add, filter, search, and complete quests.
              </li>
              <li>
                <strong>Calendar</strong>: active quests by due date.
              </li>
              <li>
                <strong>Archive</strong>: finished quests, restorable any time.
              </li>
              <li>
                <strong>Mochi</strong>: her room and her closet.
              </li>
            </ul>
          </section>

          <section className="help-section">
            <h3>Keyboard</h3>
            <ul className="help-list">
              <li>
                <kbd>Esc</kbd> closes this panel, or collapses the sidebar.
              </li>
              <li>
                <kbd>Tab</kbd> moves between controls. The focused one is
                outlined.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

export default HelpPanel;
