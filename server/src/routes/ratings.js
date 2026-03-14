// MoodPlay — Ratings Routes
// Byron Gift Ochieng Makasembo | 3062457
// Allows users to rate and review movies (1–5 stars, optional review text).
// All routes are protected — valid JWT required.
// userId always comes from the verified token, not the request body.

const express = require('express')
const protect = require('../middleware/auth')
const { getRating, submitRating, deleteRating } = require('../controllers/ratingController')

const router = express.Router()

// Apply JWT protection to all routes in this file
router.use(protect)

// GET /api/ratings/:tmdbId
// Returns the logged-in user's rating for a specific movie
router.get('/:tmdbId', getRating)

// POST /api/ratings/:tmdbId
// Submits a rating and optional review — body: { title, score, review }
router.post('/:tmdbId', submitRating)

// DELETE /api/ratings/:tmdbId
// Removes the user's rating for a movie
router.delete('/:tmdbId', deleteRating)

module.exports = router
