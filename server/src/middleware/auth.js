// MoodPlay — JWT Authentication Middleware
// Byron Gift Ochieng Makasembo | 3062457
// Protects routes that require a logged-in user.
// Reads the Bearer token from the Authorization header,
// verifies it, and attaches the userId to req for downstream use.

const jwt = require('jsonwebtoken')

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization

  // Reject if no Authorization header or wrong format
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' })
  }

  // Extract the token from "Bearer <token>"
  const token = authHeader.split(' ')[1]

  try {
    // Verify and decode the token using the secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Attach the user's MongoDB ID to the request object
    req.userId = decoded.id
    next()
  } catch {
    // Token is invalid or expired
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

module.exports = protect
