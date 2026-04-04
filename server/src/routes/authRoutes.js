// MoodPlay — Authentication Routes
// Defines the routes for user registration, login, logout,
// and retrieving the currently logged-in user's details.

const express = require("express");
const {
  register,
  login,
  logout,
  getMe,
} = require("../controllers/authController");
const protect = require("../middleware/auth");

const router = express.Router();

// Public authentication routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// Protected route for fetching the current user's details
router.get("/me", protect, getMe);

module.exports = router;
