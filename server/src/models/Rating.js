// MoodPlay — Rating Model
// Byron Gift Ochieng Makasembo | 3062457
// Each document represents one user's rating and optional review for a movie.
// A user can only rate the same movie once — enforced by the compound unique index.
// Score is 1–5 stars. Review is optional, max 500 characters.

const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    // The user who submitted this rating
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // TMDB movie ID
    tmdbId: {
      type: Number,
      required: true,
      min: 1,
    },
    // Movie title stored locally
    title: {
      type: String,
      required: true,
      trim: true,
    },
    // Star rating: 1 to 5
    score: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      validate: {
        validator: Number.isInteger,
        message: "Score must be a whole number between 1 and 5",
      },
    },
    // Optional written review
    review: {
      type: String,
      maxlength: 500,
      trim: true,
      default: "",
    },
  },
  { timestamps: true },
);

// Prevent a user from rating the same movie twice
ratingSchema.index({ userId: 1, tmdbId: 1 }, { unique: true });

module.exports = mongoose.model("Rating", ratingSchema);
