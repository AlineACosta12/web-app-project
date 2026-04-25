// MoodPlay — Search Page
// Lets users search for movies by title using the backend search endpoint.
// Results are displayed as movie cards, with support for loading more pages.

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MovieCard from "../components/movies/MovieCard";
import { moviesApi, pickArray } from "../services/api";

export default function SearchPage() {
  // Read and update the search query from the URL.
  // Example: /search?q=inception
  const [searchParams, setSearchParams] = useSearchParams();

  // Get the first query value from the URL when the page loads.
  const initialQuery = searchParams.get("q") || "";

  // Stores the text currently typed in the search input.
  const [inputValue, setInputValue] = useState(initialQuery);

  // Stores the search query that is actually sent to the backend.
  const [query, setQuery] = useState(initialQuery);

  // Stores the list of movies returned from the backend.
  const [results, setResults] = useState([]);

  // Tracks the current results page for pagination.
  const [page, setPage] = useState(1);

  // Controls whether the "Load More" button should be shown.
  const [hasMore, setHasMore] = useState(false);

  // Controls loading messages while the search request is running.
  const [loading, setLoading] = useState(false);

  // Stores any API or validation error message.
  const [error, setError] = useState("");

  // Stores a validation message shown when the user submits an empty search.
  const [inputError, setInputError] = useState("");

  // Reference to the input element.
  const inputRef = useRef(null);

  // Run a search whenever the query or page number changes.
  useEffect(() => {
    // If the search box is empty, clear the results and stop.
    if (!query.trim()) {
      setResults([]);
      setHasMore(false);
      return;
    }

    async function runSearch() {
      setLoading(true);
      setError("");

      try {
        // Call the backend search endpoint.
        const data = await moviesApi.search(query, page);

        // pickArray helps support different API response formats.
        const movies = pickArray(data);

        // TMDB-style responses usually include total_pages.
        const totalPages = data.total_pages || 1;

        if (page === 1) {
          // First page replaces the current results.
          setResults(movies);
        } else {
          // Extra pages are added to the existing list.
          setResults((prev) => [...prev, ...movies]);
        }

        // Show Load More only if more pages are available.
        setHasMore(page < totalPages);
      } catch (err) {
        // Show API errors on the page.
        setError(err.message);
      } finally {
        // Stop the loading message.
        setLoading(false);
      }
    }

    runSearch();
  }, [query, page]);

  // Handle the search form submission.
  function handleSubmit(e) {
    e.preventDefault();

    // Remove extra spaces from the search text.
    const trimmed = inputValue.trim();

    // Show a message if the search box is empty instead of silently doing nothing.
    if (!trimmed) {
      setInputError("Please enter a movie title to search.");
      return;
    }

    setInputError("");

    // Start again from page 1 for a new search.
    setPage(1);
    setResults([]);

    // Update the active query and the URL query string.
    setQuery(trimmed);
    setSearchParams({ q: trimmed });
  }

  // Load the next page of results.
  function handleLoadMore() {
    setPage((prev) => prev + 1);
  }

  return (
    <section className="container">
      {/* Page title and short description */}
      <div className="search-page-header">
        <h1>Search Movies</h1>
        <p>Find any movie by title</p>
      </div>

      {/* Search form */}
      <form onSubmit={handleSubmit} className="search-form">
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="e.g. Inception, The Matrix..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          autoFocus
        />

        <button type="submit" className="btn search-submit-btn">
          Search
        </button>
      </form>

      {/* Validation message for empty search submission */}
      {inputError && <p className="error-message">{inputError}</p>}

      {/* Error message */}
      {error && <p className="error-message">{error}</p>}

      {/* Message shown when the search has no results */}
      {!loading && query && results.length === 0 && !error && (
        <p className="search-no-results">
          No results found for &quot;{query}&quot;.
        </p>
      )}

      {/* Search results */}
      {results.length > 0 && (
        <>
          <p className="search-count">
            Showing results for <strong>&quot;{query}&quot;</strong>
          </p>

          {/* Movie cards grid */}
          <div className="movie-grid">
            {results.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          {/* Loading message for extra pages */}
          {loading && <p className="search-loading">Loading more...</p>}

          {/* Load more button */}
          {hasMore && !loading && (
            <div className="load-more-wrapper">
              <button className="btn btn-outline" onClick={handleLoadMore}>
                Load More
              </button>
            </div>
          )}
        </>
      )}

      {/* Loading message for the first search */}
      {loading && results.length === 0 && (
        <p className="search-loading">Searching...</p>
      )}
    </section>
  );
}
