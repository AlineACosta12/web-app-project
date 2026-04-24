// MoodPlay — Not Found Page
// This page is shown when the user visits a route that does not exist.
// It gives a simple 404 message and provides a button to return to the home page.

import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="container">
      {/* Main error title */}
      <h1>404 — Page Not Found</h1>

      {/* Short explanation for the user */}
      <p>The page you are looking for does not exist.</p>

      {/* Navigation link back to the home page */}
      <Link to="/" className="btn">
        Go Home
      </Link>
    </section>
  );
}
