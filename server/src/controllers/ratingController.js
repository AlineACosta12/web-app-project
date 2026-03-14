// MoodPlay — Rating Controller
// Byron Gift Ochieng Makasembo | 3062457
// Handles submitting, fetching, and deleting movie ratings and reviews.
// userId always comes from the verified JWT token — never from the request body.

const Rating = require('../models/Rating')

// GET /api/ratings/:tmdbId
// Returns the logged-in user's rating for a specific movie
const getRating = async (req, res) => {
  const { tmdbId } = req.params

  try {
    // Filter by both userId and tmdbId — users only see their own ratings
    const rating = await Rating.findOne({ userId: req.userId, tmdbId: Number(tmdbId) })

    if (!rating) {
      return res.status(404).json({ message: 'No rating found for this movie' })
    }

    res.json(rating)
  } catch (err) {
    console.error('getRating error:', err.message)
    res.status(500).json({ message: err.message })
  }
}

// POST /api/ratings/:tmdbId
// Submits a rating and optional review for a movie
// Body: { title, score, review }
const submitRating = async (req, res) => {
  const { tmdbId } = req.params
  const { title, score, review } = req.body

  // Validate required fields
  if (!title) {
    return res.status(400).json({ message: 'title is required' })
  }
  if (!score || score < 1 || score > 5) {
    return res.status(400).json({ message: 'score must be a number between 1 and 5' })
  }

  try {
    const rating = await Rating.create({
      userId: req.userId,
      tmdbId: Number(tmdbId),
      title,
      score: Number(score),
      review: review || '',
    })

    res.status(201).json(rating)
  } catch (err) {
    // Duplicate key — user already rated this movie
    if (err.code === 11000) {
      return res.status(400).json({ message: 'You have already rated this movie' })
    }
    console.error('submitRating error:', err.message)
    res.status(500).json({ message: err.message })
  }
}

// DELETE /api/ratings/:tmdbId
// Removes the logged-in user's rating for a movie
const deleteRating = async (req, res) => {
  const { tmdbId } = req.params

  try {
    // userId filter ensures users can only delete their own ratings
    const rating = await Rating.findOneAndDelete({
      userId: req.userId,
      tmdbId: Number(tmdbId),
    })

    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' })
    }

    res.json({ message: 'Rating deleted' })
  } catch (err) {
    console.error('deleteRating error:', err.message)
    res.status(500).json({ message: err.message })
  }
}

module.exports = { getRating, submitRating, deleteRating }
