// MoodPlay — Auth Routes
// Byron Gift Ochieng Makasembo | 3062457
// Mounts register and login handlers from authController.

const express = require('express')
const { register, login } = require('../controllers/authController')

const router = express.Router()

// POST /api/auth/register
router.post('/register', register)

// POST /api/auth/login
router.post('/login', login)

module.exports = router
