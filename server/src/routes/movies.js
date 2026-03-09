// MoodPlay — Movie Routes (TMDB Proxy)
// Byron Gift Ochieng Makasembo | 3062457
// All TMDB API calls go through here — the API key never reaches the frontend.
// Full implementation on feature/byron-tmdb.

const express = require('express')

const router = express.Router()

// Maps mood names to TMDB genre ID strings
const MOOD_GENRES = {
  happy: '35,16,10751',    // Comedy, Animation, Family
  sad: '18',               // Drama
  romantic: '10749',       // Romance
  motivated: '28,12',      // Action, Adventure
  bored: '53,9648',        // Thriller, Mystery
  mindblow: '878,14'       // Science Fiction, Fantasy
}

// GET /api/movies/mood/:mood
// Returns a list of movies matching the selected mood via TMDB discover
router.get('/mood/:mood', async (req, res) => {
  // TODO: feature/byron-tmdb
  res.status(501).json({ message: 'Not implemented yet' })
})

// GET /api/movies/random
// Returns a random movie from TMDB popular list (Fortune Teller feature)
router.get('/random', async (req, res) => {
  // TODO: feature/byron-tmdb
  res.status(501).json({ message: 'Not implemented yet' })
})

// GET /api/movies/nowplaying
// Returns movies currently in cinemas (Big Screen feature)
router.get('/nowplaying', async (req, res) => {
  // TODO: feature/byron-tmdb
  res.status(501).json({ message: 'Not implemented yet' })
})

// GET /api/movies/search?q=
// Searches TMDB by movie title
router.get('/search', async (req, res) => {
  // TODO: feature/byron-tmdb
  res.status(501).json({ message: 'Not implemented yet' })
})

// GET /api/movies/:tmdbId
// Fetches full detail for a single movie by its TMDB ID
router.get('/:tmdbId', async (req, res) => {
  // TODO: feature/byron-tmdb
  res.status(501).json({ message: 'Not implemented yet' })
})

module.exports = router
