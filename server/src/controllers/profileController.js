// MoodPlay — Profile Controller
// Handles profile-related actions for the logged-in user,
// including viewing profile details, updating account information,
// changing password, and deleting the account.

const User = require("../models/User");
const WatchlistItem = require("../models/WatchlistItem");
const Rating = require("../models/Rating");

// GET /api/profile
// Returns the profile of the currently logged-in user
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (err) {
    console.error("getProfile error:", err.message);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

// PUT /api/profile
// Updates the logged-in user's username, email, and avatar
const updateProfile = async (req, res) => {
  try {
    let { username, email, avatar } = req.body;

    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (username !== undefined) {
      username = username.trim();

      if (!username) {
        return res.status(400).json({ message: "Username cannot be empty" });
      }

      if (username.length < 3) {
        return res.status(400).json({
          message: "Username must be at least 3 characters long",
        });
      }

      user.username = username;
    }

    if (email !== undefined) {
      email = email.toLowerCase().trim();

      if (!email) {
        return res.status(400).json({ message: "Email cannot be empty" });
      }

      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          message: "Please enter a valid email address",
        });
      }

      user.email = email;
    }

    if (avatar !== undefined) {
      user.avatar = avatar;
    }

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ message: "Username or email already in use" });
    }

    console.error("updateProfile error:", err.message);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

// PUT /api/profile/password
// Changes the password of the currently logged-in user
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters long",
      });
    }

    const user = await User.findById(req.userId).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const match = await user.comparePassword(currentPassword);

    if (!match) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("changePassword error:", err.message);
    res.status(500).json({ message: "Failed to change password" });
  }
};

// DELETE /api/profile
// Deletes the logged-in user's account and related data
const deleteProfile = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove related user data first
    await WatchlistItem.deleteMany({ userId });
    await Rating.deleteMany({ userId });

    // Delete the user account
    await User.findByIdAndDelete(userId);

    // Clear auth cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    // Destroy server-side session if present
    if (req.session) {
      req.session.destroy(() => {});
    }

    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error("deleteProfile error:", err.message);
    res.status(500).json({ message: "Failed to delete account" });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  deleteProfile,
};
