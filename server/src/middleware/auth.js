// MoodPlay — Authentication Middleware
// Protects routes that require a logged-in user.
// The project uses sessions instead of JWT.
// If a valid session exists, the user ID is attached to the request.

const protect = (req, res, next) => {
  // Reject if there is no active session
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: "Authentication required" });
  }

  // Attach the user's MongoDB ID to the request object for downstream use
  req.userId = req.session.userId;

  // Optional helper object for role-based access control
  req.user = {
    id: req.session.userId,
    role: req.session.role || "user",
  };

  next();
};

module.exports = protect;
