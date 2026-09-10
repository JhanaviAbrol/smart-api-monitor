const express = require("express");
const { readDB, writeDB, nextId } = require("../utils/db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// Every route below requires a valid login (JWT) — see middleware/auth.js
router.use(requireAuth);

// GET /api/apis — list all registered APIs
router.get("/", (req, res) => {
  const db = readDB();
  res.json(db.apis);
});

// POST /api/apis — register a new API to monitor
router.post("/", (req, res) => {
  const { name, url, method, monitoringInterval, description } = req.body;

  if (!name || !url) {
    return res.status(400).json({ message: "Name and URL are required." });
  }

  const db = readDB();
  const newApi = {
    id: nextId(db.apis),
    name,
    url,
    method: method || "GET",
    monitoringInterval: monitoringInterval || 60,
    description: description || "",
    status: "Healthy", // will be updated by the scheduler on its next check
    responseTime: 0,
    lastChecked: "Not checked yet",
  };

  db.apis.push(newApi);
  writeDB(db);
  res.status(201).json(newApi);
});

// PUT /api/apis/:id — edit an existing API
router.put("/:id", (req, res) => {
  const db = readDB();
  const api = db.apis.find((a) => a.id === Number(req.params.id));

  if (!api) {
    return res.status(404).json({ message: "API not found." });
  }

  const { name, url, method, monitoringInterval, description } = req.body;
  if (name) api.name = name;
  if (url) api.url = url;
  if (method) api.method = method;
  if (monitoringInterval) api.monitoringInterval = monitoringInterval;
  if (description !== undefined) api.description = description;

  writeDB(db);
  res.json(api);
});

// DELETE /api/apis/:id — remove an API
router.delete("/:id", (req, res) => {
  const db = readDB();
  const exists = db.apis.some((a) => a.id === Number(req.params.id));

  if (!exists) {
    return res.status(404).json({ message: "API not found." });
  }

  db.apis = db.apis.filter((a) => a.id !== Number(req.params.id));
  writeDB(db);
  res.status(204).send();
});

module.exports = router;
