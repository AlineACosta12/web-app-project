const express = require("express");
const protect = require("../middleware/auth.js");

const {
  getProfile,
  updateProfile,
  changePassword,
  deleteProfile,
} = require("../controllers/profileController");

const router = express.Router();

router.get("/", protect, getProfile);
router.put("/", protect, updateProfile);
router.put("/password", protect, changePassword);
router.delete("/", protect, deleteProfile);

module.exports = router;
