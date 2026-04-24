// MoodPlay — Layout Component
// Provides the shared page structure for the application.
// Navbar and Footer stay visible across pages, while Outlet renders the selected route.

import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="app-shell">
      <Navbar />

      <main className="page-content">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
