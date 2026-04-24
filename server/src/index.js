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

const { connectDB } = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const movieRoutes = require("./routes/movieRoutes");
const watchlistRoutes = require("./routes/watchlistRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const profileRoutes = require("./routes/profileRoutes");

const app = express();

// set up Pug as the template engine for server-rendered HTML views
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

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

app.get("/api", (req, res) => {
  res.json({ message: "MoodPlay API base route is working" });
});

// Root route — renders the mood picker landing page using Pug template
app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "MoodPlay API running" });
});

// HTML browse routes — renders movie results using Pug templates
// these use the TMDB API on the server and return HTML, not JSON
const axios = require("axios");

const MOOD_GENRES = {
  happy: "35,16,10751",
  sad: "18",
  romantic: "10749",
  motivated: "28,12",
  bored: "53,9648",
  mindblow: "878,14",
};

app.get("/browse/mood/:mood", async (req, res) => {
  const { mood } = req.params;
  const genres = MOOD_GENRES[mood.toLowerCase()];

  if (!genres) {
    return res.render("error", { title: "Error", message: `Unknown mood: ${mood}` });
  }

  try {
    const response = await axios.get("https://api.themoviedb.org/3/discover/movie", {
      params: {
        api_key: process.env.TMDB_API_KEY,
        with_genres: genres,
        sort_by: "popularity.desc",
        include_adult: false,
        language: "en-IE",
      },
    });

    const movies = response.data.results || [];
    res.render("movies", { title: `${mood} movies`, mood, movies });
  } catch (err) {
    res.render("error", { title: "Error", message: "Could not load movies right now" });
  }
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
