// MoodPlay — API Service
// Centralises all frontend requests to the backend API.
// The backend uses session cookies, so every request includes credentials: "include".

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Reusable request helper for all API calls.
// It sends JSON requests, includes session cookies, and handles backend errors.
async function request(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || "Something went wrong.");
  }

  return data;
}

// Safely gets the movie ID from different possible API/model field names.
function getMovieId(movie) {
  return movie?.id || movie?.tmdbId || movie?.movieId;
}

// Safely gets the movie title from different possible TMDB fields.
function getMovieTitle(movie) {
  return (
    movie?.title ||
    movie?.name ||
    movie?.original_title ||
    movie?.original_name ||
    "Untitled movie"
  );
}

// Safely gets the poster path from different possible field names.
function getMoviePoster(movie) {
  return movie?.poster || movie?.poster_path || movie?.posterPath || "";
}

// Normalises API responses that may return arrays under different keys.
export function pickArray(data) {
  if (Array.isArray(data)) return data;
  return data.movies || data.results || data.watchlist || data.items || [];
}

// Normalises API responses that may return user data under different keys.
export function pickUser(data) {
  return data.user || data.profile || data.data?.user || data;
}

// Authentication API calls.
export const authApi = {
  register: (formData) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(formData),
    }),

  login: (formData) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(formData),
    }),

  logout: () =>
    request("/auth/logout", {
      method: "POST",
    }),

  me: () => request("/auth/me"),
};

// Profile API calls.
export const profileApi = {
  getProfile: () => request("/profile"),

  updateProfile: (formData) =>
    request("/profile", {
      method: "PUT",
      body: JSON.stringify(formData),
    }),

  changePassword: (formData) =>
    request("/profile/password", {
      method: "PUT",
      body: JSON.stringify({
        currentPassword: formData.currentPassword,
        oldPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      }),
    }),

  deleteProfile: () =>
    request("/profile", {
      method: "DELETE",
    }),
};

// Movie API calls.
// The frontend requests movies through the backend so the TMDB API key stays hidden.
export const moviesApi = {
  trending: () => request("/movies/nowplaying?page=1"),

  byMood: (mood, page = 1) => {
    if (mood === "bigscreen") return request(`/movies/nowplaying?page=${page}`);
    if (mood === "fortuneteller")
      return request("/movies/random").then((movie) => ({
        results: [movie],
        page: 1,
        total_pages: 1,
      }));
    return request(`/movies/mood/${encodeURIComponent(mood)}?page=${page}`);
  },

  details: (id) => request(`/movies/${id}`),

  search: (q, page = 1) =>
    request(`/movies/search?q=${encodeURIComponent(q)}&page=${page}`),
};

// Watchlist API calls.
// Movies are saved by TMDB ID, with title and poster sent in the request body.
export const watchlistApi = {
  list: () => request("/watchlist"),

  add: (movie) => {
    const movieId = getMovieId(movie);

    const body = {
      title: getMovieTitle(movie),
      poster: getMoviePoster(movie),
    };

    return request(`/watchlist/${movieId}`, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  updateStatus: (movieId, status) =>
    request(`/watchlist/${movieId}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),

  remove: (movieId) =>
    request(`/watchlist/${movieId}`, {
      method: "DELETE",
    }),
};

// Rating API calls.
// Sends both rating and score so the frontend remains compatible with either backend field name.
export const ratingApi = {
  addRating: (movie, rating, review = "") => {
    const movieId = getMovieId(movie);

    return request(`/ratings/${movieId}`, {
      method: "POST",
      body: JSON.stringify({
        rating,
        score: rating,
        title: getMovieTitle(movie),
        poster: getMoviePoster(movie),
        review,
      }),
    });
  },

  updateRating: (movie, rating, review = "") => {
    const movieId = getMovieId(movie);

    return request(`/ratings/${movieId}`, {
      method: "PUT",
      body: JSON.stringify({
        rating,
        score: rating,
        title: getMovieTitle(movie),
        poster: getMoviePoster(movie),
        review,
      }),
    });
  },

  getRatings: () => request("/ratings"),

  getRating: (movieId) => request(`/ratings/${movieId}`),

  deleteRating: (movieId) =>
    request(`/ratings/${movieId}`, {
      method: "DELETE",
    }),
};
