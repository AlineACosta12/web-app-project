// MoodPlay — Movie Controller (TMDB Proxy Logic)
// Byron Gift Ochieng Makasembo | 3062457
// Handles all TMDB API calls server-side. The API key never reaches the frontend.
//
// *** EXTRA CREDIT ***
// The TMDB API integration is functionality researched and implemented beyond the
// scope of the module lectures. It involves:
//   - Integrating a third-party REST API (The Movie Database — themoviedb.org)
//   - Proxying all external API calls through the backend to protect the API key
//   - Mapping custom mood categories to TMDB genre IDs (mood-to-genre system)
//   - Filtering now-playing results by region (region=IE for Irish cinemas)
//   - Implementing a randomisation algorithm for the Fortune Teller feature
// Reference: https://developer.themoviedb.org/reference/intro/getting-started

const axios = require("axios");

// Guard against missing API key
if (!process.env.TMDB_API_KEY) {
  throw new Error("TMDB API key is missing in environment variables");
}

// Build a pre-configured axios instance for TMDB using env vars
const tmdb = axios.create({
  baseURL: process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3",
  timeout: 5000,
  params: {
    api_key: process.env.TMDB_API_KEY,
  },
});

// Maps mood names (from the route param) to TMDB genre ID strings
const MOOD_GENRES = {
  happy: "35,16,10751", // Comedy, Animation, Family
  sad: "18", // Drama
  romantic: "10749", // Romance
  motivated: "28,12", // Action, Adventure
  bored: "53,9648", // Thriller, Mystery
  mindblow: "878,14", // Science Fiction, Fantasy
};

// GET /api/movies/mood/:mood
// Discovers movies matching the mood via TMDB genre filter
const getMoviesByMood = async (req, res) => {
  const { mood } = req.params;
  const genres = MOOD_GENRES[mood.toLowerCase()];
  const page = Number(req.query.page) || 1;

  // Reject unknown moods immediately
  if (!genres) {
    return res.status(400).json({ message: `Unknown mood: ${mood}` });
  }

  if (!Number.isInteger(page) || page <= 0) {
    return res.status(400).json({ message: "Invalid page number" });
  }

  try {
    const response = await tmdb.get("/discover/movie", {
      params: {
        with_genres: genres,
        sort_by: "popularity.desc",
        page,
        include_adult: false,
        language: "en-IE",
      },
    });

    res.json(response.data);
  } catch (err) {
    console.error("TMDB mood error:", {
      message: err.message,
      status: err.response?.status,
    });
    res.status(502).json({ message: "Failed to fetch movies from TMDB" });
  }
};

// GET /api/movies/random
// Fetches a page of popular movies and picks one at random (Fortune Teller)
const getRandomMovie = async (req, res) => {
  try {
    // Get a random page between 1 and 10 for variety
    const randomPage = Math.floor(Math.random() * 10) + 1;

    const response = await tmdb.get("/movie/popular", {
      params: { page: randomPage, language: "en-IE" },
    });

    const movies = response.data.results.filter((movie) => movie.poster_path);

    if (!movies || !movies.length) {
      return res.status(404).json({ message: "No movies found" });
    }

    // Pick a random movie from the results
    const randomMovie = movies[Math.floor(Math.random() * movies.length)];
    res.json(randomMovie);
  } catch (err) {
    console.error("TMDB random error:", {
      message: err.message,
      status: err.response?.status,
    });
    res.status(502).json({ message: "Failed to fetch random movie from TMDB" });
  }
};

// GET /api/movies/nowplaying
// Returns movies currently in cinemas (Big Screen feature)
const getNowPlaying = async (req, res) => {
  const page = Number(req.query.page) || 1;

  if (!Number.isInteger(page) || page <= 0) {
    return res.status(400).json({ message: "Invalid page number" });
  }

  try {
    const response = await tmdb.get("/movie/now_playing", {
      params: { page, region: "IE", language: "en-IE" },
    });

    res.json(response.data);
  } catch (err) {
    console.error("TMDB now_playing error:", {
      message: err.message,
      status: err.response?.status,
    });
    res.status(502).json({ message: "Failed to fetch now playing from TMDB" });
  }
};

// GET /api/movies/search?q=&page=
// Searches TMDB by movie title using the query string param
const searchMovies = async (req, res) => {
  const { q } = req.query;
  const page = Number(req.query.page) || 1;

  // Require a non-empty search query
  if (!q || q.trim() === "") {
    return res.status(400).json({ message: 'Search query "q" is required' });
  }

  if (!Number.isInteger(page) || page <= 0) {
    return res.status(400).json({ message: "Invalid page number" });
  }

  try {
    const response = await tmdb.get("/search/movie", {
      params: {
        query: q.trim(),
        page,
        include_adult: false,
        language: "en-IE",
      },
    });

    res.json(response.data);
  } catch (err) {
    console.error("TMDB search error:", {
      message: err.message,
      status: err.response?.status,
    });
    res.status(502).json({ message: "Failed to search movies on TMDB" });
  }
};

// GET /api/movies/:tmdbId
// Fetches full detail for a single movie by its TMDB ID
const getMovieById = async (req, res) => {
  const { tmdbId } = req.params;
  const movieID = Number(tmdbId);

  if (!Number.isInteger(movieID) || movieID <= 0) {
    return res.status(400).json({ message: "Invalid TMDB ID" });
  }

  try {
    const response = await tmdb.get(`/movie/${movieID}`, {
      params: { language: "en-IE" },
    });

    res.json(response.data);
  } catch (err) {
    // Surface 404 cleanly if TMDB doesn't recognise the ID
    if (err.response && err.response.status === 404) {
      return res.status(404).json({ message: "Movie not found" });
    }

    console.error("TMDB movie detail error:", {
      message: err.message,
      status: err.response?.status,
    });
    res
      .status(502)
      .json({ message: "Failed to fetch movie details from TMDB" });
  }
};

module.exports = {
  getMoviesByMood,
  getRandomMovie,
  getNowPlaying,
  searchMovies,
  getMovieById,
};
