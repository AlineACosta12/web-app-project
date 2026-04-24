// MoodPlay — Results Page
// Displays movie recommendations based on the selected mood.
// Users can load more results using TMDB pagination through the backend.

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MovieCard from "../components/movies/MovieCard";
import { moviesApi, pickArray } from "../services/api";

// Converts backend mood keys into user-friendly page titles.
const moodLabels = {
  happy: "Happy",
  sad: "Sad",
  motivated: "Motivated",
  romantic: "Romantic",
  bored: "Bored",
  mindblow: "Mind Blown",
  fortuneteller: "Fortune Teller",
  bigscreen: "Big Screen",
};

export default function ResultsPage() {
  const [searchParams] = useSearchParams();

  // Read the selected mood from the URL.
  // Example: /results?mood=happy
  const mood = searchParams.get("mood") || "happy";

  // Stores movie results and pagination state.
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Controls loading and error states.
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  // Fetches movies for the selected mood.
  // If append is true, new results are added to the existing list.
  async function fetchMovies(selectedMood, pageNumber, append = false) {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const data = await moviesApi.byMood(selectedMood, pageNumber);
      const newMovies = pickArray(data);

      setMovies((prev) => {
        if (!append) return newMovies;

        // Avoid duplicate movie cards when loading extra pages.
        const existingIds = new Set(prev.map((movie) => movie.id));
        const uniqueMovies = newMovies.filter(
          (movie) => !existingIds.has(movie.id),
        );

        return [...prev, ...uniqueMovies];
      });

      setPage(data.page || pageNumber);
      setTotalPages(data.total_pages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  // Refetch results whenever the selected mood changes.
  useEffect(() => {
    setMovies([]);
    setPage(1);
    setTotalPages(1);
    fetchMovies(mood, 1, false);
  }, [mood]);

  // Loads the next TMDB results page.
  function handleLoadMore() {
    const nextPage = page + 1;
    fetchMovies(mood, nextPage, true);
  }

  const canLoadMore = page < totalPages;

  return (
    <section className="container">
      <div className="section-spacing">
        <h1>Movies for: {moodLabels[mood] || mood}</h1>
        <p>Here are movie recommendations based on your mood.</p>
      </div>

      {/* Display loading, error, and empty-result states. */}
      {loading && <p>Loading results...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && movies.length === 0 && (
        <p>No movies found for this mood.</p>
      )}

      {/* Render movie results as reusable movie cards. */}
      <div className="movie-grid">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {/* Load more movies if TMDB has more pages available. */}
      {!loading && canLoadMore && (
        <div className="load-more-wrapper">
          <button
            className="btn"
            onClick={handleLoadMore}
            disabled={loadingMore}
          >
            {loadingMore ? "Loading..." : "Load More Movies"}
          </button>
        </div>
      )}
    </section>
  );
}
