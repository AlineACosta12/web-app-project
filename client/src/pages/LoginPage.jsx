// MoodPlay — Login Page
// This page allows existing users to log in using their email and password.
// It performs basic client-side validation before sending the login request.

import { useState } from "react";
import { Link } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";
import { authApi, pickUser } from "../services/api";

export default function LoginPage() {
  // Stores the email and password entered by the user.
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Controls loading state and displays validation/API errors.
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handles login form submission.
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // Client-side validation before calling the backend.
    if (!formData.email.trim() || !formData.password.trim()) {
      setError("Email and password are required.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      // Send login request to backend/session API.
      const data = await authApi.login(formData);
      const user = pickUser(data);

      // Store basic user data so the UI can update after login.
      localStorage.setItem("user", JSON.stringify(user || {}));

      // Force refresh so Navbar reads the logged-in user immediately.
      window.location.href = "/";
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="container auth-page">
      <div>
        <LoginForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
        />

        <p className="auth-switch">
          Do not have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </section>
  );
}
