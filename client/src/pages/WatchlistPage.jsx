// MoodPlay — Watchlist Page
// Displays movies saved by the logged-in user.
// Users can open movie details or remove movies from their watchlist.

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { pickArray, watchlistApi } from "../services/api";

const STATUS_LABELS = { plan: "Plan to watch", watching: "Watching", watched: "Watched" };

export default function WatchlistPage() {
  // Read basic user data from localStorage to check if the user is logged in.
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Stores watchlist items returned from the backend.
  const [watchlist, setWatchlist] = useState([]);

  // Controls loading and error states.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all watchlist items for the logged-in user.
  async function fetchWatchlist() {
    try {
      const data = await watchlistApi.list();
      setWatchlist(pickArray(data));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Load the watchlist when the page first renders.
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    fetchWatchlist();
  }, []);

  // Update the watch status for a watchlist item and reflect it in the UI.
  async function handleStatusChange(movieId, newStatus) {
    try {
      await watchlistApi.updateStatus(movieId, newStatus);
      setWatchlist((prev) =>
        prev.map((item) => {
          const itemId = item.tmdbId || item.movieId || item.id;
          return String(itemId) === String(movieId)
            ? { ...item, status: newStatus }
            : item;
        }),
      );
    } catch (err) {
      setError(err.message);
    }
  }

  // Remove one movie from the watchlist and update the UI immediately.
  async function handleRemove(movieId, title) {
    if (!movieId) {
      setError("Invalid movie ID.");
      return;
    }

    if (!window.confirm(`Remove "${title}" from your watchlist?`)) return;

    try {
      await watchlistApi.remove(movieId);

      setWatchlist((prev) =>
        prev.filter((item) => {
          const itemId = item.tmdbId || item.movieId || item.id;
          return String(itemId) !== String(movieId);
        }),
      );
    } catch (err) {
      setError(err.message);
    }
  }

  // Builds the correct poster image URL.
  // TMDB poster paths need the TMDB image base URL, while full URLs can be used directly.
  function getPosterUrl(poster) {
    if (!poster) {
      return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='450'%3E%3Crect width='300' height='450' fill='%23e0e0e0'/%3E%3C/svg%3E";
    }

    if (poster.startsWith("http")) {
      return poster;
    }

    return `https://image.tmdb.org/t/p/w500${poster}`;
  }

  // If the user is not logged in, ask them to login before viewing the watchlist.
  if (!user) {
    return (
      <section className="container">
        <h1>Your Watchlist</h1>
        <p>Please login to view your watchlist.</p>
        <Link to="/login" className="btn">
          Login
        </Link>
      </section>
    );
  }

  return (
    <section className="container">
      <h1>Your Watchlist</h1>

      {/* Display loading, error, and empty-watchlist states. */}
      {loading && <p>Loading watchlist...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && watchlist.length === 0 && <p>Your watchlist is empty.</p>}

      {/* Render all movies saved in the user's watchlist. */}
      <div className="watchlist-grid">
        {watchlist.map((item) => {
          const movieId = item.tmdbId || item.movieId || item.id;
          const title = item.title || "Untitled movie";
          const poster = item.poster || item.poster_path || item.posterPath;
          const imageUrl = getPosterUrl(poster);

          return (
            <div className="watchlist-card" key={movieId}>
              <img src={imageUrl} alt={title} className="movie-poster" />

              <h3>{title}</h3>

              <div className="watchlist-status-row">
                <select
                  className="status-select"
                  value={item.status || "plan"}
                  onChange={(e) => handleStatusChange(movieId, e.target.value)}
                >
                  {Object.entries(STATUS_LABELS).map(([val, label]) => (
                    <option key={val} value={val}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="watchlist-actions">
                <Link to={`/movie/${movieId}`} className="btn btn-small">
                  Details
                </Link>

                <button
                  className="btn btn-outline btn-small"
                  onClick={() => handleRemove(movieId, title)}
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
