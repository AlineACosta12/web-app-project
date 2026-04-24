// MoodPlay — Main App Component
// Defines all frontend routes for the React application.
// The Layout component wraps pages with the shared Navbar and Footer.

import { Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import BackToTopButton from "./components/common/BackToTopButton";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MovieDetailsPage from "./pages/MovieDetailsPage";
import ProfilePage from "./pages/ProfilePage";
import ResultsPage from "./pages/ResultsPage";
import WatchlistPage from "./pages/WatchlistPage";
import SearchPage from "./pages/SearchPage";
import RatingsPage from "./pages/RatingsPage";
import NotFoundPage from "./pages/NotFoundPage";
import AboutPage from "./pages/AboutPage";
import "./App.css";

export default function App() {
  return (
    <>
      <Routes>
        {/* Shared layout route: all child pages render inside Layout's Outlet. */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="results" element={<ResultsPage />} />
          <Route path="movie/:id" element={<MovieDetailsPage />} />
          <Route path="watchlist" element={<WatchlistPage />} />
          <Route path="ratings" element={<RatingsPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>

      {/* Floating button shown after scrolling down the page. */}
      <BackToTopButton />
    </>
  );
}
