// MoodPlay — Watchlist Controller
// Handles creating, retrieving, updating, and deleting items in a user's watchlist.
// The userId is taken from the authenticated user, not from the request body.

const WatchlistItem = require("../models/WatchlistItem");

// GET /api/watchlist
// Returns all watchlist items for the logged-in user
const getWatchlist = async (req, res) => {
  try {
    // Only return items that belong to the authenticated user
    const items = await WatchlistItem.find({ userId: req.userId }).sort({
      createdAt: -1,
    });

    res.json(items);
  } catch (err) {
    console.error("getWatchlist error:", err.message);
    res.status(500).json({ message: "Failed to fetch watchlist" });
  }
};

// POST /api/watchlist/:tmdbId
// Adds a movie to the user's watchlist
// Body: { title, poster }
const addToWatchlist = async (req, res) => {
  const movieID = Number(req.params.tmdbId);
  const { title, poster } = req.body;

  if (!Number.isInteger(movieID) || movieID <= 0) {
    return res.status(400).json({ message: "Invalid movie ID" });
  }

  // A title is required so the movie can be displayed in the watchlist
  if (!title || title.trim() === "") {
    return res.status(400).json({ message: "Title is required" });
  }

  try {
    const item = await WatchlistItem.create({
      userId: req.userId,
      tmdbId: movieID,
      title: title.trim(),
      poster: poster || "",
      status: "plan", // Default status when the movie is first added
    });

    res.status(201).json(item);
  } catch (err) {
    // Duplicate key error: the movie is already in the user's watchlist
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ message: "Movie already in your watchlist" });
    }

    console.error("addToWatchlist error:", err.message);
    res.status(500).json({ message: "Failed to add movie to watchlist" });
  }
};

// PUT /api/watchlist/:tmdbId
// Updates the watch status of a movie in the watchlist
// Body: { status }
const updateWatchlistStatus = async (req, res) => {
  const movieID = Number(req.params.tmdbId);
  const { status } = req.body;

  if (!Number.isInteger(movieID) || movieID <= 0) {
    return res.status(400).json({ message: "Invalid movie ID" });
  }

  // Validate the allowed status values
  if (!status || !["plan", "watching", "watched"].includes(status)) {
    return res
      .status(400)
      .json({ message: "Status must be plan, watching, or watched" });
  }

  try {
    // Only update items that belong to the authenticated user
    const item = await WatchlistItem.findOneAndUpdate(
      { userId: req.userId, tmdbId: movieID },
      { status },
      { new: true },
    );

    if (!item) {
      return res.status(404).json({ message: "Watchlist item not found" });
    }

    res.json(item);
  } catch (err) {
    console.error("updateWatchlistStatus error:", err.message);
    res.status(500).json({ message: "Failed to update watchlist status" });
  }
};

// DELETE /api/watchlist/:tmdbId
// Removes a movie from the user's watchlist
const removeFromWatchlist = async (req, res) => {
  const movieID = Number(req.params.tmdbId);

  if (!Number.isInteger(movieID) || movieID <= 0) {
    return res.status(400).json({ message: "Invalid movie ID" });
  }

  try {
    // Only delete items that belong to the authenticated user
    const item = await WatchlistItem.findOneAndDelete({
      userId: req.userId,
      tmdbId: movieID,
    });

    if (!item) {
      return res.status(404).json({ message: "Watchlist item not found" });
    }

    res.json({ message: "Removed from watchlist successfully" });
  } catch (err) {
    console.error("removeFromWatchlist error:", err.message);
    res.status(500).json({ message: "Failed to remove movie from watchlist" });
  }
};

module.exports = {
  getWatchlist,
  addToWatchlist,
  updateWatchlistStatus,
  removeFromWatchlist,
};
