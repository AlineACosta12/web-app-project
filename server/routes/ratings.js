// MoodPlay — Ratings Routes
// Byron Gift Ochieng Makasembo | 3062457
// Allows users to rate and review movies (1–5 stars, optional review text).
// All routes are protected — valid JWT required.
// userId always comes from the verified token, not the request body.
// Full implementation on feature/byron-ratings.

const express = require('express')
const protect = require('../middleware/auth')

const router = express.Router()

// Apply JWT protection to all routes in this file
router.use(protect)

// GET /api/ratings/:tmdbId
// Returns the logged-in user's rating for a specific movie
router.get('/:tmdbId', async (req, res) => {
  // TODO: feature/byron-ratings
  res.status(501).json({ message: 'Not implemented yet' })
})

// POST /api/ratings/:tmdbId
// Submits or updates a rating for a movie
router.post('/:tmdbId', async (req, res) => {
  // TODO: feature/byron-ratings
  res.status(501).json({ message: 'Not implemented yet' })
})

// DELETE /api/ratings/:tmdbId
// Removes the user's rating for a movie
router.delete('/:tmdbId', async (req, res) => {
  // TODO: feature/byron-ratings
  res.status(501).json({ message: 'Not implemented yet' })
})

module.exports = router
