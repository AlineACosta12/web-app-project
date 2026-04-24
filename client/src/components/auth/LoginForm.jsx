// MoodPlay — Login Form Component
// Reusable form used by LoginPage.
// It collects the user's email and password and passes submission handling back to the parent page.

export default function LoginForm({
  formData,
  setFormData,
  onSubmit,
  loading,
  error,
}) {
  // Updates the correct form field when the user types.
  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <form onSubmit={onSubmit} className="auth-form">
      <h1>Login</h1>
      <p>Access your MoodPlay account.</p>

      {/* Display validation or backend login errors. */}
      {error && <p className="error-message">{error}</p>}

      <label htmlFor="login-email">Email</label>
      <input
        id="login-email"
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <label htmlFor="login-password">Password</label>
      <input
        id="login-password"
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />

      <button type="submit" className="btn" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
