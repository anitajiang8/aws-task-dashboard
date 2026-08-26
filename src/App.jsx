import { Outlet, Route, Routes } from "react-router";

import PageSkeleton from "./components/PageSkeleton";
import Sidebar from "./components/Sidebar";
import StatusBanner from "./components/StatusBanner";
import ArchivePage from "./pages/ArchivePage";
import CalendarPage from "./pages/CalendarPage";
import HomePage from "./pages/HomePage";
import InsightsPage from "./pages/InsightsPage";
import MochiPage from "./pages/MochiPage";
import TasksPage from "./pages/TasksPage";
import { TaskStoreProvider } from "./store/TaskStoreProvider";
import { useTaskStore } from "./store/taskStoreContext";
import "./App.css";

function AppLayout() {
  const { isLoading } = useTaskStore();

  return (
    <div className="app-shell">
      <Sidebar />

      <main className="app">
        <StatusBanner />
        {isLoading ? <PageSkeleton /> : <Outlet />}
      </main>
    </div>
  );
}

function App() {
  return (
    <TaskStoreProvider>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/archive" element={<ArchivePage />} />
          <Route path="/mochi" element={<MochiPage />} />
          <Route path="*" element={<HomePage />} />
        </Route>
      </Routes>
    </TaskStoreProvider>
  );
}

export default App;
