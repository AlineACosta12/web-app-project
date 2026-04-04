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
router.get("/", protect, getAllRatings);
router.get("/:tmdbId", protect, getRating);
router.post("/:tmdbId", protect, createRating);
router.put("/:tmdbId", protect, updateRating);
router.delete("/:tmdbId", protect, deleteRating);

module.exports = router;
