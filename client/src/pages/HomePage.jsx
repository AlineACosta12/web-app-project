// MoodPlay — Home Page
// This page allows users to select a mood and browse featured movie recommendations.
// The mood cards represent the main interaction for the MoodPlay application.

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MovieCard from "../components/movies/MovieCard";
import { moviesApi, pickArray } from "../services/api";

// Mood options displayed on the home page.
// Each mood has a backend key, display title, tagline, GIF icon, and CSS colour class.
const moods = [
  {
    key: "happy",
    title: "Happy",
    tagline: "Feel-good picks",
    gif: "/moods/happy.gif",
    color: "happy-card",
  },
  {
    key: "sad",
    title: "Sad",
    tagline: "Emotional stories",
    gif: "/moods/sad.gif",
    color: "sad-card",
  },
  {
    key: "motivated",
    title: "Motivated",
    tagline: "Inspiring wins",
    gif: "/moods/motivation.gif",
    color: "motivated-card",
  },
  {
    key: "romantic",
    title: "Romantic",
    tagline: "Date-night vibes",
    gif: "/moods/heart.gif",
    color: "romantic-card",
  },
  {
    key: "bored",
    title: "Bored",
    tagline: "Easy entertainment",
    gif: "/moods/bored.gif",
    color: "bored-card",
  },
  {
    key: "mindblow",
    title: "Mind Blown",
    tagline: "Twists & sci-fi",
    gif: "/moods/brain.gif",
    color: "mindblown-card",
  },
  {
    key: "fortuneteller",
    title: "Fortune Teller",
    tagline: "Random surprise",
    gif: "/moods/dice.gif",
    color: "fortune-card",
  },
  {
    key: "bigscreen",
    title: "Big Screen",
    tagline: "Now playing",
    gif: "/moods/viewfinder.gif",
    color: "bigscreen-card",
  },
];

export default function HomePage() {
  const navigate = useNavigate();

  // Stores featured movie data loaded from the backend API.
  const [movies, setMovies] = useState([]);

  // Controls loading and error messages for the featured movies section.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load featured movies when the page first renders.
  useEffect(() => {
    async function fetchTrending() {
      try {
        const data = await moviesApi.trending();
        setMovies(pickArray(data));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTrending();
  }, []);

  return (
    <section className="container" id="moods">
      <div className="mood-board-header">
        <h1>How are you feeling today?</h1>
        <p>Tap a mood card to browse movies.</p>
      </div>

      <div className="mood-board-grid">
        {moods.map((mood) => (
          <button
            key={mood.key}
            className={`mood-board-card ${mood.color}`}
            // Navigate to the results page and pass the selected mood in the URL.
            onClick={() =>
              navigate(`/results?mood=${encodeURIComponent(mood.key)}`)
            }
          >
            <div className="mood-card-top">
              <div className="mood-card-content">
                <img
                  src={mood.gif}
                  alt={`${mood.title} mood`}
                  className="mood-gif"
                />

                <div>
                  <h3>{mood.title}</h3>
                  <p>{mood.tagline}</p>
                </div>
              </div>
            </div>

            <div className="mood-card-bottom">
              <span className="mood-arrow">→</span>
            </div>
          </button>
        ))}
      </div>

      <section className="section-spacing">
        <h2>Featured Movies</h2>

        {/* Display loading and error states for featured movies. */}
        {loading && <p>Loading movies...</p>}
        {error && <p className="error-message">{error}</p>}

        {/* Render featured movie cards. */}
        <div className="movie-grid">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>
    </section>
  );
}
