// MoodPlay — Rating Routes
// Defines the routes for creating, retrieving, updating,
// and deleting movie ratings for the logged-in user.

const express = require("express");
const protect = require("../middleware/auth.js");
const {
  getAllRatings,
  getRating,
  createRating,
  updateRating,
  deleteRating,
} = require("../controllers/ratingController.js");

const router = express.Router();

// Ratings CRUD routes

// Protected route to get all ratings for the current user
router.get("/", protect, getAllRatings);

// Protected route to get the current user's rating for a specific movie
router.get("/:tmdbId", protect, getRating);

// Protected route to create a rating for a specific movie
router.post("/:tmdbId", protect, createRating);

// Protected route to update a rating for a specific movie
router.put("/:tmdbId", protect, updateRating);

// Protected route to delete a rating for a specific movie
router.delete("/:tmdbId", protect, deleteRating);

module.exports = router;
