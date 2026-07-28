import { useState } from "react";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_GRID_LENGTH = 42;
const MAX_CHIPS_PER_MONTH_CELL = 3;

function toIsoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function startOfWeek(date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  result.setDate(result.getDate() - result.getDay());
  return result;
}

function addDays(date, amount) {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
}

function addMonths(date, amount) {
  const result = new Date(date);
  result.setMonth(result.getMonth() + amount);
  return result;
}

function getMonthGridDays(referenceDate) {
  const firstOfMonth = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    1
  );
  const gridStart = startOfWeek(firstOfMonth);

  return Array.from({ length: MONTH_GRID_LENGTH }, (_, index) =>
    addDays(gridStart, index)
  );
}

function getWeekDays(referenceDate) {
  const weekStart = startOfWeek(referenceDate);
  return Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
}

function getRangeLabel(viewMode, referenceDate) {
  if (viewMode === "month") {
    return referenceDate.toLocaleDateString(undefined, {
      month: "long",
      year: "numeric",
    });
  }

  const [start, end] = [getWeekDays(referenceDate)[0], getWeekDays(referenceDate)[6]];

  const startLabel = start.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
  const endLabel = end.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return `${startLabel} – ${endLabel}`;
}

function CalendarView({ tasks }) {
  const [viewMode, setViewMode] = useState("month");
  const [referenceDate, setReferenceDate] = useState(() => new Date());

  const todayIso = toIsoDate(new Date());

  const tasksByDate = {};
  const undatedTasks = [];

  tasks.forEach((task) => {
    if (!task.dueDate) {
      undatedTasks.push(task);
      return;
    }

    if (!tasksByDate[task.dueDate]) {
      tasksByDate[task.dueDate] = [];
    }

    tasksByDate[task.dueDate].push(task);
  });

  const days =
    viewMode === "month" ? getMonthGridDays(referenceDate) : getWeekDays(referenceDate);

  function goToPrevious() {
    setReferenceDate((current) =>
      viewMode === "month" ? addMonths(current, -1) : addDays(current, -7)
    );
  }

  function goToNext() {
    setReferenceDate((current) =>
      viewMode === "month" ? addMonths(current, 1) : addDays(current, 7)
    );
  }

  return (
    <div className="calendar-view">
      <div className="calendar-toolbar">
        <div className="filter-bar">
          <button
            type="button"
            className={viewMode === "month" ? "active-filter" : ""}
            onClick={() => setViewMode("month")}
          >
            Month
          </button>

          <button
            type="button"
            className={viewMode === "week" ? "active-filter" : ""}
            onClick={() => setViewMode("week")}
          >
            Week
          </button>
        </div>

        <div className="calendar-nav">
          <button
            type="button"
            className="calendar-nav-button"
            onClick={goToPrevious}
            aria-label={viewMode === "month" ? "Previous month" : "Previous week"}
          >
            ‹
          </button>

          <span className="calendar-label">{getRangeLabel(viewMode, referenceDate)}</span>

          <button
            type="button"
            className="calendar-nav-button"
            onClick={goToNext}
            aria-label={viewMode === "month" ? "Next month" : "Next week"}
          >
            ›
          </button>

          <button
            type="button"
            className="text-page-link"
            onClick={() => setReferenceDate(new Date())}
          >
            Today
          </button>
        </div>
      </div>

      <div className={`calendar-grid calendar-grid-${viewMode}`}>
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="calendar-weekday">
            {label}
          </div>
        ))}

        {days.map((day) => {
          const iso = toIsoDate(day);
          const dayTasks = tasksByDate[iso] || [];
          const isToday = iso === todayIso;
          const isOutsideMonth =
            viewMode === "month" && day.getMonth() !== referenceDate.getMonth();
          const visibleTasks =
            viewMode === "month"
              ? dayTasks.slice(0, MAX_CHIPS_PER_MONTH_CELL)
              : dayTasks;

          return (
            <div
              key={iso}
              className={`calendar-day ${isToday ? "calendar-day-today" : ""} ${
                isOutsideMonth ? "calendar-day-outside" : ""
              }`}
            >
              <span className="calendar-day-number">{day.getDate()}</span>

              <div className="calendar-day-tasks">
                {visibleTasks.map((task) => (
                  <span
                    key={task.id}
                    className={`calendar-task-chip priority-${task.priority || "medium"}`}
                    title={task.title}
                  >
                    {task.title}
                  </span>
                ))}

                {viewMode === "month" && dayTasks.length > MAX_CHIPS_PER_MONTH_CELL && (
                  <span className="calendar-task-more">
                    +{dayTasks.length - MAX_CHIPS_PER_MONTH_CELL} more
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {undatedTasks.length > 0 && (
        <div className="calendar-undated">
          <p className="card-kicker">No due date</p>

          <div className="calendar-undated-list">
            {undatedTasks.map((task) => (
              <span
                key={task.id}
                className={`calendar-task-chip priority-${task.priority || "medium"}`}
              >
                {task.title}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CalendarView;
