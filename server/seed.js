// MoodPlay — Database Seed Script
// Byron Gift Ochieng Makasembo | 3062457
// Run this script to populate the database with sample data for demonstration.
// Usage: node seed.js
// Requires: server/.env to be configured with a valid MONGODB_URI

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables from the server root .env file
dotenv.config({ path: path.join(__dirname, ".env") });

// Import models
const User = require("./src/models/User");
const WatchlistItem = require("./src/models/WatchlistItem");
const Rating = require("./src/models/Rating");

const seed = async () => {
  try {
    console.log("MONGODB_URI loaded in seed:", !!process.env.MONGODB_URI);

    // Connect to MongoDB using the URI from .env
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Remove existing demo users if they already exist
    await User.deleteMany({
      email: { $in: ["demo@moodplay.com", "testuser@moodplay.com"] },
    });
    await User.deleteMany({
      username: { $in: ["demouser", "testuser"] },
    });

    console.log("Cleared existing seed accounts");
    // Create two demo users
    // Passwords are hashed by the User model pre-save hook
    const user1 = await User.create({
      username: "demouser",
      email: "demo@moodplay.com",
      password: "Demo1234",
      avatar: "",
    });

    const user2 = await User.create({
      username: "testuser",
      email: "testuser@moodplay.com",
      password: "Test1234",
      avatar: "",
    });

    console.log(`Created users: ${user1.username}, ${user2.username}`);

    // Clear any existing watchlist/rating data for these users
    await WatchlistItem.deleteMany({ userId: { $in: [user1._id, user2._id] } });
    await Rating.deleteMany({ userId: { $in: [user1._id, user2._id] } });

    // Add watchlist items for user1
    // These reference real TMDB movie IDs
    await WatchlistItem.insertMany([
      {
        userId: user1._id,
        tmdbId: 550,
        title: "Fight Club",
        poster: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
        status: "watched",
      },
      {
        userId: user1._id,
        tmdbId: 27205,
        title: "Inception",
        poster: "/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
        status: "watching",
      },
      {
        userId: user1._id,
        tmdbId: 238,
        title: "The Godfather",
        poster: "/3bhkrj58Vtu7enYsLegHnDmni1Y.jpg",
        status: "plan",
      },
    ]);

    // Add watchlist items for user2
    await WatchlistItem.insertMany([
      {
        userId: user2._id,
        tmdbId: 299536,
        title: "Avengers: Infinity War",
        poster: "/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg",
        status: "watched",
      },
      {
        userId: user2._id,
        tmdbId: 19404,
        title: "Dilwale Dulhania Le Jayenge",
        poster: "/2CAL2433ZeIihfX1Hb2139CX0pW.jpg",
        status: "plan",
      },
    ]);

    console.log("Created watchlist items");

    // Add ratings for user1
    await Rating.insertMany([
      {
        userId: user1._id,
        tmdbId: 550,
        title: "Fight Club",
        score: 5,
        review: "One of the best films ever made. Mind-blowing twist.",
      },
      {
        userId: user1._id,
        tmdbId: 27205,
        title: "Inception",
        score: 4,
        review:
          "Visually stunning and cleverly written. A bit complex on first watch.",
      },
    ]);

    // Add ratings for user2
    await Rating.insertMany([
      {
        userId: user2._id,
        tmdbId: 299536,
        title: "Avengers: Infinity War",
        score: 5,
        review: "Epic crossover. Thanos is the best villain in the MCU.",
      },
    ]);

    console.log("Created ratings");

    console.log("\nSeed complete. Demo accounts:");
    console.log("  Email: demo@moodplay.com    Password: Demo1234");
    console.log("  Email: testuser@moodplay.com  Password: Test1234");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seed();
