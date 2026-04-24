// MoodPlay — Back To Top Button Component
// Displays a floating button when the user scrolls down the page.
// When clicked, it smoothly scrolls the user back to the top.

import { useEffect, useState } from "react";

export default function BackToTopButton() {
  // Controls whether the button is visible on screen.
  const [visible, setVisible] = useState(false);

  // Listen for page scrolling and show the button after the user scrolls down.
  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 400);
    }

    window.addEventListener("scroll", handleScroll);

    // Clean up the scroll listener when the component is removed.
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Smoothly scrolls back to the top of the page.
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // Hide the button until the user has scrolled enough.
  if (!visible) return null;

  return (
    <button className="back-to-top-btn" onClick={scrollToTop}>
      ↑ Top
    </button>
  );
}
