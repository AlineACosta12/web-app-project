// MoodPlay — Watchlist Routes
// Defines the routes for creating, retrieving, updating,
// and deleting items in the logged-in user's watchlist.
// The project uses session-based authentication.

const express = require("express");
const protect = require("../middleware/auth");

const {
  getWatchlist,
  addToWatchlist,
  updateWatchlistStatus,
  removeFromWatchlist,
} = require("../controllers/watchlistController");

const router = express.Router();

// Apply authentication middleware to all watchlist routes
router.use(protect);

// GET /api/watchlist
// Returns all watchlist items for the current user
router.get("/", getWatchlist);

// POST /api/watchlist/:tmdbId
// Adds a movie to the current user's watchlist
router.post("/:tmdbId", addToWatchlist);

// PUT /api/watchlist/:tmdbId
// Updates the watch status of a movie in the watchlist
router.put("/:tmdbId", updateWatchlistStatus);

// DELETE /api/watchlist/:tmdbId
// Removes a movie from the current user's watchlist
router.delete("/:tmdbId", removeFromWatchlist);

module.exports = router;
