import { useEffect, useState } from "react";
import api from "../services/api";

function IncidentReports() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    api
      .get("/incidents")
      .then((res) => setIncidents(res.data))
      .catch((err) => console.error("Failed to load incidents:", err))
      .finally(() => setLoading(false));
  }, []);

  function toggleDetails(id) {
    setExpandedId(expandedId === id ? null : id);
  }

  return (
    <div className="page-container padding-vertical-large">
      <h2 className="margin-bottom-large">Incident Reports</h2>

      {loading && <p className="muted-text">Loading...</p>}

      {!loading && incidents.length === 0 && (
        <p className="muted-text">No incidents yet — that's a good thing!</p>
      )}

      <div className="content-row">
        {incidents.map((incident) => (
          <div className="half-column margin-bottom-medium" key={incident.id}>
            <div className="card padding-medium full-height">
              <div className="flex-row space-between start-items">
                <h5>{incident.title}</h5>
                <span
                  className={`status-badge ${incident.severity === "Critical" ? "danger-badge" : "warning-badge dark-text"}`}
                >
                  {incident.severity}
                </span>
              </div>

              <p className="muted-text margin-bottom-smallest">API: {incident.apiName}</p>
              <p className="muted-text small-text">{new Date(incident.time).toLocaleString()}</p>

              <button
                className="button outline-primary-button small-button margin-top-small"
                onClick={() => toggleDetails(incident.id)}
              >
                {expandedId === incident.id ? "Hide Details" : "View Details"}
              </button>

              {expandedId === incident.id && (
                <div className="margin-top-medium top-border padding-top-medium">
                  <p>
                    <strong>AI Root Cause:</strong> {incident.aiRootCause}
                  </p>
                  <p className="margin-bottom-none">
                    <strong>Suggested Solution:</strong> {incident.suggestedSolution}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default IncidentReports;
