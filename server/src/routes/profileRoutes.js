// MoodPlay — Profile Routes
// Defines the routes for viewing, updating, and deleting
// the logged-in user's profile information.
// The project uses session-based authentication.

const express = require("express");
const protect = require("../middleware/auth");

const {
  getProfile,
  updateProfile,
  changePassword,
  deleteProfile,
} = require("../controllers/profileController");

const router = express.Router();

// Protected route to get the current user's profile
router.get("/", protect, getProfile);

// Protected route to update the current user's profile
router.put("/", protect, updateProfile);

// Protected route to change the current user's password
router.put("/password", protect, changePassword);

// Protected route to delete the current user's account
router.delete("/", protect, deleteProfile);

module.exports = router;
