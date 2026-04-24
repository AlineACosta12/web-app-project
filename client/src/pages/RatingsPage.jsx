// MoodPlay — Ratings Page
// Shows all movies the logged-in user has rated.
// Users can also delete any rating from this page.

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ratingApi, moviesApi } from "../services/api";

// Fixed list used to display the 5-star rating UI.
const STARS = [1, 2, 3, 4, 5];

export default function RatingsPage() {
  // Get the logged-in user from localStorage.
  // If there is no user saved, the page will show a login message instead.
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Stores the user's ratings returned from the backend.
  const [ratings, setRatings] = useState([]);

  // Controls the loading message while ratings are being fetched.
  const [loading, setLoading] = useState(true);

  // Stores any error message from the API.
  const [error, setError] = useState("");

  // Fetch all ratings for the logged-in user.
  async function fetchRatings() {
    try {
      const data = await ratingApi.getRatings();

      // Some API responses may return the array directly,
      // while others may return it inside a "ratings" property.
      const list = Array.isArray(data) ? data : data.ratings || [];

      // If a rating does not already include a poster,
      // fetch the movie details from the backend/TMDB to fill it in.
      const filled = await Promise.all(
        list.map(async (item) => {
          if (item.poster) return item;

          try {
            const movieData = await moviesApi.details(item.tmdbId);

            return {
              ...item,
              poster: movieData.poster_path || movieData.poster || "",
            };
          } catch {
            // If the poster cannot be fetched, keep the original rating item.
            return item;
          }
        }),
      );

      // Save the completed ratings list in state.
      setRatings(filled);
    } catch (err) {
      // Show any API error on the page.
      setError(err.message);
    } finally {
      // Stop showing the loading message.
      setLoading(false);
    }
  }

  useEffect(() => {
    // If there is no logged-in user, stop loading and do not call the API.
    if (!user) {
      setLoading(false);
      return;
    }

    // Load ratings when the page first opens.
    fetchRatings();
  }, []);

  // Delete one rating after the user confirms the action.
  async function handleDelete(movieId, title) {
    const confirmed = window.confirm(
      `Delete your rating for "${title}"? This cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      // Delete the rating from the backend.
      await ratingApi.deleteRating(movieId);

      // Remove the deleted rating from the page without reloading.
      setRatings((prev) => {
        const idStr = String(movieId);

        return prev.filter(
          (r) => String(r.tmdbId || r.movieId || r.id) !== idStr,
        );
      });
    } catch (err) {
      // Show delete error if something goes wrong.
      setError(err.message);
    }
  }

  // Build the full poster image URL.
  // If no poster exists, return a simple placeholder image.
  function getPosterUrl(poster) {
    if (!poster) {
      return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='450'%3E%3Crect width='300' height='450' fill='%23e0e0e0'/%3E%3C/svg%3E";
    }

    // If the poster is already a full URL, use it directly.
    if (poster.startsWith("http")) return poster;

    // Otherwise, create the TMDB poster URL.
    return `https://image.tmdb.org/t/p/w500${poster}`;
  }

  // If the user is not logged in, ask them to login.
  if (!user) {
    return (
      <section className="container">
        <h1>Your Ratings</h1>
        <p>Please login to view your ratings.</p>

        <Link to="/login" className="btn">
          Login
        </Link>
      </section>
    );
  }

  return (
    <section className="container">
      <h1>Your Ratings</h1>

      {/* Loading message */}
      {loading && <p>Loading ratings...</p>}

      {/* Error message */}
      {error && <p className="error-message">{error}</p>}

      {/* Empty state message */}
      {!loading && ratings.length === 0 && !error && (
        <p>You have not rated any movies yet.</p>
      )}

      {/* Ratings list */}
      <div className="ratings-grid">
        {ratings.map((item) => {
          // Support different possible ID names from the backend.
          const movieId = item.tmdbId || item.movieId || item.id;

          // Use fallback text if the title is missing.
          const title = item.title || "Untitled movie";

          // Support both local stored poster and TMDB poster_path.
          const poster = item.poster || item.poster_path;

          // Support different possible score/rating property names.
          const score = item.score || item.rating || 0;

          return (
            <div className="rating-card" key={movieId}>
              {/* Movie poster */}
              <img
                src={getPosterUrl(poster)}
                alt={title}
                className="rating-card-poster"
              />

              <div className="rating-card-body">
                {/* Movie title */}
                <h3>{title}</h3>

                {/* Star rating display */}
                <div className="star-display">
                  {STARS.map((s) => (
                    <span
                      key={s}
                      className={s <= score ? "star filled" : "star"}
                    >
                      ★
                    </span>
                  ))}

                  <span className="star-label">{score}/5</span>
                </div>

                {/* Optional user review */}
                {item.review && (
                  <p className="rating-review">&quot;{item.review}&quot;</p>
                )}

                {/* Card action buttons */}
                <div className="rating-card-actions">
                  <Link
                    to={`/movie/${movieId}`}
                    className="btn btn-small btn-outline"
                  >
                    Details
                  </Link>

                  <button
                    className="btn btn-small btn-danger"
                    onClick={() => handleDelete(movieId, title)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
