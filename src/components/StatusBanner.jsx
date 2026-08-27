import { useTaskStore } from "../store/taskStoreContext";

/**
 * Surfaces API trouble instead of leaving it in the console. A failed
 * load is blocking (nothing you see is real); a failed save is not
 * (your changes are on screen, just not persisted yet).
 */
function StatusBanner() {
  const { loadError, saveError, retryLoad } = useTaskStore();

  if (loadError) {
    return (
      <div className="status-banner status-banner-error" role="alert">
        <div>
          <strong>Could not reach the server.</strong>
          <p>
            You are looking at sample quests, and nothing you change will be
            saved.
          </p>
        </div>

        <button type="button" onClick={retryLoad}>
          Try again
        </button>
      </div>
    );
  }

  if (saveError) {
    return (
      <div className="status-banner status-banner-warning" role="status">
        <div>
          <strong>Changes aren&apos;t being saved.</strong>
          <p>
            The last save failed. Your work is still on screen, and it will
            retry on your next change.
          </p>
        </div>
      </div>
    );
  }

  return null;
}

export default StatusBanner;
