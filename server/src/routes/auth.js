// MoodPlay — Auth Routes
// Byron Gift Ochieng Makasembo | 3062457
// Mounts register, login, logout, and current-user handlers.

const express = require('express')
const { register, login, logout, getMe } = require('../controllers/authController')
const protect = require('../middleware/auth')

const router = express.Router()

// POST /api/auth/register — create a new account
router.post('/register', register)

// POST /api/auth/login — authenticate and receive a JWT cookie + session
router.post('/login', login)

// POST /api/auth/logout — clear the auth cookie and destroy the session
router.post('/logout', logout)

// GET /api/auth/me — return the currently logged-in user's profile (protected)
router.get('/me', protect, getMe)

module.exports = router
