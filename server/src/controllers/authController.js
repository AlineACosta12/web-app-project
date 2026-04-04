// MoodPlay — Authentication Controller
// Handles user registration, login, logout, and retrieval of the current user.
// Public routes: register and login.
// When a user logs in or registers, the controller creates a JWT, stores it
// in an httpOnly cookie, and saves basic user information in the session.

const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Helper function to create the login session after register/login
// It stores the JWT in an httpOnly cookie and saves basic user data in the session.
const issueSession = (req, res, user, token) => {
  // Store the JWT in an httpOnly cookie.
  // This helps protect the token from client-side JavaScript access.
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });

  // Save user details in the server-side session
  req.session.userId = user._id.toString();
  req.session.username = user.username;
};

// POST /api/auth/register
// Creates a new user account.
// The password is hashed automatically by the User model before saving.
const register = async (req, res) => {
  try {
    let { username, email, password } = req.body;

    // Validate that all required fields are present
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Username, email and password are required" });
    }

    username = username.trim();
    email = email.toLowerCase().trim();

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ message: "Please enter a valid email address" });
    }

    // Validate username length
    if (username.length < 3) {
      return res
        .status(400)
        .json({ message: "Username must be at least 3 characters long" });
    }

    // Validate password length
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    // Check if the username or email is already in use
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Username or email already in use" });
    }

    // Create the new user
    const user = await User.create({ username, email, password });

    // Create a JWT containing the user's ID
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Store login information in the cookie and session
    issueSession(req, res, user, token);

    res.status(201).json({
      message: "User registered successfully",
      // Never return the password field
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    // Handle duplicate key errors from MongoDB
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ message: "Username or email already in use" });
    }
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/login
// Checks the user's credentials and logs them in if correct.
const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    // Check that both email and password were provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    email = email.toLowerCase().trim();

    // Find the user by email and include the password for verification
    const user = await User.findOne({ email }).select("+password"); // Include password hash for verification
    if (!user) {
      // Use a generic message to avoid revealing whether the email exists
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare the entered password with the stored hashed password
    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Issue a new token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set cookie and session
    issueSession(req, res, user, token);

    res.json({
      message: "User logged in successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/logout
// Logs the user out by clearing the auth cookie and destroying the session.
const logout = (req, res) => {
  // Remove the JWT cookie from the browser
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  // Destroy the server-side session data
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.json({ message: "Logged out successfully" });
  });
};

// GET /api/auth/me
// Returns the currently logged-in user's profile.
// The user ID should already be available from the authentication middleware.
const getMe = async (req, res) => {
  try {
    // req.userId is set by the protect middleware
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { register, login, logout, getMe };
