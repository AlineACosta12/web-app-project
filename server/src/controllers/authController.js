// MoodPlay — Authentication Controller
// Handles user registration, login, logout, and retrieval of the current user.
// Public routes: register and login.
// The project uses sessions instead of JWT.
// When a user logs in or registers, basic user information is saved in the session.

const User = require("../models/User");

// Helper function to return safe user data to the frontend
const formatUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  avatar: user.avatar,
  role: user.role || "user",
});

// Helper function to create the login session after register/login
const issueSession = (req, user) => {
  return new Promise((resolve, reject) => {
    req.session.userId = user._id.toString();
    req.session.username = user.username;
    req.session.role = user.role || "user";

    req.session.save((err) => {
      if (err) reject(err);
      else resolve();
    });
  });
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

    // Save user details in the server-side session
    await issueSession(req, user);

    res.status(201).json({
      message: "User registered successfully",
      user: formatUser(user),
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
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare the entered password with the stored hashed password
    const match = await user.comparePassword(password);

    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Save user details in the server-side session
    await issueSession(req, user);

    res.json({
      message: "User logged in successfully",
      user: formatUser(user),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/logout
// Logs the user out by destroying the session.
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }

    res.clearCookie("connect.sid");

    res.json({ message: "Logged out successfully" });
  });
};

// GET /api/auth/me
// Returns the currently logged-in user's profile.
// The user ID is available from the authentication middleware.
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: formatUser(user),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { register, login, logout, getMe };
