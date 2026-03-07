// MoodPlay — WatchlistItem Model
// Byron Gift Ochieng Makasembo | 3062457
// Each document represents one movie on one user's watchlist.
// A user cannot add the same movie twice — enforced by the compound unique index.
// Status tracks where the user is with the movie: plan / watching / watched.

const mongoose = require('mongoose')

const watchlistItemSchema = new mongoose.Schema({
  // The user who owns this watchlist entry
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // TMDB movie ID (used to fetch poster/details from TMDB)
  tmdbId: {
    type: Number,
    required: true
  },
  // Movie title stored locally to avoid re-fetching from TMDB
  title: {
    type: String,
    required: true
  },
  // Poster path from TMDB (e.g. /abc123.jpg) — prepend image base URL on frontend
  poster: {
    type: String,
    default: ''
  },
  // User's current status for this movie
  status: {
    type: String,
    enum: ['plan', 'watching', 'watched'],
    default: 'plan'
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
})

// Prevent a user from adding the same movie to their watchlist twice
watchlistItemSchema.index({ userId: 1, tmdbId: 1 }, { unique: true })

module.exports = mongoose.model('WatchlistItem', watchlistItemSchema)
