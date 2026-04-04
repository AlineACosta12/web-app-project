// MoodPlay — Watchlist Routes
// Byron Gift Ochieng Makasembo | 3062457
// Full CRUD for a user's personal watchlist.
// All routes are protected — valid JWT required.
// userId is always taken from the verified token, never from the request body.

const express = require("express");
const protect = require("../middleware/auth");
const {
  getWatchlist,
  addToWatchlist,
  updateWatchlistStatus,
  removeFromWatchlist,
} = require("../controllers/watchlistController");

const router = express.Router();

// Apply JWT protection to all routes in this file
router.use(protect);

// GET /api/watchlist
// Returns all watchlist items belonging to the logged-in user
router.get("/", getWatchlist);

// POST /api/watchlist/:tmdbId
// Adds a movie to the user's watchlist — body: { title, poster }
router.post("/:tmdbId", addToWatchlist);

// PUT /api/watchlist/:tmdbId
// Updates the status of a watchlist entry — body: { status }
router.put("/:tmdbId", updateWatchlistStatus);

// DELETE /api/watchlist/:tmdbId
// Removes a movie from the user's watchlist
router.delete("/:tmdbId", removeFromWatchlist);

module.exports = router;
