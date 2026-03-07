// Import required modules
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Initialize Express
const app = express();
app.use(cors());

// Define a basic route
app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

// Start the server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
// MoodPlay — Main Server Entry Point
// Byron Gift Ochieng Makasembo | 3062457

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// Load environment variables from .env file
dotenv.config();

// Route handlers
const authRoutes = require("./routes/auth");
const movieRoutes = require("./routes/movies");
const watchlistRoutes = require("./routes/watchlist");
const ratingRoutes = require("./routes/ratings");

const app = express();

// Allow cross-origin requests from the React frontend
app.use(cors());

// Parse incoming JSON request bodies
app.use(express.json());

// Health check — confirms the server is running
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "MoodPlay API running" });
});

// Mount route groups
app.use("/api/auth", authRoutes); // Register and login
app.use("/api/movies", movieRoutes); // TMDB movie data
app.use("/api/watchlist", watchlistRoutes); // User watchlist (protected)
app.use("/api/ratings", ratingRoutes); // User ratings (protected)

const PORT = process.env.PORT || 5000;

// Connect to MongoDB, then start the server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
