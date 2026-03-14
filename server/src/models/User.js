// MoodPlay — User Model
// Byron Gift Ochieng Makasembo | 3062457
// Defines the User schema for MongoDB.
// Password is hashed automatically before saving using bcrypt (10 rounds).
// Never return the password field in API responses.

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// Hash the password before saving if it has been modified
// Mongoose 8: async pre hooks resolve via the returned promise — no next() needed
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 10)
})

// Instance method to compare a plain-text password against the stored hash
userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password)
}

module.exports = mongoose.model('User', userSchema)
