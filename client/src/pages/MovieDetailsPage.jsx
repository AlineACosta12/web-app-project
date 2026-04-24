// MoodPlay — Movie Details Page
// This page displays full movie information.
// Users can add a movie to their watchlist, rate the movie, or go back to the previous page.

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { moviesApi, watchlistApi, ratingApi, authApi } from "../services/api";

export default function MovieDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Stores the selected movie details.
  const [movie, setMovie] = useState(null);

  // Stores the user's selected rating and whether they already rated this movie.
  const [rating, setRating] = useState("");
  const [review, setReview] = useState("");
  const [existingRating, setExistingRating] = useState(null);

  // Controls loading, success, and error messages.
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageIsError, setMessageIsError] = useState(false);
  const [error, setError] = useState("");

  // Fetch movie details and the user's existing rating when the page loads.
  useEffect(() => {
    async function fetchMovie() {
      try {
        const data = await moviesApi.details(id);
        setMovie(data.movie || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    async function fetchExistingRating() {
      try {
        const data = await ratingApi.getRating(id);
        const score = data.score || data.rating;
        setExistingRating(data);
        setRating(String(score));
        setReview(data.review || "");
      } catch {
        // 404 means no rating yet — that's fine
      }
    }

    fetchMovie();

    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (storedUser) fetchExistingRating();
  }, [id]);

  // Gets the movie ID safely, supporting different possible field names.
  function getMovieId() {
    return movie?.id || movie?.tmdbId || movie?.movieId || id;
  }

  // Gets the movie title safely, supporting TMDB response variations.
  function getMovieTitle() {
    return (
      movie?.title ||
      movie?.name ||
      movie?.original_title ||
      movie?.original_name ||
      "Untitled movie"
    );
  }

  // Gets the poster path safely for TMDB image display.
  function getPosterPath() {
    return movie?.poster_path || movie?.poster || movie?.posterPath || "";
  }

  // Confirms the backend session is still valid before protected actions.
  async function checkRealLogin() {
    try {
      await authApi.me();
      return true;
    } catch {
      localStorage.removeItem("user");
      setMessageIsError(true);
      setMessage("Please login again.");
      return false;
    }
  }

  // Adds the selected movie to the logged-in user's watchlist.
  async function handleAddToWatchlist() {
    const isLoggedIn = await checkRealLogin();

    if (!isLoggedIn) {
      return;
    }

    const movieId = getMovieId();
    const movieTitle = getMovieTitle();
    const poster = getPosterPath();

    try {
      await watchlistApi.add({
        ...movie,
        id: movieId,
        tmdbId: movieId,
        movieId: movieId,
        title: movieTitle,
        poster: poster,
        poster_path: poster,
      });

      setMessageIsError(false);
      setMessage("Movie added to watchlist.");
    } catch (err) {
      if (err.message.toLowerCase().includes("authentication")) {
        localStorage.removeItem("user");
        setMessageIsError(true);
        setMessage("Please login again.");
        return;
      }

      setMessageIsError(true);
      setMessage(err.message);
    }
  }

  // Saves or updates the user's rating for the selected movie.
  async function handleRatingSubmit(e) {
    e.preventDefault();
    setMessage("");

    // Client-side validation for rating selection.
    if (!rating) {
      setMessageIsError(true);
      setMessage("Please choose a rating before saving.");
      return;
    }

    const isLoggedIn = await checkRealLogin();

    if (!isLoggedIn) {
      return;
    }

    const movieId = getMovieId();

    const movieForRating = {
      ...movie,
      id: movieId,
      title: getMovieTitle(),
      poster: getPosterPath(),
    };

    try {
      if (existingRating) {
        await ratingApi.updateRating(movieForRating, Number(rating), review);
        setExistingRating((prev) => ({ ...prev, score: Number(rating), review }));
        setMessageIsError(false);
        setMessage("Rating updated.");
      } else {
        const created = await ratingApi.addRating(movieForRating, Number(rating), review);
        setExistingRating(created);
        setMessageIsError(false);
        setMessage("Rating saved.");
      }
    } catch (err) {
      // If the movie was already rated despite our check, update anyway.
      if (err.message.toLowerCase().includes("already")) {
        try {
          await ratingApi.updateRating(movieForRating, Number(rating), review);
          setExistingRating((prev) => ({ ...prev, score: Number(rating), review }));
          setMessageIsError(false);
          setMessage("Rating updated.");
        } catch (updateErr) {
          setMessageIsError(true);
          setMessage(updateErr.message);
        }
      } else if (err.message.toLowerCase().includes("authentication")) {
        localStorage.removeItem("user");
        setMessageIsError(true);
        setMessage("Please login again.");
      } else {
        setMessageIsError(true);
        setMessage(err.message);
      }
    }
  }

  // Deletes the user's rating for this movie.
  async function handleDeleteRating() {
    if (!window.confirm(`Delete your rating for "${getMovieTitle()}"? This cannot be undone.`)) return;

    const isLoggedIn = await checkRealLogin();
    if (!isLoggedIn) return;

    const movieId = getMovieId();

    try {
      await ratingApi.deleteRating(movieId);
      setExistingRating(null);
      setRating("");
      setReview("");
      setMessageIsError(false);
      setMessage("Rating deleted.");
    } catch (err) {
      setMessageIsError(true);
      setMessage(err.message);
    }
  }

  // Loading state while movie data is being fetched.
  if (loading) {
    return (
      <section className="container">
        <p>Loading movie details...</p>
      </section>
    );
  }

  // Error state if the movie request fails.
  if (error) {
    return (
      <section className="container">
        <p className="error-message">{error}</p>
      </section>
    );
  }

  // Fallback if no movie is found.
  if (!movie) {
    return (
      <section className="container">
        <p>Movie not found.</p>
      </section>
    );
  }

  const posterPath = getPosterPath();

  const imageUrl = posterPath
    ? `https://image.tmdb.org/t/p/w500${posterPath}`
    : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='450'%3E%3Crect width='300' height='450' fill='%23e0e0e0'/%3E%3C/svg%3E";

  return (
    <section className="container">
      <div className="movie-details">
        <img src={imageUrl} alt={getMovieTitle()} className="details-poster" />

        <div className="details-content">
          <h1>{getMovieTitle()}</h1>

          <p>
            <strong>Release date:</strong> {movie.release_date || "N/A"}
          </p>

          <p>
            <strong>TMDB rating:</strong> {movie.vote_average || "N/A"}
          </p>

          <p>{movie.overview || "No overview available."}</p>

          <div className="movie-detail-actions">
            <button className="btn" onClick={handleAddToWatchlist}>
              Add to Watchlist
            </button>

            <button
              className="back-btn inline-back-btn"
              onClick={() => navigate(-1)}
            >
              ← Back
            </button>
          </div>

          <form onSubmit={handleRatingSubmit} className="rating-form">
            <label htmlFor="rating">
              {existingRating ? "Your rating (update)" : "Your rating"}
            </label>

            <select
              id="rating"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required
            >
              <option value="">Choose rating</option>
              <option value="1">1 star</option>
              <option value="2">2 stars</option>
              <option value="3">3 stars</option>
              <option value="4">4 stars</option>
              <option value="5">5 stars</option>
            </select>

            <label htmlFor="review">Review (optional)</label>
            <textarea
              id="review"
              className="review-textarea"
              placeholder="Write your thoughts..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={3}
              maxLength={500}
            />

            <div className="rating-form-actions">
              <button type="submit" className="btn btn-outline">
                {existingRating ? "Update Rating" : "Save Rating"}
              </button>

              {existingRating && (
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDeleteRating}
                >
                  Delete Rating
                </button>
              )}
            </div>
          </form>

          {message && (
            <p className={messageIsError ? "error-message" : "success-message"}>
              {message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
