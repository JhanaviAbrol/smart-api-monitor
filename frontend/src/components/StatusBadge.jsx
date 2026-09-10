function StatusBadge({ status }) {
  let badgeClass = "secondary-badge";

  if (status === "Healthy") {
    badgeClass = "success-badge";
  } else if (status === "Warning") {
    badgeClass = "warning-badge dark-text";
  } else if (status === "Down") {
    badgeClass = "danger-badge";
  }

  return <span className={`status-badge ${badgeClass}`}>{status}</span>;
}

export default StatusBadge;
