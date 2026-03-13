// MoodPlay — Auth Controller
// Byron Gift Ochieng Makasembo | 3062457
// Handles user registration and login.
// Public routes — no token required.
// Returns a JWT (7-day expiry) and the user object (no password) on success.

const jwt = require('jsonwebtoken')
const User = require('../models/User')

// POST /api/auth/register
// Creates a new user account. Password is hashed by the User model pre-save hook.
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body

    // Validate that all required fields are present
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'username, email and password are required' })
    }

    // Check that neither the email nor username is already taken
    const existing = await User.findOne({ $or: [{ email }, { username }] })
    if (existing) {
      return res.status(400).json({ message: 'Username or email already in use' })
    }

    // Create the user — password hashing happens in the model pre-save hook
    const user = await User.create({ username, email, password })

    // Sign a JWT with the user's MongoDB ID
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.status(201).json({
      token,
      // Never return the password field
      user: { id: user._id, username: user.username, email: user.email, avatar: user.avatar }
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// POST /api/auth/login
// Validates credentials and returns a JWT if correct.
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' })
    }

    // Look up the user by email
    const user = await User.findOne({ email })
    if (!user) {
      // Use a generic message to avoid revealing whether the email exists
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    // Compare the submitted password against the stored hash
    const match = await user.comparePassword(password)
    if (!match) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    // Issue a new token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email, avatar: user.avatar }
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { register, login }
