// src/layouts/components/Header.jsx
import { useEffect, useState } from "react";
import { FaHome, FaListAlt, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  const [transparent, setTransparent] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      let scrolled = false;

      if (window.scrollY > 0) scrolled = true;
      if (document.body.scrollTop > 0) scrolled = true;
      if (document.documentElement.scrollTop > 0) scrolled = true;

      document.querySelectorAll("*").forEach((el) => {
        if (el.scrollTop > 0) scrolled = true;
      });

      console.log("[Header][DEBUG] pathname:", location.pathname, "scrolled:", scrolled);

      if (location.pathname.startsWith("/place/")) {
        setTransparent(!scrolled);
      } else {
        setTransparent(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    const observer = new MutationObserver(() => handleScroll());
    observer.observe(document.body, { childList: true, subtree: true });

    const interval = setInterval(handleScroll, 500);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
      clearInterval(interval);
    };
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-20 p-4 px-8 flex justify-between items-center shadow-lg transition-colors duration-300
        ${transparent ? "bg-transparent text-white" : "bg-white text-black"}`}
    >
      <h1 className="text-xl font-bold">BeroTravel</h1>
      <nav className="flex space-x-6">
        <Link
          to="/home"
          className={`flex items-center gap-2 transition-colors duration-300 ${
            transparent ? "text-white hover:text-gray-300" : "text-black hover:text-gray-600"
          }`}
        >
          <FaHome /> Home
        </Link>
        <Link
          to="/place"
          className={`flex items-center gap-2 transition-colors duration-300 ${
            transparent ? "text-white hover:text-gray-300" : "text-black hover:text-gray-600"
          }`}
        >
          <FaListAlt /> Khám phá
        </Link>
        <Link
          to="/"
          className={`flex items-center gap-2 transition-colors duration-300 ${
            transparent ? "text-white hover:text-gray-300" : "text-black hover:text-gray-600"
          }`}
        >
          <FaMapMarkerAlt /> Bản đồ
        </Link>
        <Link
          to="/profile"
          className={`flex items-center gap-2 transition-colors duration-300 ${
            transparent ? "text-white hover:text-gray-300" : "text-black hover:text-gray-600"
          }`}
        >
          <FaUser /> Profile
        </Link>
      </nav>
    </header>
  );
}
