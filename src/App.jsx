import { Outlet, Route, Routes } from "react-router";

import Sidebar from "./components/Sidebar";
import ArchivePage from "./pages/ArchivePage";
import CalendarPage from "./pages/CalendarPage";
import HomePage from "./pages/HomePage";
import MochiPage from "./pages/MochiPage";
import TasksPage from "./pages/TasksPage";
import { TaskStoreProvider } from "./store/TaskStoreProvider";
import "./App.css";

function AppLayout() {
  return (
    <div className="app-shell">
      <Sidebar />

      <main className="app">
        <Outlet />
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
          <Route path="/archive" element={<ArchivePage />} />
          <Route path="/mochi" element={<MochiPage />} />
          <Route path="*" element={<HomePage />} />
        </Route>
      </Routes>
    </TaskStoreProvider>
  );
}

export default App;
