// MoodPlay — Watchlist Controller
// Byron Gift Ochieng Makasembo | 3062457
// Full CRUD for a user's personal watchlist.
// userId always comes from the verified JWT token — never from the request body.

const WatchlistItem = require("../models/WatchlistItem");

// GET /api/watchlist
// Returns all watchlist items belonging to the logged-in user
const getWatchlist = async (req, res) => {
  try {
    // Filter strictly by the userId from the token — users can only see their own list
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
// Body: { title, poster } — these are stored locally so the watchlist page doesn't need extra TMDB calls
const addToWatchlist = async (req, res) => {
  const movieID = Number(req.params.tmdbId);
  const { title, poster } = req.body;

  if (!Number.isInteger(movieID) || movieID <= 0) {
    return res.status(400).json({ message: "Invalid movie ID" });
  }

  // title is required — we need something to display on the watchlist page
  if (!title || title.trim() === "") {
    return res.status(400).json({ message: "Title is required" });
  }

  try {
    const item = await WatchlistItem.create({
      userId: req.userId,
      tmdbId: movieID,
      title: title.trim(),
      poster: poster || "",
      status: "plan", // default status when first added
    });
    res.status(201).json(item);
  } catch (err) {
    // Mongoose duplicate key error — movie already on this user's watchlist
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
// Updates the watch status of a watchlist entry (plan / watching / watched)
// Body: { status }
const updateWatchlistStatus = async (req, res) => {
  const movieID = Number(req.params.tmdbId);
  const { status } = req.body;

  if (!Number.isInteger(movieID) || movieID <= 0) {
    return res.status(400).json({ message: "Invalid movie ID" });
  }

  // Validate the status value before hitting the database
  if (!status || !["plan", "watching", "watched"].includes(status)) {
    return res
      .status(400)
      .json({ message: "Status must be plan, watching, or watched" });
  }

  try {
    // userId filter ensures a user can only update their own entries
    const item = await WatchlistItem.findOneAndUpdate(
      { userId: req.userId, tmdbId: movieID },
      { status },
      { new: true }, // return the updated document
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
    // userId filter ensures a user can only delete their own entries
    const item = await WatchlistItem.findOneAndDelete({
      userId: req.userId,
      tmdbId: movieID,
    });

    if (!item) {
      return res.status(404).json({ message: "Watchlist item not found" });
    }

    res.json({ message: "Removed from watchlist" });
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
