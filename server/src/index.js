// MoodPlay — Main Server Entry Point
// Sets up the Express server, middleware, database connection,
// session-based authentication, and API routes for the MoodPlay application.

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");

// Load environment variables from the server root .env file
dotenv.config({ path: path.join(__dirname, "../.env") });

console.log("MONGODB_URI loaded:", !!process.env.MONGODB_URI);

const { connectDB } = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const movieRoutes = require("./routes/movieRoutes");
const watchlistRoutes = require("./routes/watchlistRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const profileRoutes = require("./routes/profileRoutes");

const app = express();

// Allow the React frontend to send requests with session cookies
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

// Parse JSON request bodies
app.use(express.json());

// Parse cookies sent by the browser
app.use(cookieParser());

// Session middleware
// This replaces JWT authentication.
app.use(
  session({
    secret: process.env.SESSION_SECRET || "moodplay_session_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  }),
);

app.get("/api", (req, res) => {
  res.json({ message: "MoodPlay API base route is working" });
});

// Root route
app.get("/", (req, res) => {
  res.send("MoodPlay API is running");
});

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "MoodPlay API running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/profile", profileRoutes);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error.message);
    process.exit(1);
  });
