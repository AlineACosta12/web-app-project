// MoodPlay — Watchlist Routes
// Byron Gift Ochieng Makasembo | 3062457
// Full CRUD for a user's personal watchlist.
// All routes are protected — valid JWT required.
// userId is always taken from the verified token, never from the request body.
// Full implementation on feature/byron-watchlist.

const express = require("express");
const protect = require("../middleware/auth");

const router = express.Router();

// Apply JWT protection to all routes in this file
router.use(protect);

// GET /api/watchlist
// Returns all watchlist items belonging to the logged-in user
router.get("/", async (req, res) => {
  // TODO: feature/byron-watchlist
  res.status(501).json({ message: "Not implemented yet" });
});

// POST /api/watchlist/:tmdbId
// Adds a movie to the user's watchlist
router.post("/:tmdbId", async (req, res) => {
  // TODO: feature/byron-watchlist
  res.status(501).json({ message: "Not implemented yet" });
});

// PUT /api/watchlist/:tmdbId
// Updates the status of a watchlist entry (plan / watching / watched)
router.put("/:tmdbId", async (req, res) => {
  // TODO: feature/byron-watchlist
  res.status(501).json({ message: "Not implemented yet" });
});

// DELETE /api/watchlist/:tmdbId
// Removes a movie from the user's watchlist
router.delete("/:tmdbId", async (req, res) => {
  // TODO: feature/byron-watchlist
  res.status(501).json({ message: "Not implemented yet" });
});

module.exports = router;
