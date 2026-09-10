const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const apiRoutes = require("./routes/apis");
const dataRoutes = require("./routes/data");
const { startMonitoring } = require("./services/monitor");

const app = express();
const PORT = 5000;

// Allow requests from our React frontend (running on Vite's default port)
app.use(cors({ origin: "http://localhost:5173" }));

// Lets us read JSON request bodies (req.body)
app.use(express.json());

// Mount our route files
app.use("/api/auth", authRoutes);
app.use("/api/apis", apiRoutes);
app.use("/api", dataRoutes); // provides /api/logs, /api/incidents, /api/alerts, /api/dashboard/stats

// Simple health check route
app.get("/", (req, res) => {
  res.send("MonitorIQ backend is running.");
});

app.listen(PORT, () => {
  console.log(`MonitorIQ backend listening on http://localhost:${PORT}`);
  startMonitoring(); // begin periodically checking all registered APIs
});
