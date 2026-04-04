// MoodPlay — User Model
// Represents a user account in the database.
// Passwords are hashed automatically before saving using bcrypt.
// The password field is excluded from query results by default.

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false, // Exclude password from query results by default
    },
    avatar: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

// Hash the password before saving if it has been modified
// Mongoose 8: async pre hooks resolve via the returned promise — no next() needed
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Instance method to compare a plain-text password against the stored hash
userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model("User", userSchema);
