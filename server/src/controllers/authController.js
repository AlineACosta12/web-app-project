// MoodPlay — Auth Controller
// Byron Gift Ochieng Makasembo | 3062457
// Handles user registration, login, logout, and current-user retrieval.
// Public routes — no token required for register/login.
// On login/register: issues a JWT, stores it as an httpOnly cookie, and saves user
// info in the server-side session so protected routes can identify the caller.

const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Helper — sets the JWT as an httpOnly cookie and stores user state in the session.
// Called by both register and login to avoid code duplication.
const issueSession = (req, res, user, token) => {
  // Store the JWT in an httpOnly cookie so the browser sends it automatically.
  // httpOnly prevents client-side JS from reading the token (XSS protection).
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });

  // Store key user info in the server-side session.
  // This lets protected routes confirm identity without re-verifying the JWT on every call.
  req.session.userId = user._id.toString();
  req.session.username = user.username;
};

// POST /api/auth/register
// Creates a new user account. Password is hashed by the User model pre-save hook.
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

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ message: "Please enter a valid email address" });
    }

    if (username.length < 3) {
      return res
        .status(400)
        .json({ message: "Username must be at least 3 characters long" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    // Check that neither the email nor username is already taken
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Username or email already in use" });
    }

    // Create the user — password hashing happens in the model pre-save hook
    const user = await User.create({ username, email, password });

    // Sign a JWT with the user's MongoDB ID
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set cookie and session
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
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ message: "Username or email already in use" });
    }
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/login
// Validates credentials and returns a JWT if correct.
const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    email = email.toLowerCase().trim();

    // Look up the user by email
    const user = await User.findOne({ email }).select("+password"); // Include password hash for verification
    if (!user) {
      // Use a generic message to avoid revealing whether the email exists
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare the submitted password against the stored hash
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
// Clears the auth cookie and destroys the server-side session.
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
// Returns the currently logged-in user's profile (from the session).
// Used by the frontend to restore auth state on page load.
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
