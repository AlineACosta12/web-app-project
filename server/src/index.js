// MoodPlay — Main Server Entry Point
// Byron Gift Ochieng Makasembo | 3062457

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session");

// Load environment variables from .env file
dotenv.config();

// Route handlers
const authRoutes = require("./routes/auth");
const movieRoutes = require("./routes/movies");
const watchlistRoutes = require("./routes/watchlist");
const ratingRoutes = require("./routes/ratings");

const app = express();

// Allow cross-origin requests from the React frontend.
// credentials:true is required so the browser sends cookies with requests.
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));

// Parse incoming JSON request bodies
app.use(express.json());

// Parse cookies from incoming requests (needed to read the JWT auth cookie)
app.use(cookieParser());

// Server-side session — stores logged-in user state on the server.
// Each browser gets a session ID cookie (connect.sid) to identify its session.
app.use(session({
  secret: process.env.SESSION_SECRET || process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,      // Not accessible via JavaScript on the client
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days, matching JWT expiry
  },
}));

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
