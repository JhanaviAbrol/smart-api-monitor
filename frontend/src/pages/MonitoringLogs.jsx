import { useEffect, useState } from "react";
import api from "../services/api";

function MonitoringLogs() {
  const [logs, setLogs] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/logs")
      .then((res) => setLogs(res.data))
      .catch((err) => console.error("Failed to load logs:", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredLogs = logs.filter((log) =>
    log.apiName.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="page-container padding-vertical-large">
      <h2 className="margin-bottom-large">Monitoring Logs</h2>

      <input
        type="text"
        className="form-input margin-bottom-medium"
        placeholder="Search by API name..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />

      <div className="card padding-medium">
        {loading ? (
          <p className="muted-text margin-bottom-none">Loading...</p>
        ) : (
          <data-table className="data-table hover-table margin-bottom-none">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>API Name</th>
                <th>Status Code</th>
                <th>Response Time</th>
                <th>Error Message</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td>{new Date(log.timestamp).toLocaleString()}</td>
                  <td>{log.apiName}</td>
                  <td>
                    <span className={log.statusCode >= 400 || !log.statusCode ? "danger-text bold-text" : "success-text"}>
                      {log.statusCode || "—"}
                    </span>
                  </td>
                  <td>{log.responseTime} ms</td>
                  <td className="muted-text">{log.errorMessage || "—"}</td>
                </tr>
              ))}

              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center muted-text padding-vertical-medium">
                    No logs yet — add an API and wait for the next check.
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

export default MonitoringLogs;
