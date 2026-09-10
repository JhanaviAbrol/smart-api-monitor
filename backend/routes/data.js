const express = require("express");
const { readDB } = require("../utils/db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

// GET /api/logs — recent monitoring logs
router.get("/logs", (req, res) => {
  const db = readDB();
  res.json(db.logs.slice(0, 200)); // just the most recent 200
});

// GET /api/incidents — all incidents, newest first (already stored that way)
router.get("/incidents", (req, res) => {
  const db = readDB();
  res.json(db.incidents);
});

// GET /api/alerts — all alerts, newest first
router.get("/alerts", (req, res) => {
  const db = readDB();
  res.json(db.alerts);
});

// GET /api/dashboard/stats — summary numbers for the dashboard cards
router.get("/dashboard/stats", (req, res) => {
  const db = readDB();

  const totalApis = db.apis.length;
  const healthyApis = db.apis.filter((a) => a.status === "Healthy").length;
  const downApis = db.apis.filter((a) => a.status === "Down").length;

  const today = new Date().toDateString();
  const incidentsToday = db.incidents.filter(
    (i) => new Date(i.time).toDateString() === today
  ).length;

  res.json({ totalApis, healthyApis, downApis, incidentsToday });
});

module.exports = router;
