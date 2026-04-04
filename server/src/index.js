// MoodPlay — Main Server Entry Point
// Sets up the Express server, middleware, database connection,
// and API routes for the MoodPlay application.

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

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET || process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  }),
);

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

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
