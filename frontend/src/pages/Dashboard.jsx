import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";

function Dashboard() {
  const [stats, setStats] = useState({ totalApis: 0, healthyApis: 0, downApis: 0 });
  const [apis, setApis] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [statsRes, apisRes, alertsRes] = await Promise.all([
          api.get("/dashboard/stats"),
          api.get("/apis"),
          api.get("/alerts"),
        ]);

        setStats(statsRes.data);
        setApis(apisRes.data);
        setAlerts(alertsRes.data.slice(0, 3));
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  if (loading) {
    return <div className="page-container padding-vertical-large">Loading dashboard...</div>;
  }

  return (
    <div className="page-container padding-vertical-large">
      <h2 className="margin-bottom-smallest">Dashboard</h2>
      <p className="muted-text margin-bottom-large">Overview of your monitored APIs</p>

      <div className="content-row">
        <StatCard label="Total APIs" value={stats.totalApis} color="brand-name" />
        <StatCard label="Healthy" value={stats.healthyApis} color="success-text" />
        <StatCard label="Down" value={stats.downApis} color="danger-text" />
      </div>

      <div className="card padding-medium margin-top-large margin-bottom-large">
        <h5 className="margin-bottom-medium">Quick Actions</h5>
        <div className="flex-row small-gap wrap-items">
          <Link to="/apis" className="button primary-button">
            + Add API
          </Link>
          <Link to="/logs" className="button outline-secondary-button">
            View Monitoring Logs
          </Link>
          <Link to="/incidents" className="button outline-secondary-button">
            View Incident Reports
          </Link>
          <Link to="/alerts" className="button outline-secondary-button">
            View All Alerts
          </Link>
        </div>
      </div>

      <div className="content-row">
        <div className="large-seven-column margin-bottom-large">
          <h5 className="margin-bottom-medium">All APIs</h5>
          <div className="card padding-medium">
            {apis.length === 0 ? (
              <p className="muted-text margin-bottom-none">
                No APIs registered yet. <Link to="/apis">Add one</Link> to get started.
              </p>
            ) : (
              <data-table className="data-table hover-table margin-bottom-none">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Response Time</th>
                    <th>Last Checked</th>
                  </tr>
                </thead>
                <tbody>
                  {apis.map((apiItem) => (
                    <tr key={apiItem.id}>
                      <td>{apiItem.name}</td>
                      <td>
                        <StatusBadge status={apiItem.status} />
                      </td>
                      <td>{apiItem.responseTime} ms</td>
                      <td className="muted-text">{apiItem.lastChecked}</td>
                    </tr>
                  ))}
                </tbody>
              </data-table>
            )}
          </div>
        </div>

        <div className="large-five-column margin-bottom-large">
          <h5 className="margin-bottom-medium">Recent Alerts</h5>
          <div className="card padding-medium">
            {alerts.length === 0 && <p className="muted-text margin-bottom-none">No alerts yet.</p>}

            {alerts.map((alert) => (
              <div key={alert.id} className="flex-row space-between center-items bottom-border padding-vertical-small">
                <div>
                  <div className="semibold-text">{alert.apiName}</div>
                  <div className="muted-text small-text">
                    {alert.alertType} · {new Date(alert.time).toLocaleString()}
                  </div>
                </div>
                <span className={`status-badge ${alert.status === "Sent" ? "success-badge" : "danger-badge"}`}>
                  {alert.status}
                </span>
              </div>
            ))}

            <Link to="/alerts" className="small-text block text-right margin-top-small">
              View all alerts →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
