// MoodPlay — app root, sets up routing and auth context
// Byron Gift Ochieng Makasembo | 3062457

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ResultsPage from './pages/ResultsPage'
import MovieDetailsPage from './pages/MovieDetailsPage'
import WatchlistPage from './pages/WatchlistPage'
import ProfilePage from './pages/ProfilePage'
import './App.css'

// redirects logged-in users away from login/register pages
const GuestOnly = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? <Navigate to="/" replace /> : children
}

// blocks access to pages that need a login
const RequireAuth = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/mood/:mood" element={<ResultsPage />} />
          {/* fortune teller - maps to GET /api/movies/random */}
          <Route path="/random" element={<ResultsPage />} />
          {/* big screen - maps to GET /api/movies/nowplaying */}
          <Route path="/nowplaying" element={<ResultsPage />} />
          <Route path="/movie/:id" element={<MovieDetailsPage />} />

          {/* guest only - logged in users get bounced to home */}
          <Route
            path="/login"
            element={
              <GuestOnly>
                <LoginPage />
              </GuestOnly>
            }
          />
          <Route
            path="/register"
            element={
              <GuestOnly>
                <RegisterPage />
              </GuestOnly>
            }
          />

          {/* protected - must be logged in */}
          <Route
            path="/watchlist"
            element={
              <RequireAuth>
                <WatchlistPage />
              </RequireAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <ProfilePage />
              </RequireAuth>
            }
          />

          {/* catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
