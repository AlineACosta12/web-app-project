import { Link } from "react-router-dom";

export default function AboutPage() {
  return (
    <section className="container about-page">
      <div className="about-header">
        <h1>About MoodPlay</h1>
        <p className="about-tagline">
          Find the perfect movie for how you feel right now.
        </p>
      </div>

      <div className="about-section">
        <h2>What is MoodPlay?</h2>
        <p>
          MoodPlay is a mood-based movie recommendation app. Instead of
          endlessly scrolling through catalogues, you pick how you are feeling
          and MoodPlay surfaces movies that match that energy — powered by The
          Movie Database (TMDB).
        </p>
      </div>

      <div className="about-section">
        <h2>How it works</h2>
        <div className="about-steps">
          <div className="about-step">
            <span className="about-step-number">1</span>
            <div>
              <h3>Pick a mood</h3>
              <p>
                Choose from eight mood cards on the home page — Happy, Sad,
                Motivated, Romantic, Bored, Mind Blown, Fortune Teller, or Big
                Screen.
              </p>
            </div>
          </div>

          <div className="about-step">
            <span className="about-step-number">2</span>
            <div>
              <h3>Browse recommendations</h3>
              <p>
                MoodPlay maps each mood to a set of film genres and fetches
                matching movies live from TMDB. Big Screen shows what is
                currently playing in cinemas; Fortune Teller picks one random
                movie as a surprise.
              </p>
            </div>
          </div>

          <div className="about-step">
            <span className="about-step-number">3</span>
            <div>
              <h3>Save and rate</h3>
              <p>
                Create a free account to add movies to your watchlist, track
                your watch status, and leave a star rating with an optional
                review.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="about-section">
        <h2>Mood guide</h2>
        <div className="about-moods">
          <div className="about-mood-item">
            <strong>Happy</strong>
            <span>Comedy, Animation, Family</span>
          </div>
          <div className="about-mood-item">
            <strong>Sad</strong>
            <span>Drama</span>
          </div>
          <div className="about-mood-item">
            <strong>Motivated</strong>
            <span>Action, Adventure</span>
          </div>
          <div className="about-mood-item">
            <strong>Romantic</strong>
            <span>Romance</span>
          </div>
          <div className="about-mood-item">
            <strong>Bored</strong>
            <span>Thriller, Mystery</span>
          </div>
          <div className="about-mood-item">
            <strong>Mind Blown</strong>
            <span>Science Fiction, Fantasy</span>
          </div>
          <div className="about-mood-item">
            <strong>Fortune Teller</strong>
            <span>One random surprise movie</span>
          </div>
          <div className="about-mood-item">
            <strong>Big Screen</strong>
            <span>Now playing in cinemas</span>
          </div>
        </div>
      </div>

      <div className="about-section">
        <h2>Technology</h2>
        <p>
          MoodPlay is built with React on the frontend and Node.js with Express
          on the backend. Data is stored in MongoDB and movie information is
          fetched in real time from the{" "}
          <strong>TMDB API</strong>. Authentication uses server-side sessions.
        </p>
      </div>

      <div className="about-cta">
        <p>Ready to find your next watch?</p>
        <Link to="/" className="btn">
          Pick a mood
        </Link>
      </div>
    </section>
  );
}
