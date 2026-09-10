const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { readDB, writeDB, nextId } = require("../utils/db");
const { JWT_SECRET } = require("../middleware/auth");

const router = express.Router();

// POST /api/auth/register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are all required." });
  }

  const db = readDB();

  const existingUser = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    return res.status(400).json({ message: "An account with this email already exists." });
  }

  // Never store plain-text passwords — bcrypt hashes it first
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = { id: nextId(db.users), name, email, password: hashedPassword };
  db.users.push(newUser);
  writeDB(db);

  const token = jwt.sign({ email: newUser.email }, JWT_SECRET, { expiresIn: "1d" });
  res.json({ token, name: newUser.name, email: newUser.email });
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const db = readDB();
  const user = db.users.find((u) => u.email.toLowerCase() === (email || "").toLowerCase());

  if (!user) {
    return res.status(401).json({ message: "No account found with that email/password." });
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    return res.status(401).json({ message: "No account found with that email/password." });
  }

  const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: "1d" });
  res.json({ token, name: user.name, email: user.email });
});

module.exports = router;
