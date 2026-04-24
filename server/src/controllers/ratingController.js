// MoodPlay — Rating Controller
// Handles creating, retrieving, updating, and deleting movie ratings and reviews.
// The userId is taken from the authenticated user, not from the request body.

const Rating = require("../models/Rating");

// GET /api/ratings
// Returns all ratings for the logged-in user
const getAllRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ userId: req.userId }).sort({
      createdAt: -1,
    });

    res.json(ratings);
  } catch (err) {
    console.error("getAllRatings error:", err.message);
    res.status(500).json({ message: "Failed to fetch ratings" });
  }
};

// GET /api/ratings/:tmdbId
// Returns the logged-in user's rating for a specific movie
const getRating = async (req, res) => {
  const movieID = Number(req.params.tmdbId);

  if (!Number.isInteger(movieID) || movieID <= 0) {
    return res.status(400).json({ message: "Invalid movie ID" });
  }

  try {
    const rating = await Rating.findOne({
      userId: req.userId,
      tmdbId: movieID,
    });

    if (!rating) {
      return res
        .status(404)
        .json({ message: "No rating found for this movie" });
    }

    res.json(rating);
  } catch (err) {
    console.error("getRating error:", err.message);
    res.status(500).json({ message: "Failed to fetch rating" });
  }
};

// POST /api/ratings/:tmdbId
// Creates a new rating for a movie
// Body: { title, score, review }
const createRating = async (req, res) => {
  const movieID = Number(req.params.tmdbId);
  const { title, score, review, poster } = req.body;

  if (!Number.isInteger(movieID) || movieID <= 0) {
    return res.status(400).json({ message: "Invalid movie ID" });
  }

  if (!title || title.trim() === "") {
    return res.status(400).json({ message: "Title is required" });
  }

  const numericScore = Number(score);
  if (!Number.isInteger(numericScore) || numericScore < 1 || numericScore > 5) {
    return res.status(400).json({
      message: "Score must be a number between 1 and 5",
    });
  }

  try {
    const existingRating = await Rating.findOne({
      userId: req.userId,
      tmdbId: movieID,
    });

    if (existingRating) {
      return res.status(400).json({
        message: "You have already rated this movie",
      });
    }

    const rating = await Rating.create({
      userId: req.userId,
      tmdbId: movieID,
      title: title.trim(),
      poster: poster ? String(poster) : "",
      score: numericScore,
      review: review ? String(review).trim() : "",
    });

    res.status(201).json(rating);
  } catch (err) {
    console.error("createRating error:", err.message);
    res.status(500).json({ message: "Failed to save rating" });
  }
};

// PUT /api/ratings/:tmdbId
// Updates an existing rating for a movie
// Body: { title, score, review }
const updateRating = async (req, res) => {
  const movieID = Number(req.params.tmdbId);
  const { title, score, review, poster } = req.body;

  if (!Number.isInteger(movieID) || movieID <= 0) {
    return res.status(400).json({ message: "Invalid movie ID" });
  }

  const updateData = {};

  if (title !== undefined) {
    if (!title.trim()) {
      return res.status(400).json({ message: "Title cannot be empty" });
    }
    updateData.title = title.trim();
  }

  if (poster !== undefined) {
    updateData.poster = String(poster);
  }

  if (score !== undefined) {
    const numericScore = Number(score);
    if (
      !Number.isInteger(numericScore) ||
      numericScore < 1 ||
      numericScore > 5
    ) {
      return res.status(400).json({
        message: "Score must be a number between 1 and 5",
      });
    }
    updateData.score = numericScore;
  }

  if (review !== undefined) {
    updateData.review = String(review).trim();
  }

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({
      message: "At least one field must be provided to update",
    });
  }

  try {
    const rating = await Rating.findOneAndUpdate(
      {
        userId: req.userId,
        tmdbId: movieID,
      },
      updateData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!rating) {
      return res.status(404).json({ message: "Rating not found" });
    }

    res.json(rating);
  } catch (err) {
    console.error("updateRating error:", err.message);
    res.status(500).json({ message: "Failed to update rating" });
  }
};

// DELETE /api/ratings/:tmdbId
// Removes the logged-in user's rating for a movie
const deleteRating = async (req, res) => {
  const movieID = Number(req.params.tmdbId);

  if (!Number.isInteger(movieID) || movieID <= 0) {
    return res.status(400).json({ message: "Invalid movie ID" });
  }

  try {
    const rating = await Rating.findOneAndDelete({
      userId: req.userId,
      tmdbId: movieID,
    });

    if (!rating) {
      return res.status(404).json({ message: "Rating not found" });
    }

    res.json({ message: "Rating deleted" });
  } catch (err) {
    console.error("deleteRating error:", err.message);
    res.status(500).json({ message: "Failed to delete rating" });
  }
};

module.exports = {
  getAllRatings,
  getRating,
  createRating,
  updateRating,
  deleteRating,
};
