import { Link, useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";

function Navbar() {
  const navigate = useNavigate();

  function handleLogout() {
    logout(); 
    navigate("/");
  }

  return (
    <nav className="navbar white-background card-shadow padding-horizontal-large padding-vertical-medium">
      <Link className="navbar-brand bold-text brand-name" to="/dashboard">
        MonitorIQ
      </Link>

      <div className="margin-left-auto flex-row medium-gap wrap-items">
        <Link to="/dashboard" className="nav-link">
          Dashboard
        </Link>
        <Link to="/apis" className="nav-link">
          APIs
        </Link>
        <Link to="/logs" className="nav-link">
          Logs
        </Link>
        <Link to="/incidents" className="nav-link">
          Incidents
        </Link>
        <Link to="/alerts" className="nav-link">
          Alerts
        </Link>
        <button onClick={handleLogout} className="nav-link danger-text" style={{ background: "none", border: "none", cursor: "pointer" }}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
