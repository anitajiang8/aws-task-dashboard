import { useState } from "react";

import {
  WEEKDAY_LABELS as FULL_WEEKDAY_LABELS,
  addDays,
  addMonths,
  getMonthGridDays,
  getWeekDays,
  toIsoDate,
} from "../lib/dates";
import TaskItem from "./TaskItem";

const WEEKDAY_LABELS = FULL_WEEKDAY_LABELS;
const MAX_CHIPS_PER_MONTH_CELL = 3;

function getRangeLabel(viewMode, referenceDate) {
  if (viewMode === "day") {
    return referenceDate.toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

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

function CalendarView({ tasks, onCompleteTask, onDeleteTask, onUpdateTask }) {
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
    viewMode === "week" ? getWeekDays(referenceDate) : getMonthGridDays(referenceDate);

  function goToPrevious() {
    setReferenceDate((current) => {
      if (viewMode === "month") {
        return addMonths(current, -1);
      }

      return addDays(current, viewMode === "week" ? -7 : -1);
    });
  }

  function goToNext() {
    setReferenceDate((current) => {
      if (viewMode === "month") {
        return addMonths(current, 1);
      }

      return addDays(current, viewMode === "week" ? 7 : 1);
    });
  }

  function goToDay(day) {
    setReferenceDate(day);
    setViewMode("day");
  }

  const dayViewTasks = tasksByDate[toIsoDate(referenceDate)] || [];

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

          <button
            type="button"
            className={viewMode === "day" ? "active-filter" : ""}
            onClick={() => setViewMode("day")}
          >
            Day
          </button>
        </div>

        <div className="calendar-nav">
          <button
            type="button"
            className="calendar-nav-button"
            onClick={goToPrevious}
            aria-label={`Previous ${viewMode}`}
          >
            ‹
          </button>

          <span className="calendar-label">{getRangeLabel(viewMode, referenceDate)}</span>

          <button
            type="button"
            className="calendar-nav-button"
            onClick={goToNext}
            aria-label={`Next ${viewMode}`}
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

      {viewMode === "day" ? (
        <div className="calendar-day-view">
          {dayViewTasks.length === 0 ? (
            <p className="empty-message">No tasks due this day.</p>
          ) : (
            <div className="task-stack">
              {dayViewTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  variant="active"
                  onCompleteTask={onCompleteTask}
                  onDeleteTask={onDeleteTask}
                  onUpdateTask={onUpdateTask}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
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
              <button
                type="button"
                key={iso}
                className={`calendar-day ${isToday ? "calendar-day-today" : ""} ${
                  isOutsideMonth ? "calendar-day-outside" : ""
                }`}
                onClick={() => goToDay(day)}
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
              </button>
            );
          })}
        </div>
      )}

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
