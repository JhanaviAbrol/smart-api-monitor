function StatCard({ label, value, color }) {
  return (
    <div className="stat-column margin-bottom-medium">
      <div className="card stat-card padding-medium text-center">
        <div className={`stat-value bold-text ${color}`}>{value}</div>
        <div className="muted-text">{label}</div>
      </div>
    </div>
  );
}

export default StatCard;
