// MoodPlay — Movie Routes
// Defines the routes for fetching movies from TMDB through the backend.
// This keeps the TMDB API key protected and away from the frontend.

const express = require("express");
const {
  getMoviesByMood,
  getRandomMovie,
  getNowPlaying,
  searchMovies,
  getMovieById,
} = require("../controllers/movieController");

const router = express.Router();

// GET /api/movies/mood/:mood
// Returns movies that match the selected mood
router.get("/mood/:mood", getMoviesByMood);

// GET /api/movies/random
// Returns one random movie for the Fortune Teller feature
// This route must come before /:tmdbId to avoid conflictsct
router.get("/random", getRandomMovie);

// GET /api/movies/nowplaying
// Returns movies currently showing in cinemas
// This route must come before /:tmdbId to avoid conflicts
router.get("/nowplaying", getNowPlaying);

// GET /api/movies/search?q=
// Searches for movies by title
// This route must come before /:tmdbId to avoid conflicts
router.get("/search", searchMovies);

// GET /api/movies/:tmdbId
// Returns full details for a movie using its TMDB ID
router.get("/:tmdbId", getMovieById);

module.exports = router;
