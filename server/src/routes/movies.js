// MoodPlay — Movie Routes (TMDB Proxy)
// Byron Gift Ochieng Makasembo | 3062457
// All TMDB API calls go through here — the API key never reaches the frontend.

const express = require('express')
const {
  getMoviesByMood,
  getRandomMovie,
  getNowPlaying,
  searchMovies,
  getMovieById,
} = require('../controllers/movieController')

const router = express.Router()

// GET /api/movies/mood/:mood
// Returns a list of movies matching the selected mood via TMDB discover
router.get('/mood/:mood', getMoviesByMood)

// GET /api/movies/random
// Returns a single random movie from TMDB popular list (Fortune Teller feature)
// NOTE: declared before /:tmdbId to avoid route conflict
router.get('/random', getRandomMovie)

// GET /api/movies/nowplaying
// Returns movies currently in cinemas (Big Screen feature)
// NOTE: declared before /:tmdbId to avoid route conflict
router.get('/nowplaying', getNowPlaying)

// GET /api/movies/search?q=
// Searches TMDB by movie title
router.get('/search', searchMovies)

// GET /api/movies/:tmdbId
// Fetches full detail for a single movie by its TMDB ID
router.get('/:tmdbId', getMovieById)

module.exports = router
