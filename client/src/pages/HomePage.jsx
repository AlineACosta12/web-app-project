// MoodPlay — home page, mood picker grid and quick action buttons
// Byron Gift Ochieng Makasembo | 3062457

import { Link } from 'react-router-dom'
import './HomePage.css'

// mood options - maps to GET /api/movies/mood/:mood on the backend
const MOODS = [
  { key: 'happy',     label: 'Happy',      emoji: '😄', color: 'var(--color-happy)' },
  { key: 'sad',       label: 'Sad',        emoji: '😢', color: 'var(--color-sad)' },
  { key: 'romantic',  label: 'Romantic',   emoji: '❤️',  color: 'var(--color-romantic)' },
  { key: 'motivated', label: 'Motivated',  emoji: '💪', color: 'var(--color-motivated)' },
  { key: 'bored',     label: 'Bored',      emoji: '😑', color: 'var(--color-muted)' },
  { key: 'mindblow',  label: 'Mind Blown', emoji: '🤯', color: 'var(--color-mindblow)' },
]

const HomePage = () => {
  return (
    <div className="home-page">
      <div className="home-hero">
        <h1>
          What&apos;s your <span>mood</span>?
        </h1>
        <p>Pick how you feel and we&apos;ll find the perfect movie for you</p>
      </div>

      <p className="section-label">Choose a mood</p>

      <div className="mood-grid">
        {MOODS.map((mood) => (
          <Link
            key={mood.key}
            to={`/mood/${mood.key}`}
            className="mood-card"
            style={{ backgroundColor: mood.color }}
            aria-label={`Browse ${mood.label} movies`}
          >
            <span className="mood-emoji">{mood.emoji}</span>
            <span className="mood-name">{mood.label}</span>
          </Link>
        ))}
      </div>

      <p className="section-label">Or try something different</p>

      <div className="quick-actions">
        {/* Fortune Teller - maps to GET /api/movies/random */}
        <Link to="/random" className="action-card" style={{ backgroundColor: 'var(--color-fortune)' }}>
          <span>🔮</span>
          <p>Fortune Teller</p>
        </Link>

        {/* Big Screen - maps to GET /api/movies/nowplaying */}
        <Link to="/nowplaying" className="action-card" style={{ backgroundColor: 'var(--color-cinema)' }}>
          <span>🎬</span>
          <p>Big Screen</p>
        </Link>
      </div>
    </div>
  )
}

export default HomePage
