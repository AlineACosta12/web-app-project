// MoodPlay — Authentication Middleware
// Protects routes that require a logged-in user.
// Session is the primary auth method. JWT cookie is the fallback.
// Byron Gift Ochieng Makasembo | 3062457

const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  // check server-side session first - this is the main auth technique
  if (req.session && req.session.userId) {
    req.userId = req.session.userId;
    return next();
  }

  // session not found - fall back to JWT (handles Axios Bearer header or cookie)
  let token = null;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token && req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    // restore the session so future requests go through the session check
    req.session.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = protect;
