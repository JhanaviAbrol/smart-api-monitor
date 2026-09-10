const fs = require("fs");
const path = require("path");

// We're not using a real database (like MongoDB or PostgreSQL) here.
// Instead, we just read/write one JSON file on disk. This keeps things
// simple for a beginner project — everything persists between server
// restarts, but it's not built for many users or high traffic.

const DB_PATH = path.join(__dirname, "..", "db.json");

function readDB() {
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw);
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// Helper to get the next numeric id for a list (e.g. users, apis)
function nextId(list) {
  if (list.length === 0) return 1;
  return Math.max(...list.map((item) => item.id)) + 1;
}

module.exports = { readDB, writeDB, nextId };
