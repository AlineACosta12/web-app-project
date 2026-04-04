// MoodPlay — Watchlist Item Model
// Represents a movie saved in a user's watchlist.
// A user cannot add the same movie more than once.
// The status shows whether the movie is planned, being watched, or already watched.

const mongoose = require("mongoose");

const watchlistItemSchema = new mongoose.Schema(
  {
    // The user who owns this watchlist entry
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // TMDB movie ID (used to fetch poster/details from TMDB)
    tmdbId: {
      type: Number,
      required: true,
      min: 1,
    },
    // Movie title stored locally to avoid re-fetching from TMDB
    title: {
      type: String,
      required: true,
      trim: true,
    },
    // Poster path from TMDB (e.g. /abc123.jpg) — prepend image base URL on frontend
    poster: {
      type: String,
      default: "",
    },
    // User's current status for this movie
    status: {
      type: String,
      enum: ["plan", "watching", "watched"],
      default: "plan",
    },
  },
  { timestamps: true },
);

// Prevent a user from adding the same movie to their watchlist twice
watchlistItemSchema.index({ userId: 1, tmdbId: 1 }, { unique: true });

// Optional performance index
watchlistItemSchema.index({ userId: 1 });

module.exports = mongoose.model("WatchlistItem", watchlistItemSchema);
