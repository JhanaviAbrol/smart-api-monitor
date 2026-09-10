const jwt = require("jsonwebtoken");

const JWT_SECRET = "monitoriq_super_secret_change_me"; // beginner note: keep secrets in a .env file in a real project

// This middleware runs before any protected route. It checks for a
// "Authorization: Bearer <token>" header, verifies the token, and if
// it's valid, attaches the logged-in user's email to req.user.
function requireAuth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid Authorization header" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { email: "..." }
    next(); // move on to the actual route handler
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = { requireAuth, JWT_SECRET };
