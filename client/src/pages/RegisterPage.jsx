// MoodPlay — Register Page
// This page allows new users to create a MoodPlay account.
// It performs client-side validation before sending the registration request.

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../services/api";

export default function RegisterPage() {
  const navigate = useNavigate();

  // Stores the registration form input values.
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  // Controls loading state and displays validation/API errors.
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Updates the correct form field when the user types.
  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // Handles account creation.
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // Client-side validation before calling the backend.
    if (
      !formData.username.trim() ||
      !formData.email.trim() ||
      !formData.password.trim()
    ) {
      setError("Username, email and password are required.");
      return;
    }

    if (formData.username.trim().length < 3) {
      setError("Username must be at least 3 characters long.");
      return;
    }

    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      await authApi.register(formData);

      // After successful registration, send the user to the login page.
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="container auth-page">
      <div>
        <form onSubmit={handleSubmit} className="auth-form">
          <h1>Create Account</h1>
          <p>Join MoodPlay and save movies to your watchlist.</p>

          {error && <p className="error-message">{error}</p>}

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
          />

          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Creating..." : "Register"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </section>
  );
}
