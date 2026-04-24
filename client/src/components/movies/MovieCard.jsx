// MoodPlay — Movie Card Component
// Reusable card used to display a movie in grids such as Featured Movies,
// Results, and Watchlist-style pages. Clicking the card opens the movie details page.

import { Link } from "react-router-dom";

export default function MovieCard({ movie }) {
  // Build the TMDB poster image URL.
  // If the movie has no poster, show a placeholder image instead.
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/300x450?text=No+Image";

  // Use a safe title fallback in case the API response is missing a title.
  const title = movie.title || movie.name || "Untitled movie";

  return (
    <Link to={`/movie/${movie.id}`} className="movie-card">
      <img src={imageUrl} alt={title} className="movie-poster" />

      <div className="movie-card-body">
        <h3>{title}</h3>
        <p>{movie.release_date ? movie.release_date.slice(0, 4) : "N/A"}</p>
      </div>
    </Link>
  );
}
