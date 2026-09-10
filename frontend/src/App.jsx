import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import ApisPage from "./pages/ApisPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MonitoringLogs from "./pages/MonitoringLogs";
import IncidentReports from "./pages/IncidentReports";
import AlertHistory from "./pages/AlertHistory";

function App() {
  // useLocation tells us the current URL path, so we can decide
  // whether to show the navbar or not (we hide it on the login/register screens).
  const location = useLocation();
  const hideNavbarOn = ["/", "/register"];
  const showNavbar = !hideNavbarOn.includes(location.pathname);

  return (
    <div>
      {showNavbar && <Navbar />}

      {/* Routes decides which page component to show based on the URL.
          "/" is now the Login page — it's the first thing visitors see. */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/apis" element={<ApisPage />} />
        <Route path="/logs" element={<MonitoringLogs />} />
        <Route path="/incidents" element={<IncidentReports />} />
        <Route path="/alerts" element={<AlertHistory />} />
      </Routes>
    </div>
  );
}

export default App;
