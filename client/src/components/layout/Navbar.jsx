// MoodPlay — Navbar Component
// Displays the main navigation bar across the application.
// It checks the current backend session, updates the UI for logged-in users,
// and provides login, register, profile, watchlist, and logout navigation.

import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/MoodPlay_logo.png";
import { authApi, pickUser } from "../../services/api";

export default function Navbar() {
  const navigate = useNavigate();

  // Stores the logged-in user after checking the session.
  const [user, setUser] = useState(null);

  // Prevents login/register buttons flashing while the session is being checked.
  const [checkingSession, setCheckingSession] = useState(true);

  // Check whether the user still has a valid backend session.
  useEffect(() => {
    async function checkSession() {
      try {
        const data = await authApi.me();
        const currentUser = pickUser(data);

        setUser(currentUser);
        localStorage.setItem("user", JSON.stringify(currentUser));
      } catch {
        setUser(null);
        localStorage.removeItem("user");
      } finally {
        setCheckingSession(false);
      }
    }

    checkSession();
  }, []);

  // Search state for the inline navbar search bar.
  const [searchInput, setSearchInput] = useState("");

  function handleSearch(e) {
    e.preventDefault();
    const q = searchInput.trim();
    if (!q) return;
    setSearchInput("");
    navigate(`/search?q=${encodeURIComponent(q)}`);
  }

  // Logs the user out, clears saved user data, and redirects to login.
  async function handleLogout() {
    try {
      await authApi.logout();
    } catch (err) {
      console.log(err.message);
    }

    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  }

  return (
    <header className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="logo">
          <img src={logo} alt="MoodPlay logo" className="logo-img" />
        </Link>

        <nav className="nav-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/about">About</NavLink>

          {/* Protected navigation links only appear after login. */}
          {user && <NavLink to="/watchlist">Watchlist</NavLink>}
          {user && <NavLink to="/ratings">Ratings</NavLink>}
          {user && <NavLink to="/profile">Profile</NavLink>}
        </nav>

        <form onSubmit={handleSearch} className="navbar-search-form">
          <input
            type="text"
            className="navbar-search-input"
            placeholder="Search movies..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button type="submit" className="navbar-search-btn" aria-label="Search">
            🔍
          </button>
        </form>

        <div className="nav-actions">
          {checkingSession ? null : !user ? (
            <>
              <Link to="/login" className="nav-auth-btn nav-login-btn">
                Login
              </Link>

              <Link to="/register" className="nav-auth-btn nav-register-btn">
                Register
              </Link>
            </>
          ) : (
            <>
              <span className="welcome-text">
                Hi, <strong>{user?.username || "User"}</strong>
              </span>

              <button
                onClick={handleLogout}
                className="nav-auth-btn nav-logout-btn"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
