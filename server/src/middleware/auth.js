// MoodPlay — JWT Authentication Middleware
// Byron Gift Ochieng Makasembo | 3062457
// Protects routes that require a logged-in user.
// Checks for a JWT in two places (in order):
//   1. The Authorization header (Bearer <token>) — used by Axios on the frontend
//   2. The httpOnly 'token' cookie — set by the server on login
// If either is valid, req.userId is attached and the request continues.

const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  let token = null;

  // Check Authorization header first (Bearer token from Axios)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  // Fall back to the httpOnly cookie if no header token was found
  if (!token && req.cookies?.token) {
    token = req.cookies.token;
  }

  // Reject if no token found in either location
  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    // Verify and decode the token using the secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user's MongoDB ID to the request object for downstream use
    req.userId = decoded.id;
    next();
  } catch (err) {
    // Token is invalid or expired
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = protect;
