import { useEffect, useState } from "react";
import api from "../services/api";

function AlertHistory() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/alerts")
      .then((res) => setAlerts(res.data))
      .catch((err) => console.error("Failed to load alerts:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-container padding-vertical-large">
      <h2 className="margin-bottom-large">Alert History</h2>

      <div className="card padding-medium">
        {loading ? (
          <p className="muted-text margin-bottom-none">Loading...</p>
        ) : (
          <data-table className="data-table hover-table margin-bottom-none">
            <thead>
              <tr>
                <th>Email</th>
                <th>API</th>
                <th>Alert Type</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert) => (
                <tr key={alert.id}>
                  <td>{alert.email}</td>
                  <td>{alert.apiName}</td>
                  <td>{alert.alertType}</td>
                  <td>{new Date(alert.time).toLocaleString()}</td>
                  <td>
                    <span className={`status-badge ${alert.status === "Sent" ? "success-badge" : "danger-badge"}`}>
                      {alert.status}
                    </span>
                  </td>
                </tr>
              ))}

              {alerts.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center muted-text padding-vertical-medium">
                    No alerts yet.
                  </td>
                </tr>
              )}
            </tbody>
          </data-table>
        )}
      </div>
    </div>
  );
}

export default AlertHistory;
